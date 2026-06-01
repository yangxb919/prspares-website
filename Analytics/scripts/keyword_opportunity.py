#!/usr/bin/env python3
"""Keyword Opportunity Tracker — GSC (真实排名) × DataForSEO (市场大小) 交叉分类。

这是"流量打法"的选题/机会发动机。每周跑一次：
  1. 读最新一期 GSC queries.csv（你站点实际有曝光的词）
  2. 过滤品牌词
  3. 用 DataForSEO 查每个词的月搜索量/竞争度/CPC（带本地缓存，省钱）
  4. 把每个词分到行动桶 + 算优先级分
  5. 输出分层 backlog（markdown + csv）到 Analytics/keyword-backlog/

DataForSEO 凭据从 ~/.claude.json 的 mcpServers.dataforseo.env 读取（不硬编码）。

用法:
  python3 Analytics/scripts/keyword_opportunity.py            # 默认美国市场
  python3 Analytics/scripts/keyword_opportunity.py --no-api   # 只用缓存/GSC，不花钱
  python3 Analytics/scripts/keyword_opportunity.py --location "United Kingdom"
"""
from __future__ import annotations

import argparse
import base64
import csv
import json
import os
import sys
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GSC_DIR = ROOT / "Analytics" / "gsc"
OUT_DIR = ROOT / "Analytics" / "keyword-backlog"
CACHE_FILE = ROOT / "Analytics" / "scripts" / ".dfs_volume_cache.json"

BRAND_TERMS = ("prspares", "phonerepairspares", "phone repair spares", "prspare")
COMMERCIAL_TERMS = (
    "wholesale", "supplier", "bulk", "buy", "price", "cost", "distributor",
    "manufacturer", "vendor", "factory", "b2b", "supply", "oem", "for sale",
    "where to buy", "near me",
)


def read_creds() -> tuple[str, str]:
    cfg = json.loads((Path.home() / ".claude.json").read_text(encoding="utf-8"))

    def find(o):
        if isinstance(o, dict):
            if "DATAFORSEO_USERNAME" in o:
                return o["DATAFORSEO_USERNAME"], o["DATAFORSEO_PASSWORD"]
            for v in o.values():
                r = find(v)
                if r:
                    return r
        return None

    creds = find(cfg)
    if not creds:
        raise SystemExit("找不到 DataForSEO 凭据（~/.claude.json mcpServers.dataforseo.env）")
    return creds


def latest_gsc_dir() -> Path:
    dirs = sorted([p for p in GSC_DIR.glob("20*_to_20*") if (p / "queries.csv").exists()])
    if not dirs:
        raise SystemExit(f"没有找到 GSC 数据，先跑 gsc_fetch.py。查找路径: {GSC_DIR}")
    return dirs[-1]


def num(x) -> float:
    try:
        return float(x)
    except (TypeError, ValueError):
        return 0.0


def load_gsc(gsc_dir: Path) -> list[dict]:
    rows = []
    with open(gsc_dir / "queries.csv", encoding="utf-8") as fh:
        for r in csv.DictReader(fh):
            q = (r.get("query") or "").strip()
            if not q:
                continue
            if any(b in q.lower() for b in BRAND_TERMS):
                continue
            rows.append({
                "query": q,
                "clicks": num(r.get("clicks")),
                "impressions": num(r.get("impressions")),
                "ctr": num(r.get("ctr")),
                "position": num(r.get("position")),
            })
    return rows


