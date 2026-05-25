#!/usr/bin/env python3
"""Fetch single-day GA4 data + Supabase contact_submissions and write Analytics/daily/YYYY-MM-DD.md.

Usage:
  python3 Analytics/scripts/ga4_fetch_daily.py 2026-04-04 [2026-04-05 ...]
"""
import os, sys, json, re, warnings
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import quote
from urllib.error import URLError, HTTPError

warnings.filterwarnings("ignore")

from google.api_core.exceptions import InvalidArgument
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest, DateRange, Dimension, Metric, OrderBy,
    FilterExpression, FilterExpressionList, Filter,
)

ROOT = Path(__file__).resolve().parents[2]
KEY = ROOT / ".secrets" / "ga4-key.json"
PROPERTY_ID = "502760218"
DAILY_DIR = ROOT / "Analytics" / "daily"
CHATGPT_SOURCE_PREFIX = "chatgpt.com"
CHATGPT_EVENT_NAMES = ("begin_form", "generate_lead")

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(KEY)
client = BetaAnalyticsDataClient()

# --- Load .env.local for Supabase credentials (if not already in env) ---
# Manual parse to avoid python-dotenv dependency (uv run --with doesn't
# include it by default; falling back to manual parse keeps the call
# `uv run --with google-analytics-data --with google-auth ...` minimal).
def _load_dotenv_manual(path):
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        k, v = k.strip(), v.strip()
        # Strip surrounding quotes if present
        if v and v[0] == v[-1] and v[0] in ('"', "'"):
            v = v[1:-1]
        if k and v and k not in os.environ:
            os.environ[k] = v

_load_dotenv_manual(ROOT / ".env.local")

CST = timezone(timedelta(hours=8))  # Asia/Shanghai = UTC+8

# --- Test / spam patterns for lead cleaning ---
_TEST_PATTERNS = re.compile(
    r'(?:^test$|^testing|test\s*submit|测试|example\.com|@test\.|asdf{2,}|qwer{2,}|dummy\s*data|lorem\s*ipsum)',
    re.IGNORECASE,
)


def _is_test(row):
    """Return True if any text field looks like a test submission."""
    fields = [
        row.get("name", ""),
        row.get("email", ""),
        row.get("message", ""),
        row.get("company", ""),
        row.get("product_interest", ""),
        row.get("source", ""),
        row.get("page_url", ""),
    ]
    return any(_TEST_PATTERNS.search(str(f or "")) for f in fields)


def _dedup_key(row):
    """Key for same-day duplicate detection: email + product_interest + message."""
    return (
        (row.get("email") or "").strip().lower(),
        (row.get("product_interest") or "").strip().lower(),
        (row.get("message") or "").strip().lower()[:200],
    )


def _is_lp(row):
    """Check if lead came from a landing page (google-ads-factory-direct)."""
    fields = [
        row.get("source", ""),
        row.get("page_url", ""),
        row.get("message", ""),
    ]
    return any("google-ads-factory-direct" in str(f or "").lower() for f in fields)


def _is_wholesale(row):
    """Check if lead came from wholesale-inquiry form."""
    fields = [
        row.get("source", ""),
        row.get("page_url", ""),
        row.get("message", ""),
    ]
    return any("wholesale-inquiry" in str(f or "").lower() for f in fields)


def _source_bucket(row):
    """Return a short label for source distribution."""
    src = row.get("source", "") or ""
    page = row.get("page_url", "") or ""
    if "google-ads-factory-direct" in src or "google-ads-factory-direct" in page:
        return "LP (google-ads)"
    if "wholesale-inquiry" in src or "wholesale-inquiry" in page:
        return "wholesale-inquiry"
    if src:
        return src
    if "/contact" in page:
        return "contact-page"
    return "other"


