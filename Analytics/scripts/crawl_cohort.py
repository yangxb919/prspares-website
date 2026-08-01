#!/usr/bin/env python3
"""20 URL 抓取 cohort 看板 —— 08-07 熔断判据的唯一数据源。

为什么要 cohort 而不是看全站数字：全站 222 未收录里混着 58 条 tag 页、13 条重定向、
18 条 canonical 归并——噪音占一半，全站数字涨跌说明不了 07-31 那批干预是否有效。
盯死 20 个 URL，每天记一次，08-07 只看这张表。

数据源（四路，任一路失败不影响其它）：
  1. GSC URL Inspection API —— coverage / lastCrawl / googleCanonical
  2. VPS nginx 日志 —— Googlebot 命中次数、最后命中、状态码；AI 爬虫命中次数
  3. GSC Search Analytics —— 近 7 天曝光/点击（判断"抓了之后有没有进搜索结果"）
  4. 本地 sitemap —— lastmod

用法：
  python3 Analytics/scripts/crawl_cohort.py                # 跑一次并存快照
  python3 Analytics/scripts/crawl_cohort.py --no-gsc       # 只跑日志（快，不耗 API 配额）
  python3 Analytics/scripts/crawl_cohort.py --compare      # 与上一份快照对比

需要 hermes venv：/Users/yangxiaobo/.hermes/hermes-agent/venv/bin/python3
"""
import argparse, json, re, subprocess, sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SNAP_DIR = ROOT / "Analytics" / "cohort"
BASE = "https://www.phonerepairspares.com"
SITE = "sc-domain:phonerepairspares.com"
SSH = "prspares"
AI_UAS = "ChatGPT-User|OAI-SearchBot|GPTBot|PerplexityBot|ClaudeBot"

# ── cohort 定义 ──────────────────────────────────────────────────────────
# A 组：GSC 报「已发现-尚未编入索引」的高价值正文。内部再分两类，用来分辨
#       "内链有没有用"——前 6 个有内链(4-13 条)，后 2 个是零入链孤儿页。
# B 组：07-31 干预过的页 + 两个已收录参照。
# C 组：稳定已收录的高流量页，用来分辨「全站抓取变化」还是「cohort 特异变化」。
COHORT = [
    # --- A: 未收录 × ChatGPT 在读（内容已被验证有价值）---
    ("A", "/blog/iphone-16-pro-max-screen-replacement-uk-guide",      "未收录·ChatGPT抓20次·0内链"),
    ("A", "/blog/iphone-13-screen-replacement-worth-it-2026",         "未收录·ChatGPT抓16次·4内链"),
    ("A", "/blog/common-iphone-screen-problems-2026",                 "未收录·ChatGPT抓12次·0内链"),
    ("A", "/blog/iphone-11-screen-replacement",                       "未收录·ChatGPT抓9次·2内链"),
    # --- A: 未收录 × 内链最多（若内链有效，这几个应最先被抓）---
    ("A", "/blog/best-phone-screen-models-stock-bulk-2026",           "未收录·13内链(最多)"),
    ("A", "/blog/first-wholesale-order-templates-repair-shop",        "未收录·12内链"),
    ("A", "/blog/buying-iphone-batteries-bulk-repair-business",       "未收录·11内链"),
    ("A", "/blog/cell-phone-parts-wholesale-sourcing-guide",          "未收录·10内链·B2B高价值"),
    # --- A: 未收录 × 零入链孤儿页（对照：内链是不是必要条件）---
    ("A", "/blog/black-screen-display-vs-board-problem",              "未收录·0内链(孤儿)"),
    ("A", "/blog/iphone-8-screen-replacement",                        "未收录·0内链(孤儿)"),
    # --- B: 07-31 干预过的 ---
    ("B", "/blog/moq-sample-orders-lead-time-wholesale",              "干预·hub156·新增3篇高流量页内链"),
    ("B", "/blog/top-10-phone-parts-suppliers-in-china",              "干预·榜单文·新增3篇内链+IndexNow"),
    ("B", "/products/screens/jk",                                     "干预·去模板化+id11内链·抓了未收"),
    ("B", "/products/screens/gx",                                     "参照·已收录·gx screen pos3"),
    ("B", "/products/screens-grade-guide",                            "参照·已收录·提交当天即抓"),
    # --- C: 稳定对照 ---
    ("C", "/blog/iphone-boot-loop-after-screen-replacement-causes",   "对照·7月98点击(全站第一)"),
    ("C", "/blog/samsung-s23-s24-screen-replacement-guide",           "对照·7月36点击"),
    ("C", "/blog/which-iphone-14-pro-max-screen-replacement-option-delivers-the-best-value-for-your-repair-business", "对照·7月31点击"),
    ("C", "/blog/is-your-iphone-14-pro-max-back-glass-worth-fixing-the-complete-cost-benefit-guide-for-repair-shop-owners", "对照·7月26点击"),
    ("C", "/",                                                        "对照·首页"),
]


