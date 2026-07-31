#!/usr/bin/env python3
"""llms.txt 维护审计 —— 用 AI 爬虫的真实抓取数据决定该加/该删什么。

背景（2026-07-31 复盘）：llms.txt 06-12 上线后两个月没动，结果它推荐的 8 篇 B2B
sourcing guides 里 7 篇 ChatGPT 根本不读，而 ChatGPT 实际在读的 16 篇消费者维修文
一条都没列。这个脚本把当时的人工分析变成可重复的检查。

数据源是 VPS nginx 日志里的 AI 爬虫 UA —— 不是 GA4。GA4 只看得到真人会话，看不到
模型抓了什么。

用法：
  python3 Analytics/scripts/llms_txt_audit.py              # 审计（只读，不改文件）
  python3 Analytics/scripts/llms_txt_audit.py --top 60     # 看更长的抓取排行
  python3 Analytics/scripts/llms_txt_audit.py --check-urls # 额外逐条核验 URL 可达性

建议节奏：每月一次，或每次批量发文/改版之后。
"""
import argparse, re, subprocess, sys, urllib.request, urllib.error
from pathlib import Path
from collections import Counter
from concurrent.futures import ThreadPoolExecutor

ROOT = Path(__file__).resolve().parents[2]
LLMS = ROOT / "public" / "llms.txt"
HOST = "https://www.phonerepairspares.com"
SSH = "prspares"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126 Safari/537.36")
AI_UAS = "ChatGPT-User|OAI-SearchBot|GPTBot|PerplexityBot|ClaudeBot|Claude-User"
# 非内容页，不该出现在建议列表里
SKIP = re.compile(r"^/(_next|robots\.txt|sitemap|llms\.txt|favicon|api/|.*\.(js|css|xml|txt|png|jpg|jpeg|webp|svg|ico|woff2?)$)")


def fetch_crawl_counts():
    """从 VPS 拉 AI 爬虫成功抓取(200)的页面计数。"""
    cmd = (
        "cd /var/log/nginx && { zcat access.log.*.gz 2>/dev/null; "
        "cat access.log.1 access.log 2>/dev/null; } | "
        f"grep -aE '{AI_UAS}' | awk '$9==200 {{print $7}}' | sed 's/?.*//' | "
        "sort | uniq -c | sort -rn | head -300"
    )
    try:
        out = subprocess.run(["ssh", SSH, cmd], capture_output=True, text=True, timeout=300)
    except subprocess.TimeoutExpired:
        sys.exit("✗ ssh 超时 —— 检查 VPS 连通性")
    if out.returncode != 0:
        sys.exit(f"✗ ssh 失败: {out.stderr[:200]}")
    counts = Counter()
    for line in out.stdout.splitlines():
        m = re.match(r"\s*(\d+)\s+(\S+)", line)
        if m and not SKIP.match(m.group(2)):
            counts[m.group(2)] += int(m.group(1))
    return counts


def llms_urls():
    txt = LLMS.read_text()
    return txt, {u for u in re.findall(rf"{re.escape(HOST)}(/[^\s)\]]*)", txt)}


def check(url):
    try:
        r = urllib.request.urlopen(urllib.request.Request(HOST + url, headers={"User-Agent": UA}), timeout=25)
        final = r.geturl().replace(HOST, "")
        return url, r.status, "" if final.rstrip("/") == url.rstrip("/") else final
    except urllib.error.HTTPError as e:
        return url, e.code, ""
    except Exception as e:
        return url, str(e)[:30], ""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--top", type=int, default=40)
    ap.add_argument("--check-urls", action="store_true")
    a = ap.parse_args()

    counts = fetch_crawl_counts()
    txt, listed = llms_urls()
    total = sum(counts.values())
    print(f"llms.txt: {len(listed)} 条 URL / {len(txt.split())} 词")
    print(f"AI 爬虫成功抓取: {total} 次，覆盖 {len(counts)} 个页面\n")

    # 该加：抓得多但没列
    missing = [(u, n) for u, n in counts.most_common(a.top) if u not in listed and u != "/"]
    print(f"➕ 该加进 llms.txt（抓取量前 {a.top}，当前未列）")
    if missing:
        for u, n in missing:
            print(f"   {n:>5} 次  {u}")
    else:
        print("   （无 —— llms.txt 已覆盖高抓取页）")

    # 该删：列了但基本没被抓
    dead = sorted(((u, counts.get(u, 0)) for u in listed if counts.get(u, 0) <= 2),
                  key=lambda x: x[1])
    print(f"\n➖ 考虑移除或补强（已列但抓取 ≤2 次，共 {len(dead)} 条）")
    for u, n in dead:
        print(f"   {n:>5} 次  {u}")

    # 覆盖率
    listed_hits = sum(counts.get(u, 0) for u in listed)
    root = counts.get("/", 0)
    body = total - root
    if body:
        print(f"\n📊 llms.txt 覆盖率：已列页面占内容页抓取量的 {listed_hits/body*100:.0f}%"
              f"（{listed_hits}/{body}，首页 {root} 次已排除）")

    if a.check_urls:
        print("\n🔗 URL 可达性")
        bad = 0
        with ThreadPoolExecutor(max_workers=6) as ex:
            for u, code, redir in ex.map(check, sorted(listed)):
                if code != 200 or redir:
                    bad += 1
                    print(f"   🔴 {code} {u}{' → ' + redir if redir else ''}")
        print("   ✓ 全部 200 且无重定向" if not bad else f"   🔴 {bad} 条需处理")


if __name__ == "__main__":
    main()