def fetch_supabase_leads(date_str):
    """Query Supabase contact_submissions for a given business day (Asia/Shanghai).

    Returns dict with supabase_total_leads, supabase_clean_leads, etc.
    Gracefully returns zeros + status if env vars are missing.
    """
    result = {
        "supabase_status": "ok",
        "supabase_total_leads": 0,
        "supabase_clean_leads": 0,
        "supabase_excluded_leads": 0,
        "supabase_lp_leads": 0,
        "supabase_wholesale_leads": 0,
        "supabase_sources": {},
        "supabase_leads_detail": [],   # list of dicts for the table
        "supabase_excluded_detail": [],
    }

    # Resolve env vars
    sb_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
    sb_key = (
        os.environ.get("SUPABASE_SERVICE_ROLE")
        or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        or os.environ.get("SUPABASE_SERVICE_KEY")
    )

    if not sb_url or not sb_key:
        missing = []
        if not sb_url:
            missing.append("NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL")
        if not sb_key:
            missing.append("SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE")
        result["supabase_status"] = f"missing_env ({', '.join(missing)})"
        return result

    # Convert business day (Asia/Shanghai) to UTC range
    day = datetime.strptime(date_str, "%Y-%m-%d")
    start_cst = day.replace(hour=0, minute=0, second=0, tzinfo=CST)
    end_cst = start_cst + timedelta(days=1)
    start_utc = start_cst.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    end_utc = end_cst.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    # Build PostgREST query
    select_cols = "id,created_at,name,email,company,phone,message,product_interest,source,page_url,status"
    filter_and = f"and=(created_at.gte.{start_utc},created_at.lt.{end_utc})"
    url = f"{sb_url.rstrip('/')}/rest/v1/contact_submissions?select={select_cols}&{filter_and}&order=created_at.asc"

    req = Request(url)
    req.add_header("apikey", sb_key)
    req.add_header("Authorization", f"Bearer {sb_key}")
    req.add_header("Accept", "application/json")

    try:
        with urlopen(req, timeout=15) as resp:
            rows = json.loads(resp.read().decode())
    except HTTPError as e:
        body = ""
        try:
            body = e.read().decode()[:200]
        except Exception:
            pass
        result["supabase_status"] = f"http_error ({e.code}: {body})"
        return result
    except (URLError, OSError) as e:
        result["supabase_status"] = f"network_error ({e})"
        return result

    if not isinstance(rows, list):
        result["supabase_status"] = f"unexpected_response ({str(rows)[:100]})"
        return result

    result["supabase_total_leads"] = len(rows)

    # --- Cleaning ---
    clean = []
    excluded = []
    seen_keys = set()

    for row in rows:
        reason = None

        # Test detection
        if _is_test(row):
            reason = "test"

        # Duplicate detection (same day, same email + product_interest + message)
        if not reason:
            dk = _dedup_key(row)
            if dk[0] and dk in seen_keys:  # only dedup if email is non-empty
                reason = "duplicate"
            else:
                seen_keys.add(dk)

        if reason:
            row["_exclusion_reason"] = reason
            excluded.append(row)
        else:
            row["_exclusion_reason"] = None
            clean.append(row)

    result["supabase_clean_leads"] = len(clean)
    result["supabase_excluded_leads"] = len(excluded)
    result["supabase_lp_leads"] = sum(1 for r in clean if _is_lp(r))
    result["supabase_wholesale_leads"] = sum(1 for r in clean if _is_wholesale(r))

    # Source distribution (clean leads only)
    src_dist = {}
    for r in clean:
        bucket = _source_bucket(r)
        src_dist[bucket] = src_dist.get(bucket, 0) + 1
    result["supabase_sources"] = src_dist

    # Detail lists (for markdown table, max 20)
    all_rows = clean + excluded
    all_rows.sort(key=lambda r: r.get("created_at", ""))
    result["supabase_leads_detail"] = all_rows[:20]
    result["supabase_excluded_detail"] = excluded

    return result