def fetch_log_stats(paths):
    """从 VPS 拉每个 path 的 Googlebot / AI 爬虫命中。host 字段 2026-08-01 起才有。"""
    # 一次 ssh 取回全部爬虫行，本地做匹配，避免 20 次往返
    cmd = (
        "cd /var/log/nginx && { zcat access.log.*.gz 2>/dev/null; "
        "cat access.log.1 access.log 2>/dev/null; } | "
        f"grep -aE 'Googlebot|{AI_UAS}'"
    )
    try:
        out = subprocess.run(["ssh", SSH, cmd], capture_output=True, text=True, timeout=300)
        if out.returncode != 0:
            print(f"  ⚠ ssh 失败: {out.stderr[:120]}", file=sys.stderr)
            return {}
    except Exception as e:
        print(f"  ⚠ ssh 异常: {str(e)[:120]}", file=sys.stderr)
        return {}

    stats = {p: {"gbot": 0, "gbot_last": "", "gbot_codes": {}, "ai": 0, "gbot_main_host": 0} for p in paths}
    for line in out.stdout.splitlines():
        m = re.search(r'"(?:GET|HEAD) ([^ ?"]+)', line)
        if not m:
            continue
        path = m.group(1)
        if path not in stats:
            continue
        is_gbot = "Googlebot" in line
        s = stats[path]
        if is_gbot:
            s["gbot"] += 1
            tm = re.search(r"\[([^\]]+)\]", line)
            if tm:
                s["gbot_last"] = tm.group(1)[:11]
            cm = re.search(r'" (\d{3}) ', line)
            if cm:
                s["gbot_codes"][cm.group(1)] = s["gbot_codes"].get(cm.group(1), 0) + 1
            if "host=www.phonerepairspares.com" in line:
                s["gbot_main_host"] += 1
        else:
            s["ai"] += 1
    return stats


def fetch_gsc(paths):
    """URL Inspection：coverage / lastCrawl / googleCanonical。"""
    sys.path.insert(0, str(ROOT / "Analytics" / "scripts"))
    import gsc_fetch as G
    from googleapiclient.discovery import build
    svc = build("searchconsole", "v1", credentials=G.load_credentials(0))
    out = {}
    for p in paths:
        try:
            r = svc.urlInspection().index().inspect(
                body={"inspectionUrl": BASE + p, "siteUrl": SITE, "languageCode": "zh-CN"}
            ).execute()
            idx = r.get("inspectionResult", {}).get("indexStatusResult", {})
            out[p] = {
                "coverage": idx.get("coverageState", ""),
                "lastCrawl": (idx.get("lastCrawlTime") or "")[:10],
                "canonical": (idx.get("googleCanonical") or "").replace(BASE, ""),
                "verdict": idx.get("verdict", ""),
            }
        except Exception as e:
            out[p] = {"error": str(e)[:100]}
    return out


def fetch_impressions(paths, days=7):
    """近 N 天曝光/点击 —— 判断抓取之后有没有真的进搜索结果。"""
    sys.path.insert(0, str(ROOT / "Analytics" / "scripts"))
    import gsc_fetch as G
    from googleapiclient.discovery import build
    svc = build("searchconsole", "v1", credentials=G.load_credentials(0))
    end = date.today() - timedelta(days=1)
    start = end - timedelta(days=days)
    rows = G.query_search_analytics(svc, SITE, start.isoformat(), end.isoformat(), ["page"], 1000)
    by_page = {r["page"].replace(BASE, "") or "/": r for r in rows}
    return {p: {"impr": int(by_page.get(p, {}).get("impressions", 0)),
                "clicks": int(by_page.get(p, {}).get("clicks", 0))} for p in paths}


