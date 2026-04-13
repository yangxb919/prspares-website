#!/usr/bin/env python3
"""Fetch single-day GA4 data and write Analytics/daily/YYYY-MM-DD.md.

Usage:
  python3 Analytics/scripts/ga4_fetch_daily.py 2026-04-04 [2026-04-05 ...]
"""
import os, sys, warnings
warnings.filterwarnings("ignore")

from pathlib import Path
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest, DateRange, Dimension, Metric, OrderBy
)

ROOT = Path(__file__).resolve().parents[2]
KEY = ROOT / ".secrets" / "ga4-key.json"
PROPERTY_ID = "502760218"
DAILY_DIR = ROOT / "Analytics" / "daily"

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(KEY)
client = BetaAnalyticsDataClient()


def run(date, dims, mets, order_metric=None, limit=20):
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        date_ranges=[DateRange(start_date=date, end_date=date)],
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


def fmt_engagement(seconds):
    s = int(float(seconds or 0))
    if s >= 60:
        return f"{s//60}m {s%60}s"
    return f"{s}s"


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
    tq_raw = run(date, ["customEvent:traffic_quality_label"],
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
        date=date, active=int(active), new=int(new), ev=int(ev),
        sess=int(sess), ke=int(ke), avg_eng=avg_eng, eng_rate=eng_rate,
        pages=pages, sources=sources, cities=cities, channels=channels,
        conversions=conversion_events, traffic_quality=traffic_quality,
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
{tq_yaml.rstrip() if tq_yaml.strip() else "  - label: \"(not set)\"\n    active_users: 0\n    sessions: 0\n    event_count: 0"}
notes: "通过 GA4 Data API (服务账号 ga4-reader) 拉取，数据为 GA4 最终值（非 Today 实时）"
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
- **Leads (generate_lead)：{leads}**
- **Thank You Page Views：{thank_you}**

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
- 数据来源：GA4 Data API (Property {PROPERTY_ID})，via 服务账号 `ga4-reader@prspares-ga4.iam.gserviceaccount.com`
"""
    out.write_text(content)
    print(f"✓ wrote {out.relative_to(ROOT)} (au={d['active']} sess={d['sess']} ev={d['ev']})")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    for date in sys.argv[1:]:
        write_daily(fetch_day(date))