def run(date, dims, mets, order_metric=None, limit=20, dimension_filter=None):
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        date_ranges=[DateRange(start_date=date, end_date=date)],
        dimensions=[Dimension(name=d) for d in dims],
        metrics=[Metric(name=m) for m in mets],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name=order_metric or mets[0]),
                           desc=True)] if mets else [],
        dimension_filter=dimension_filter,
        limit=limit,
    )
    resp = client.run_report(req)
    return [
        ([dv.value for dv in r.dimension_values], [mv.value for mv in r.metric_values])
        for r in resp.rows
    ]


def fmt_engagement(seconds):
    s = int(float(seconds or 0))
    if s >= 60:
        return f"{s//60}m {s%60}s"
    return f"{s}s"


def _sum_metric_values(rows, metric_index=0):
    return sum(int(float(mets[metric_index])) for _, mets in rows if len(mets) > metric_index)


def _event_counts_from_rows(rows, event_names):
    counts = {name: 0 for name in event_names}
    for dims, mets in rows:
        if dims and dims[0] in counts and mets:
            counts[dims[0]] = int(float(mets[0]))
    return counts


def _source_medium_contains(value):
    return FilterExpression(
        filter=Filter(
            field_name="sessionSourceMedium",
            string_filter=Filter.StringFilter(
                match_type=Filter.StringFilter.MatchType.CONTAINS,
                value=value,
                case_sensitive=False,
            ),
        )
    )


def _event_name_in(event_names):
    return FilterExpression(
        filter=Filter(
            field_name="eventName",
            in_list_filter=Filter.InListFilter(
                values=list(event_names),
                case_sensitive=True,
            ),
        )
    )


def _and_filters(*expressions):
    return FilterExpression(
        and_group=FilterExpressionList(expressions=list(expressions))
    )


def fetch_chatgpt_metrics(date):
    source_filter = _source_medium_contains(CHATGPT_SOURCE_PREFIX)
    event_filter = _and_filters(source_filter, _event_name_in(CHATGPT_EVENT_NAMES))

    session_rows = run(
        date,
        ["sessionSourceMedium"],
        ["sessions"],
        limit=20,
        dimension_filter=source_filter,
    )
    event_rows = run(
        date,
        ["eventName"],
        ["eventCount"],
        limit=10,
        dimension_filter=event_filter,
    )
    event_counts = _event_counts_from_rows(event_rows, CHATGPT_EVENT_NAMES)

    return {
        "chatgpt_sessions": _sum_metric_values(session_rows),
        "chatgpt_begin_form": event_counts["begin_form"],
        "chatgpt_generate_lead": event_counts["generate_lead"],
    }


def fetch_day(date):
    # totals
    tot = run(date, [], ["activeUsers", "newUsers", "eventCount",
                          "userEngagementDuration", "sessions", "keyEvents",
                          "engagementRate"])
    if not tot:
        active = new = ev = sess = ke = 0
        avg_eng = "0s"
        eng_rate = "0%"
    else:
        vals = tot[0][1]
        active, new, ev, eng_dur, sess, ke, eng_rate_v = (float(v) for v in vals)
        avg_eng = fmt_engagement(eng_dur / active if active else 0)
        eng_rate = f"{round(eng_rate_v*100,2)}%"

    pages = run(date, ["pagePath", "pageTitle"],
                ["screenPageViews", "activeUsers", "eventCount", "bounceRate"],
                order_metric="screenPageViews", limit=10)
    sources = run(date, ["sessionSourceMedium"], ["sessions"], limit=15)
    cities = run(date, ["city"], ["activeUsers"], limit=10)
    channels = run(date, ["sessionDefaultChannelGroup"],
                    ["sessions", "engagedSessions", "userEngagementDuration",
                     "keyEvents"], limit=15)

    # Conversion events breakdown — pull specific high-value events by name
    conversions = run(date, ["eventName"],
                      ["eventCount"],
                      limit=50)
    # Filter to conversion-related events only
    conversion_events = {
        "generate_lead": 0,
        "ads_conversion": 0,
        "thank_you_page_view": 0,
        "quote_cta_click": 0,
        "whatsapp_click": 0,
        "contact_click": 0,
        "begin_form": 0,
        "page_view": 0,
    }
    for (dims, mets) in conversions:
        ename = dims[0]
        if ename in conversion_events:
            conversion_events[ename] = int(float(mets[0]))

    # Traffic quality breakdown (custom dimension from analytics.ts scoring)
    try:
        tq_raw = run(date, ["customEvent:traffic_quality_label"],
                     ["activeUsers", "sessions", "eventCount"], limit=5)
    except InvalidArgument:
        tq_raw = []
    traffic_quality = {}
    for (dims, mets) in tq_raw:
        label = dims[0] if dims[0] else "(not set)"
        traffic_quality[label] = {
            "active_users": int(float(mets[0])),
            "sessions": int(float(mets[1])),
            "event_count": int(float(mets[2])),
        }

    chatgpt = fetch_chatgpt_metrics(date)

    # Supabase contact_submissions
    sb = fetch_supabase_leads(date)

    return dict(
        date=date, active=int(active), new=int(new), ev=int(ev),
        sess=int(sess), ke=int(ke), avg_eng=avg_eng, eng_rate=eng_rate,
        pages=pages, sources=sources, cities=cities, channels=channels,
        conversions=conversion_events, traffic_quality=traffic_quality,
        chatgpt=chatgpt, supabase=sb,
    )


