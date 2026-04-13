#!/usr/bin/env python3
"""Fetch GA4 weekly aggregate and write Analytics/weekly/YYYY-WXX.md.

Usage:
  python3 Analytics/scripts/ga4_fetch_weekly.py 2026-W14
  python3 Analytics/scripts/ga4_fetch_weekly.py 2026-03-30 2026-04-05  # explicit range
"""
import os, sys, warnings
from datetime import date, timedelta
warnings.filterwarnings("ignore")

from pathlib import Path
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest, DateRange, Dimension, Metric, OrderBy
)

ROOT = Path(__file__).resolve().parents[2]
KEY = ROOT / ".secrets" / "ga4-key.json"
PROPERTY_ID = "502760218"
WEEKLY_DIR = ROOT / "Analytics" / "weekly"

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(KEY)
client = BetaAnalyticsDataClient()


def iso_week_range(year, week):
    # ISO Monday of given week
    jan4 = date(year, 1, 4)
    start_of_w1 = jan4 - timedelta(days=jan4.isoweekday() - 1)
    monday = start_of_w1 + timedelta(weeks=week - 1)
    sunday = monday + timedelta(days=6)
    return monday, sunday


def run(start, end, dims, mets, order_metric=None, limit=20):
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        date_ranges=[DateRange(start_date=start, end_date=end)],
        dimensions=[Dimension(name=d) for d in dims],
        metrics=[Metric(name=m) for m in mets],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name=order_metric or mets[0]),
                           desc=True)] if mets else [],
        limit=limit,
    )
    resp = client.run_report(req)
    return [
        ([dv.value for dv in r.dimension_values], [mv.value for mv in r.metric_values])
        for r in resp.rows
    ]


def fmt_eng(seconds):
    s = int(float(seconds or 0))
    return f"{s//60}m {s%60}s" if s >= 60 else f"{s}s"


def fetch_week(start, end):
    tot = run(start, end, [], [
        "activeUsers", "newUsers", "eventCount",
        "userEngagementDuration", "sessions", "engagedSessions",
        "engagementRate", "keyEvents",
    ])
    av = tot[0][1] if tot else ["0"] * 8
    active, new, ev, eng_dur, sess, eng_sess, eng_rate, ke = (float(v) for v in av)
    avg_eng = fmt_eng(eng_dur / active if active else 0)

    channels = run(start, end, ["sessionDefaultChannelGroup"],
                    ["sessions", "engagedSessions", "userEngagementDuration",
                     "keyEvents", "engagementRate"])
    sources = run(start, end, ["sessionSourceMedium"], ["sessions"], limit=15)
    pages = run(start, end, ["pagePath", "pageTitle"],
                ["screenPageViews", "activeUsers", "eventCount"],
                order_metric="screenPageViews", limit=10)
    landings = run(start, end, ["landingPage"],
                   ["sessions", "activeUsers", "keyEvents"],
                   order_metric="sessions", limit=10)
    cities = run(start, end, ["city"], ["activeUsers"], limit=10)

    # Traffic quality breakdown
    tq_raw = run(start, end, ["customEvent:traffic_quality_label"],
                 ["activeUsers", "sessions", "eventCount"], limit=5)
    traffic_quality = {}
    for (dims, mets) in tq_raw:
        label = dims[0] if dims[0] else "(not set)"
        traffic_quality[label] = {
            "active_users": int(float(mets[0])),
            "sessions": int(float(mets[1])),
            "event_count": int(float(mets[2])),
        }

    return dict(
        start=start, end=end,
        active=int(active), new=int(new), ev=int(ev), sess=int(sess),
        eng_sess=int(eng_sess), eng_rate=f"{round(eng_rate*100,2)}%",
        ke=int(ke), avg_eng=avg_eng,
        channels=channels, sources=sources, pages=pages,
        landings=landings, cities=cities, traffic_quality=traffic_quality,
    )


