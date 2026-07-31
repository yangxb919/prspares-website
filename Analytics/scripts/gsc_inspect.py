#!/usr/bin/env python3
"""GSC URL Inspection —— 复查收录/抓取状态（8月主线 A 的验收工具）。

为什么要用 API 而不是 GSC 界面：2026-07-30 在界面读到榜单文「已收录」，07-31 用
本脚本查到的是「已发现－尚未编入索引」且 lastCrawl 为空。一个从未被抓的页不可能被
收录 —— 界面读数会误导，一律以 API 为准。

用法：
  python3 Analytics/scripts/gsc_inspect.py                 # 默认清单（主线 A 关注的页）
  python3 Analytics/scripts/gsc_inspect.py /blog/foo /products/bar
  python3 Analytics/scripts/gsc_inspect.py --json          # 输出完整 JSON

凭据复用 gsc_fetch.py（.secrets/gsc-token.json）。需要 hermes venv：
  /Users/yangxiaobo/.hermes/hermes-agent/venv/bin/python3
"""
import sys, json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "Analytics" / "scripts"))
import gsc_fetch as G  # noqa: E402
from googleapiclient.discovery import build  # noqa: E402

SITE = "sc-domain:phonerepairspares.com"
BASE = "https://www.phonerepairspares.com"

# 主线 A 的关注清单：卡住的页 + 本轮内链重排改过的高流量页
DEFAULT_PATHS = [
    "/blog/moq-sample-orders-lead-time-wholesale",          # hub156，07-30 提交后仍未抓
    "/blog/top-10-phone-parts-suppliers-in-china",          # 榜单文 id202，从未抓取
    "/products/screens/jk",                                 # 抓了未收
    "/products/screens-grade-guide",                        # 已收录（对照组）
    "/products/screens/gx",                                 # 已收录，"gx screen" pos 3
    "/blog/iphone-boot-loop-after-screen-replacement-causes",
    "/blog/samsung-s23-s24-screen-replacement-guide",
    "/blog/iphone-11-screen-replacement-worth-it-2026",
    "/blog/local-supplier-vs-china-direct-when-paying-more-saves-money",
    "/blog/how-small-repair-shops-buy-phone-parts-mixed-orders",  # canonical 应归并到 hub156
]


def inspect(svc, url):
    r = svc.urlInspection().index().inspect(
        body={"inspectionUrl": url, "siteUrl": SITE, "languageCode": "zh-CN"}
    ).execute()
    idx = r.get("inspectionResult", {}).get("indexStatusResult", {})
    return {
        "url": url.replace(BASE, ""),
        "verdict": idx.get("verdict"),
        "coverage": idx.get("coverageState"),
        "lastCrawl": (idx.get("lastCrawlTime") or "")[:19],
        "googleCanonical": (idx.get("googleCanonical") or "").replace(BASE, ""),
        "userCanonical": (idx.get("userCanonical") or "").replace(BASE, ""),
        "robots": idx.get("robotsTxtState"),
        "fetch": idx.get("pageFetchState"),
        "sitemap": idx.get("sitemap", []),
        "referringUrls": idx.get("referringUrls", [])[:2],
    }


if __name__ == "__main__":
    as_json = "--json" in sys.argv
    paths = [a for a in sys.argv[1:] if not a.startswith("--")] or DEFAULT_PATHS
    svc = build("searchconsole", "v1", credentials=G.load_credentials(0))

    out = []
    for p in paths:
        url = p if p.startswith("http") else BASE + p
        try:
            out.append(inspect(svc, url))
        except Exception as e:  # 单条失败不影响整批
            out.append({"url": p, "error": str(e)[:200]})

    if as_json:
        print(json.dumps(out, ensure_ascii=False, indent=1))
    else:
        print(f"{'页面':<58} {'状态':<26} {'lastCrawl':<20} canonical")
        print("-" * 130)
        for r in out:
            if "error" in r:
                print(f"{r['url'][:58]:<58} ERROR {r['error'][:60]}")
                continue
            canon = r["googleCanonical"] or "—"
            flag = "" if r["coverage"] and "已编入索引" in r["coverage"] else " 🔴"
            print(f"{r['url'][:58]:<58} {(r['coverage'] or '—')[:26]:<26} "
                  f"{(r['lastCrawl'] or '—'):<20} {canon[:40]}{flag}")