def sitemap_lastmod(paths):
    f = ROOT / "public" / "sitemap-0.xml"
    if not f.exists():
        return {p: "" for p in paths}
    s = f.read_text()
    out = {}
    for p in paths:
        seg = s.split(f"<loc>{BASE}{p}</loc>")
        out[p] = ""
        if len(seg) > 1:
            m = re.search(r"<lastmod>(.*?)</lastmod>", seg[1][:200])
            out[p] = m.group(1)[:10] if m else ""
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-gsc", action="store_true", help="跳过 GSC API（快，省配额）")
    ap.add_argument("--compare", action="store_true", help="与上一份快照对比")
    a = ap.parse_args()

    paths = [p for _, p, _ in COHORT]
    today = date.today().isoformat()

    print(f"抓取 cohort（{len(paths)} 个 URL）· {today}\n")
    print("拉 nginx 日志…", flush=True)
    logs = fetch_log_stats(paths)
    gsc, impr = {}, {}
    if not a.no_gsc:
        print("拉 GSC URL Inspection…", flush=True)
        gsc = fetch_gsc(paths)
        print("拉 GSC 曝光数据…", flush=True)
        try:
            impr = fetch_impressions(paths)
        except Exception as e:
            print(f"  ⚠ 曝光数据失败: {str(e)[:80]}", file=sys.stderr)
    lastmod = sitemap_lastmod(paths)

    snap = {"date": today, "rows": []}
    for grp, p, note in COHORT:
        L = logs.get(p, {})
        G_ = gsc.get(p, {})
        snap["rows"].append({
            "group": grp, "path": p, "note": note,
            "gbot": L.get("gbot", 0), "gbot_last": L.get("gbot_last", ""),
            "gbot_main_host": L.get("gbot_main_host", 0),
            "gbot_codes": L.get("gbot_codes", {}),
            "ai": L.get("ai", 0),
            "coverage": G_.get("coverage", ""), "lastCrawl": G_.get("lastCrawl", ""),
            "canonical": G_.get("canonical", ""),
            "impr": impr.get(p, {}).get("impr", 0), "clicks": impr.get(p, {}).get("clicks", 0),
            "lastmod": lastmod.get(p, ""),
        })

    SNAP_DIR.mkdir(parents=True, exist_ok=True)
    out_f = SNAP_DIR / f"{today}.json"
    out_f.write_text(json.dumps(snap, ensure_ascii=False, indent=1))

    # ── 输出表格 ──
    print(f"\n{'组':<3}{'页面':<46}{'Gbot':>5}{'主域':>5}{'最后抓取':>13}{'AI':>6}{'曝光':>6}  收录状态")
    print("─" * 122)
    indexed = crawled = 0
    for r in snap["rows"]:
        cov = r["coverage"] or "—"
        if "已编入索引" in cov:
            indexed += 1
        if r["gbot"] > 0:
            crawled += 1
        flag = "✅" if "已编入索引" in cov else ("🟡" if r["gbot"] > 0 else "🔴")
        print(f"{r['group']:<3}{r['path'][:44]:<46}{r['gbot']:>5}{r['gbot_main_host']:>5}"
              f"{(r['gbot_last'] or '—'):>13}{r['ai']:>6}{r['impr']:>6}  {flag} {cov[:22]}")

    print(f"\n汇总：{indexed}/{len(paths)} 已收录 · {crawled}/{len(paths)} 有 Googlebot 抓取记录")
    print(f"快照 → {out_f.relative_to(ROOT)}")

    # ── 与上一份快照对比 ──
    if a.compare:
        prev = sorted(SNAP_DIR.glob("*.json"))
        prev = [f for f in prev if f.name != f"{today}.json"]
        if not prev:
            print("\n（无历史快照可对比）")
            return
        old = json.loads(prev[-1].read_text())
        old_by = {r["path"]: r for r in old["rows"]}
        print(f"\n=== 对比 {old['date']} → {today} ===")
        changed = False
        for r in snap["rows"]:
            o = old_by.get(r["path"])
            if not o:
                continue
            d_gbot = r["gbot"] - o.get("gbot", 0)
            cov_chg = r["coverage"] != o.get("coverage", "")
            d_impr = r["impr"] - o.get("impr", 0)
            if d_gbot or cov_chg or d_impr:
                changed = True
                bits = []
                if d_gbot:
                    bits.append(f"Googlebot {o.get('gbot',0)}→{r['gbot']}")
                if cov_chg:
                    bits.append(f"状态 {o.get('coverage','—')[:16]} → {r['coverage'][:16]}")
                if d_impr:
                    bits.append(f"曝光 {o.get('impr',0)}→{r['impr']}")
                print(f"  {r['path'][:52]:<54} {' | '.join(bits)}")
        if not changed:
            print("  （无变化）")


if __name__ == "__main__":
    main()