def write_weekly(week_label, d):
    out = WEEKLY_DIR / f"{week_label}.md"

    # channel yaml + table
    ch_yaml = ""
    ch_md_rows = []
    total_sess = sum(int(float(m[0])) for _, m in d["channels"]) or 1
    for (dims, m) in d["channels"]:
        ch = dims[0] or "(unset)"
        s, es, edur, k, er = (float(x) for x in m)
        avg = fmt_eng(edur / max(int(s), 1))
        pct = f"{round(s/total_sess*100,1)}%"
        ch_yaml += (
            f"  - channel: \"{ch}\"\n"
            f"    sessions: {int(s)}\n"
            f"    session_pct: \"{pct}\"\n"
            f"    engagement_rate: \"{round(er*100,2)}%\"\n"
            f"    avg_engagement_time: \"{avg}\"\n"
            f"    key_events: {int(k)}\n"
        )
        ch_md_rows.append(f"| {ch} | {int(s)} | {pct} | {round(er*100,2)}% | {avg} | {int(k)} |")
    ch_md = "\n".join(ch_md_rows)

    src_md = "\n".join(f"| {dims[0]} | {int(float(m[0]))} |" for dims, m in d["sources"])

    pages_md = "\n".join(
        f"| {(dims[1] or dims[0])[:80]} | {int(float(m[0]))} | {int(float(m[1]))} | {int(float(m[2]))} |"
        for dims, m in d["pages"]
    )

    land_md = "\n".join(
        f"| {dims[0]} | {int(float(m[0]))} | {int(float(m[1]))} | {int(float(m[2]))} |"
        for dims, m in d["landings"]
    )
    top_landings = [dims[0] for dims, _ in d["landings"][:3]]
    while len(top_landings) < 3:
        top_landings.append("")

    # top articles = landing pages under /blog
    article_landings = [dims[0] for dims, _ in d["landings"] if dims[0].startswith("/blog")][:3]
    while len(article_landings) < 3:
        article_landings.append("")

    cities_md = "\n".join(
        f"| {dims[0] or '(not set)'} | {int(float(m[0]))} |" for dims, m in d["cities"]
    )

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

    content = f"""---
week: "{week_label}"
date_range: "{d['start']} ~ {d['end']}"
type: weekly
property: phonerepairspares.com
active_users: {d['active']}
new_users: {d['new']}
event_count: {d['ev']}
avg_engagement_time: "{d['avg_eng']}"
sessions_total: {d['sess']}
engaged_sessions: {d['eng_sess']}
engagement_rate: "{d['eng_rate']}"
key_events_total: {d['ke']}
traffic_by_channel:
{ch_yaml.rstrip()}
top_landing_1: "{top_landings[0]}"
top_landing_2: "{top_landings[1]}"
top_landing_3: "{top_landings[2]}"
top_article_1: "{article_landings[0]}"
top_article_2: "{article_landings[1]}"
top_article_3: "{article_landings[2]}"
traffic_quality:
{tq_yaml.rstrip() if tq_yaml.strip() else '  - label: "(not set)"'}
lead_acquisition:
  new_leads_total: 0
  direct: 0
  ai_referral: 0
  organic_search: 0
  paid_search: 0
notes: "通过 GA4 Data API (服务账号 ga4-reader) 拉取；lead_acquisition 待人工/contact_submissions 库回填"
---

# GA4 Weekly Report — {week_label}

## 周概要 ({d['start']} ~ {d['end']})
- 活跃用户：{d['active']}
- 新用户：{d['new']}
- 事件总量：{d['ev']}
- 总会话数：{d['sess']}
- Engaged Sessions：{d['eng_sess']}
- Engagement Rate：{d['eng_rate']}
- Avg Engagement Time：{d['avg_eng']}
- Key Events：{d['ke']}

## 渠道分析（Channel Group）
| Channel | Sessions | % | Engagement Rate | Avg Eng | Key Events |
|---------|----------|---|-----------------|---------|------------|
{ch_md}

## Source / Medium Top
| Source / Medium | Sessions |
|-----------------|----------|
{src_md}

## Top Pages
| Page | Views | Active Users | Events |
|------|-------|--------------|--------|
{pages_md}

## Landing Page 分析
| Landing Page | Sessions | Active Users | Key Events |
|--------------|----------|--------------|------------|
{land_md}

## 文章表现 (Top /blog landing pages)
1. {article_landings[0] or '—'}
2. {article_landings[1] or '—'}
3. {article_landings[2] or '—'}

## 地域分布（City）
| City | Active Users |
|------|--------------|
{cities_md}

## 流量质量分布（Traffic Quality）
| Label | Active Users | Sessions | Event Count |
|-------|--------------|----------|-------------|
{tq_md}

## Lead 获取
> 待人工 / `contact_submissions` 表回填。脚本暂未接入数据库。

## 下周关注点
- _待复盘补充_
"""
    out.write_text(content)
    print(f"✓ wrote {out.relative_to(ROOT)} (au={d['active']} sess={d['sess']} ev={d['ev']} ke={d['ke']})")


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        print(__doc__); sys.exit(1)
    if len(args) == 1 and "-W" in args[0]:
        y, w = args[0].split("-W")
        mon, sun = iso_week_range(int(y), int(w))
        write_weekly(args[0], fetch_week(mon.isoformat(), sun.isoformat()))
    elif len(args) == 2:
        start, end = args
        # auto label from ISO week of start
        d0 = date.fromisoformat(start)
        y, w, _ = d0.isocalendar()
        write_weekly(f"{y}-W{w:02d}", fetch_week(start, end))
    else:
        print(__doc__); sys.exit(1)