def load_cache() -> dict:
    if CACHE_FILE.exists():
        try:
            return json.loads(CACHE_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return {}
    return {}


def save_cache(cache: dict) -> None:
    CACHE_FILE.write_text(json.dumps(cache, ensure_ascii=False, indent=0), encoding="utf-8")


def dfs_search_volume(keywords: list[str], location: str, lang: str,
                      cache: dict, use_api: bool) -> dict:
    """返回 {keyword_lower: {sv, competition, cpc}}。带缓存，按 location 分桶。"""
    cache_bucket = cache.setdefault(location, {})
    # DataForSEO google_ads 限制：单词 <=80 字符且 <=10 个单词，否则整批被拒(40501)
    def valid(k: str) -> bool:
        return len(k) <= 80 and len(k.split()) <= 10
    missing = [k for k in keywords if k.lower() not in cache_bucket and valid(k)]

    if missing and use_api:
        user, pw = read_creds()
        auth = base64.b64encode(f"{user}:{pw}".encode()).decode()
        # DataForSEO 单次最多 ~1000 词；我们一批最多 200 控成本
        for i in range(0, len(missing), 200):
            batch = missing[i:i + 200]
            payload = [{"keywords": batch, "location_name": location, "language_code": lang}]
            req = urllib.request.Request(
                "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live",
                data=json.dumps(payload).encode(),
                headers={"Authorization": f"Basic {auth}", "Content-Type": "application/json"},
            )
            try:
                d = json.loads(urllib.request.urlopen(req, timeout=120).read())
            except Exception as e:  # noqa: BLE001
                print(f"  [warn] DataForSEO 调用失败: {e!r}，本批跳过", file=sys.stderr)
                continue
            cost = d.get("cost", 0)
            print(f"  DataForSEO 查询 {len(batch)} 词，花费 ${cost}", file=sys.stderr)
            for r in (d.get("tasks", [{}])[0].get("result") or []):
                kw = (r.get("keyword") or "").lower()
                if kw:
                    cache_bucket[kw] = {
                        "sv": r.get("search_volume") or 0,
                        "competition": r.get("competition"),
                        "cpc": r.get("cpc"),
                    }
        save_cache(cache)

    out = {}
    for k in keywords:
        out[k.lower()] = cache_bucket.get(k.lower(), {"sv": None, "competition": None, "cpc": None})
    return out


def is_commercial(q: str) -> bool:
    return any(t in q.lower() for t in COMMERCIAL_TERMS)


def classify(row: dict) -> str:
    pos, clicks, imp = row["position"], row["clicks"], row["impressions"]
    sv = row.get("sv") or 0
    if clicks > 0:
        return "HARVEST"          # 已在赚 → 守住 + 加深
    if 0 < pos <= 10 and imp >= 10:
        return "CTR_FIX"          # 排首页却 0 点击 → 改标题/描述/抢 AIO
    if 10 < pos <= 30 and (sv >= 50 or imp >= 15):
        return "PUSH"             # 第2-3页 → on-page 优化推上首页
    if sv >= 100:
        return "NEW"              # 有市场但没排名 → 写新内容
    return "LONGTAIL"             # 长尾/低量 → 暂缓


def priority_score(row: dict) -> float:
    """越高越该先做。综合：市场大小 + 离首页差距 + 商业意图 + 现有曝光。"""
    sv = row.get("sv") or 0
    pos = row["position"]
    score = 0.0
    score += min(sv, 5000) / 50.0                      # 市场大小（封顶防大词独大）
    if 0 < pos <= 30:
        score += max(0, (30 - pos)) * 1.5              # 越接近首页越值得推
    score += row["impressions"] * 0.5                  # 已有真实曝光
    if is_commercial(row["query"]):
        score += 40                                    # 商业意图大加分
    comp = (row.get("competition") or "").upper()
    if comp == "LOW":
        score += 15                                    # 好抢
    elif comp == "HIGH":
        score -= 10
    if row["clicks"] > 0:
        score += 10                                    # 已验证能带流量
    return round(score, 1)


def main() -> None:
    ap = argparse.ArgumentParser(description="GSC × DataForSEO 关键词机会追踪")
    ap.add_argument("--location", default="United States")
    ap.add_argument("--lang", default="en")
    ap.add_argument("--no-api", action="store_true", help="不调 DataForSEO（只用缓存，免费）")
    ap.add_argument("--max-keywords", type=int, default=250, help="查询词上限（控成本）")
    args = ap.parse_args()

    gsc_dir = latest_gsc_dir()
    rows = load_gsc(gsc_dir)
    print(f"GSC 期: {gsc_dir.name} | 非品牌词: {len(rows)}", file=sys.stderr)

    # 按曝光排序，取前 N 控成本
    rows.sort(key=lambda r: -r["impressions"])
    query_rows = rows[:args.max_keywords]

    cache = load_cache()
    vols = dfs_search_volume([r["query"] for r in query_rows], args.location, args.lang,
                             cache, use_api=not args.no_api)
    for r in query_rows:
        v = vols.get(r["query"].lower(), {})
        r["sv"] = v.get("sv")
        r["competition"] = v.get("competition")
        r["cpc"] = v.get("cpc")
        r["bucket"] = classify(r)
        r["score"] = priority_score(r)

    query_rows.sort(key=lambda r: -r["score"])

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    stamp = gsc_dir.name
    csv_path = OUT_DIR / f"backlog_{stamp}.csv"
    md_path = OUT_DIR / f"backlog_{stamp}.md"

    with open(csv_path, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["priority", "bucket", "query", "gsc_position", "gsc_impressions",
                    "gsc_clicks", "monthly_volume", "competition", "cpc", "commercial"])
        for r in query_rows:
            w.writerow([r["score"], r["bucket"], r["query"], round(r["position"], 1),
                        int(r["impressions"]), int(r["clicks"]), r.get("sv"),
                        r.get("competition"), r.get("cpc"), "Y" if is_commercial(r["query"]) else ""])

    buckets = {"CTR_FIX": [], "PUSH": [], "NEW": [], "HARVEST": [], "LONGTAIL": []}
    for r in query_rows:
        buckets[r["bucket"]].append(r)

    titles = {
        "CTR_FIX": "🔴 抢点击 (排首页却 0 点击 → 改标题/描述/抢 AI Overview，最快见效)",
        "PUSH":    "🟡 推首页 (第 2-3 页 → on-page 优化推一把上首页)",
        "NEW":     "🟢 写新文 (有市场没排名 → 新内容)",
        "HARVEST": "💰 守成 (已在带流量 → 守住 + 加深内链/CTA)",
        "LONGTAIL":"⚪ 长尾 (低量，暂缓)",
    }

    def fmt(r):
        sv = r.get("sv")
        sv_s = f"{sv}/mo" if sv else "—"
        comp = r.get("competition") or "—"
        cpc = f"${round(r['cpc'],2)}" if r.get("cpc") else "—"
        comm = " 💵" if is_commercial(r["query"]) else ""
        return (f"| {r['score']} | {r['query']}{comm} | pos {r['position']:.1f} | "
                f"{int(r['impressions'])}imp / {int(r['clicks'])}clk | {sv_s} | {comp} | {cpc} |")

    lines = [
        f"# 关键词机会 Backlog — {stamp}",
        "",
        f"> 数据源: GSC `{gsc_dir.name}` × DataForSEO ({args.location}). 生成于 {date.today()}.",
        f"> 非品牌词 {len(rows)} 个，分析前 {len(query_rows)} 个（按曝光）。",
        "",
        "**怎么用**：从上往下做。🔴 抢点击最快见效（流量现成，只差点击）；🟡 推首页次之；🟢 写新文是长期增量。",
        "",
    ]
    for b in ["CTR_FIX", "PUSH", "NEW", "HARVEST", "LONGTAIL"]:
        rs = buckets[b]
        if not rs:
            continue
        lines.append(f"## {titles[b]}  ({len(rs)})")
        lines.append("")
        lines.append("| 优先级 | 关键词 | 当前排名 | 曝光/点击 | 月搜量 | 竞争 | CPC |")
        lines.append("|---|---|---|---|---|---|---|")
        for r in rs[:25]:
            lines.append(fmt(r))
        lines.append("")

    md_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"\n✅ 输出:\n  {md_path}\n  {csv_path}")
    counts = {b: len(v) for b, v in buckets.items() if v}
    print(f"分桶统计: {counts}")


if __name__ == "__main__":
    main()