def write_daily(d):
    date = d["date"]
    out = DAILY_DIR / f"{date}.md"

    pages_yaml = ""
    for (dims, mets) in d["pages"]:
        path, title = dims[0], dims[1]
        views, au, ec, br = mets
        page_label = f"{title} ({path})" if title else path
        pages_yaml += (
            f"  - page: \"{page_label.replace(chr(34), chr(39))}\"\n"
            f"    views: {int(float(views))}\n"
            f"    active_users: {int(float(au))}\n"
            f"    event_count: {int(float(ec))}\n"
            f"    bounce_rate: \"{round(float(br)*100,1)}%\"\n"
        )

    src_yaml = ""
    for (dims, mets) in d["sources"]:
        src_yaml += (
            f"  - source_medium: \"{dims[0]}\"\n"
            f"    sessions: {int(float(mets[0]))}\n"
        )

    cities_yaml = ""
    for (dims, mets) in d["cities"]:
        cities_yaml += (
            f"  - city: \"{dims[0] or '(not set)'}\"\n"
            f"    active_users: {int(float(mets[0]))}\n"
        )

    # markdown tables
    pages_md = "\n".join(
        f"| {dims[1] or dims[0]} | {int(float(m[0]))} | {int(float(m[1]))} | {int(float(m[2]))} | {round(float(m[3])*100,1)}% |"
        for (dims, m) in d["pages"]
    )
    src_md = "\n".join(
        f"| {dims[0]} | {int(float(m[0]))} |" for (dims, m) in d["sources"]
    )
    cities_md = "\n".join(
        f"| {dims[0] or '(not set)'} | {int(float(m[0]))} |" for (dims, m) in d["cities"]
    )
    channels_md = "\n".join(
        f"| {dims[0]} | {int(float(m[0]))} | {int(float(m[1]))} | {int(float(m[3]))} |"
        for (dims, m) in d["channels"]
    )

    conv = d.get("conversions", {})
    conv_yaml = ""
    for ename, count in conv.items():
        conv_yaml += f"  {ename}: {count}\n"

    conv_md = "\n".join(
        f"| {ename} | {count} |" for ename, count in conv.items() if count > 0
    )
    if not conv_md:
        conv_md = "| (无转化事件) | 0 |"

    leads = conv.get("generate_lead", 0)
    thank_you = conv.get("thank_you_page_view", 0)
    ads_conv = conv.get("ads_conversion", 0)
    chatgpt = d.get("chatgpt", {})
    chatgpt_sessions = chatgpt.get("chatgpt_sessions", 0)
    chatgpt_begin_form = chatgpt.get("chatgpt_begin_form", 0)
    chatgpt_generate_lead = chatgpt.get("chatgpt_generate_lead", 0)

    # Traffic quality
    tq = d.get("traffic_quality", {})
    tq_yaml = ""
    for label, vals in tq.items():
        tq_yaml += (
            f"  - label: \"{label}\"\n"
            f"    active_users: {vals['active_users']}\n"
            f"    sessions: {vals['sessions']}\n"
            f"    event_count: {vals['event_count']}\n"
        )
    tq_md = "\n".join(
        f"| {label} | {vals['active_users']} | {vals['sessions']} | {vals['event_count']} |"
        for label, vals in tq.items()
    )
    if not tq_md:
        tq_md = "| (维度数据未就绪) | - | - | - |"
    tq_yaml_block = tq_yaml.rstrip()
    if not tq_yaml_block:
        tq_yaml_block = (
            '  - label: "(not set)"\n'
            "    active_users: 0\n"
            "    sessions: 0\n"
            "    event_count: 0"
        )

    # --- Supabase section ---
    sb = d.get("supabase", {})
    sb_status = sb.get("supabase_status", "unknown")
    sb_total = sb.get("supabase_total_leads", 0)
    sb_clean = sb.get("supabase_clean_leads", 0)
    sb_excluded = sb.get("supabase_excluded_leads", 0)
    sb_lp = sb.get("supabase_lp_leads", 0)
    sb_wholesale = sb.get("supabase_wholesale_leads", 0)
    sb_sources = sb.get("supabase_sources", {})
    sb_detail = sb.get("supabase_leads_detail", [])

    # Supabase frontmatter YAML
    sb_sources_yaml = ""
    for src_name, cnt in sb_sources.items():
        sb_sources_yaml += f"    {src_name}: {cnt}\n"
    if not sb_sources_yaml:
        sb_sources_yaml = "    (none): 0\n"

    sb_yaml = (
        f"supabase_status: \"{sb_status}\"\n"
        f"supabase_total_leads: {sb_total}\n"
        f"supabase_clean_leads: {sb_clean}\n"
        f"supabase_excluded_leads: {sb_excluded}\n"
        f"supabase_lp_leads: {sb_lp}\n"
        f"supabase_wholesale_leads: {sb_wholesale}\n"
        f"supabase_sources:\n"
        f"{sb_sources_yaml.rstrip()}"
    )

    # Supabase markdown table
    def _safe(v):
        """Sanitize value for markdown table cell."""
        s = str(v or "").replace("|", "/").replace("\n", " ")
        if len(s) > 60:
            s = s[:57] + "..."
        return s

    sb_table_rows = []
    for row in sb_detail:
        created = row.get("created_at", "")
        # Convert UTC to CST for display
        try:
            dt = datetime.fromisoformat(created.replace("Z", "+00:00"))
            created_display = dt.astimezone(CST).strftime("%H:%M")
        except Exception:
            created_display = created[:16] if created else "-"
        exclusion = row.get("_exclusion_reason") or ""
        status_display = exclusion if exclusion else "clean"
        sb_table_rows.append(
            f"| {created_display} | {_safe(row.get('name'))} | {_safe(row.get('email'))} "
            f"| {_safe(row.get('company'))} | {_safe(row.get('source'))} "
            f"| {_safe(row.get('page_url'))} | {_safe(row.get('product_interest'))} "
            f"| {status_display} |"
        )
    sb_table_md = "\n".join(sb_table_rows) if sb_table_rows else "| (当天无询盘) | - | - | - | - | - | - | - |"

    # Supabase source distribution markdown
    sb_src_md = "\n".join(
        f"| {src_name} | {cnt} |" for src_name, cnt in sb_sources.items()
    )
    if not sb_src_md:
        sb_src_md = "| (none) | 0 |"

    # Supabase status note
    sb_note = ""
    if sb_status != "ok":
        sb_note = f"\n> **Note**: Supabase 查询状态异常: `{sb_status}`。数据可能不完整。\n"

    content = f"""---
date: "{date}"
type: daily
property: phonerepairspares.com
active_users: {d['active']}
new_users: {d['new']}
event_count: {d['ev']}
avg_engagement_time: "{d['avg_eng']}"
sessions_total: {d['sess']}
key_events: {d['ke']}
engagement_rate: "{d['eng_rate']}"
leads: {leads}
conversions:
{conv_yaml.rstrip()}
top_pages:
{pages_yaml.rstrip()}
sessions_by_source:
{src_yaml.rstrip()}
cities:
{cities_yaml.rstrip()}
traffic_quality:
{tq_yaml_block}
chatgpt_sessions: {chatgpt_sessions}
chatgpt_begin_form: {chatgpt_begin_form}
chatgpt_generate_lead: {chatgpt_generate_lead}
{sb_yaml}
notes: "GA4 Data API + Supabase contact_submissions，数据为 GA4 最终值 + Supabase 真实询盘"
---

# GA4 Daily Report — {date}

## 概要
- 活跃用户：{d['active']}
- 新用户：{d['new']}
- 事件总量：{d['ev']}
- 平均互动时长：{d['avg_eng']}
- 总会话数：{d['sess']}
- Key Events：{d['ke']}
- Engagement Rate：{d['eng_rate']}
- **GA4 Leads (generate_lead)：{leads}**
- **Supabase Clean Leads：{sb_clean}**
- **Thank You Page Views：{thank_you}**
- **Ads Conversion：{ads_conv}**
- **ChatGPT Sessions：{chatgpt_sessions}**
- **ChatGPT Begin Form：{chatgpt_begin_form}**
- **ChatGPT Leads (generate_lead)：{chatgpt_generate_lead}**

## ChatGPT 有效流量
- Sessions：{chatgpt_sessions}
- Begin Form：{chatgpt_begin_form}
- Generate Lead：{chatgpt_generate_lead}
- 观察口径：第 1 周不要求 referrer 立即上涨；第 2 周开始看 trend，并配合手动 ChatGPT 搜索做 spot check。

## Supabase 真实询盘（Ground Truth）
{sb_note}
- 总提交数：{sb_total}
- **有效询盘 (clean)：{sb_clean}**
- 排除数 (test/duplicate)：{sb_excluded}
- LP 询盘 (google-ads)：{sb_lp}
- Wholesale 询盘：{sb_wholesale}
- Supabase Status：`{sb_status}`

### 来源分布
| Source | Count |
|--------|-------|
{sb_src_md}

### 当日询盘明细（最多 20 条）
| Time (CST) | Name | Email | Company | Source | Page URL | Product Interest | Status |
|------------|------|-------|---------|--------|----------|------------------|--------|
{sb_table_md}

## 转化事件明细
| Event Name | Count |
|------------|-------|
{conv_md}

## 流量来源（Channel Group）
| Channel | Sessions | Engaged Sessions | Key Events |
|---------|----------|------------------|------------|
{channels_md}

## 流量来源（Session source / medium）
| Source / Medium | Sessions |
|-----------------|----------|
{src_md}

## Top Pages
| Page | Views | Active Users | Event Count | Bounce Rate |
|------|-------|--------------|-------------|-------------|
{pages_md}

## 地域分布（City）
| City | Active Users |
|------|--------------|
{cities_md}

## 流量质量分布（Traffic Quality）
| Label | Active Users | Sessions | Event Count |
|-------|--------------|----------|-------------|
{tq_md}

## 备注
- GA4 数据来源：GA4 Data API (Property {PROPERTY_ID})，via 服务账号 `ga4-reader@prspares-ga4.iam.gserviceaccount.com`
- Supabase 数据来源：`contact_submissions` 表，按业务日 (Asia/Shanghai) 统计，service-role 查询
"""
    out.write_text(content)
    print(f"✓ wrote {out.relative_to(ROOT)} (au={d['active']} sess={d['sess']} ev={d['ev']} sb_clean={sb_clean})")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    for date in sys.argv[1:]:
        write_daily(fetch_day(date))
