#!/usr/bin/env python3
"""Googlebot 抓取预算分桶 —— 08-07 判据的第二条证据线（独立于 cohort）。

cohort 盯的是 20 个具体 URL 的状态迁移；这个脚本回答的是另一个问题：
**Googlebot 那点预算到底花在哪了。** 两条线互相独立，一起看才不会误判。

分桶（Codex 2026-08-01 建议的口径）：
  canonical-blog / product / tag·query / apex·redirect / 404 / static / 5xx·429 / other
外加 TTFB p50·p95（`rt=` 字段，2026-08-01 起的日志才有）与主域 vs xyz 拆分（`host=` 字段，同上）。

用法：
  python3 Analytics/scripts/gbot_buckets.py            # 全量日志
  python3 Analytics/scripts/gbot_buckets.py --days 7   # 只看最近 N 天
  python3 Analytics/scripts/gbot_buckets.py --ua bingbot   # 换个爬虫看
"""
import argparse, json, re, subprocess, sys
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SNAP_DIR = ROOT / "Analytics" / "cohort"
SSH = "prspares"

MONTHS = {m: i for i, m in enumerate(
    "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(), 1)}


def bucket_of(path, status):
    """把一次请求归到一个桶。顺序有意义——先判特殊状态，再判路径形态。"""
    if status.startswith("5") or status == "429":
        return "5xx·429"
    if status == "404":
        return "404"
    if status in ("301", "302", "307", "308"):
        return "redirect"
    if re.match(r"^/_next/|\.(js|css|woff2?|png|jpg|jpeg|webp|svg|ico|gif)$", path):
        return "static"
    if "?" in path or re.search(r"[?&](tag|category|page)=", path):
        return "tag·query"
    if path.startswith("/blog/"):
        return "canonical-blog"
    if path.startswith("/products"):
        return "product"
    if path in ("/robots.txt", "/sitemap.xml") or path.startswith("/sitemap"):
        return "robots·sitemap"
    return "other"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=0, help="只统计最近 N 天（0=全部）")
    ap.add_argument("--ua", default="Googlebot", help="爬虫 UA 关键字")
    a = ap.parse_args()

    cmd = (
        "cd /var/log/nginx && { zcat access.log.*.gz 2>/dev/null; "
        f"cat access.log.1 access.log 2>/dev/null; }} | grep -a '{a.ua}'"
    )
    try:
        out = subprocess.run(["ssh", SSH, cmd], capture_output=True, text=True, timeout=300)
    except Exception as e:
        sys.exit(f"✗ ssh 失败: {str(e)[:120]}")
    if out.returncode != 0:
        sys.exit(f"✗ ssh 返回 {out.returncode}: {out.stderr[:150]}")

    cutoff = None
    if a.days:
        cutoff = datetime.now() - timedelta(days=a.days)

    buckets = Counter()
    by_host = Counter()
    codes = Counter()
    rts = []
    top_in_bucket = defaultdict(Counter)
    total = 0
    have_host = have_rt = 0

    for line in out.stdout.splitlines():
        m = re.search(r'"(?:GET|HEAD|POST) ([^ "]+)[^"]*" (\d{3})', line)
        if not m:
            continue
        if cutoff:
            tm = re.search(r"\[(\d{2})/(\w{3})/(\d{4}):(\d{2}):(\d{2})", line)
            if tm:
                d, mo, y, hh, mi = tm.groups()
                try:
                    if datetime(int(y), MONTHS[mo], int(d), int(hh), int(mi)) < cutoff:
                        continue
                except (KeyError, ValueError):
                    pass
        path_raw, status = m.group(1), m.group(2)
        path = path_raw.split("?")[0] if "?" not in path_raw else path_raw
        b = bucket_of(path_raw, status)
        buckets[b] += 1
        codes[status] += 1
        total += 1
        top_in_bucket[b][path.split("?")[0][:70]] += 1

        hm = re.search(r"host=([^\s]+)", line)
        if hm:
            have_host += 1
            by_host[hm.group(1)] += 1
        rm = re.search(r"rt=([0-9.]+)", line)
        if rm:
            have_rt += 1
            try:
                rts.append(float(rm.group(1)))
            except ValueError:
                pass

    if not total:
        sys.exit(f"没有匹配到 {a.ua} 的请求")

    scope = f"最近 {a.days} 天" if a.days else "全部保留日志"
    print(f"{a.ua} 抓取预算分桶 · {scope} · 共 {total} 次\n")
    print(f"{'桶':<16}{'次数':>7}{'占比':>8}   最常被抓的")
    print("─" * 96)
    for b, n in buckets.most_common():
        top = top_in_bucket[b].most_common(1)
        tip = f"{top[0][0]} ({top[0][1]})" if top else ""
        print(f"{b:<16}{n:>7}{n/total*100:>7.1f}%   {tip[:56]}")

    print(f"\n状态码：" + "  ".join(f"{c}={n}" for c, n in codes.most_common(6)))

    if by_host:
        print(f"\n按域名拆分（{have_host}/{total} 条带 host 字段，08-01 起才有）：")
        for h, n in by_host.most_common():
            print(f"   {h:<34}{n:>6}  {n/have_host*100:>5.1f}%")
    else:
        print("\n按域名拆分：暂无数据（host 字段 2026-08-01 才加，需等新日志积累）")

    if rts:
        rts.sort()
        p50 = rts[len(rts) // 2]
        p95 = rts[int(len(rts) * 0.95)]
        slow = sum(1 for x in rts if x > 1.0)
        print(f"\n响应耗时（{have_rt} 条带 rt 字段）：p50={p50:.3f}s  p95={p95:.3f}s  "
              f">1s 的请求 {slow} 次（{slow/len(rts)*100:.1f}%）")
        if p95 > 1.0:
            print("   ⚠ p95 超过 1s —— 抓取容量可能受限，值得进一步查")
    else:
        print("\n响应耗时：暂无数据（rt 字段 2026-08-01 才加）")

    # 存快照，与 cohort 放一起，便于按日对比
    SNAP_DIR.mkdir(parents=True, exist_ok=True)
    f = SNAP_DIR / f"buckets-{date.today().isoformat()}.json"
    f.write_text(json.dumps({
        "date": date.today().isoformat(), "ua": a.ua, "scope": scope, "total": total,
        "buckets": dict(buckets), "codes": dict(codes), "by_host": dict(by_host),
        "rt_p50": (rts[len(rts)//2] if rts else None),
        "rt_p95": (rts[int(len(rts)*0.95)] if rts else None),
    }, ensure_ascii=False, indent=1))
    print(f"\n快照 → {f.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
