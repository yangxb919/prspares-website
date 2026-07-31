#!/usr/bin/env python3
"""IndexNow 提交 —— 把 URL 推给 Bing / Yandex / Seznam（同一协议，任一端点全网分发）。

Bing 索引同时是 Microsoft Copilot 的语料来源，所以这条通道对 GEO 也算数。
Google 不参与 IndexNow，Google 侧仍靠 sitemap lastmod + 内链。

用法：
  python3 scripts/indexnow-submit.py                      # 提交默认清单（8月主线 A 卡住的页 + 本轮改动页）
  python3 scripts/indexnow-submit.py URL1 URL2 ...        # 提交指定 URL
  python3 scripts/indexnow-submit.py --check              # 只校验 key 文件线上可达
"""
import sys, json, urllib.request, urllib.error

KEY = "f577b20acb38efd132d1051c0b106308"
HOST = "www.phonerepairspares.com"
BASE = f"https://{HOST}"
KEY_LOCATION = f"{BASE}/{KEY}.txt"
ENDPOINT = "https://api.indexnow.org/IndexNow"

# 8月主线 A：未被抓取/抓了未收的页 + 本轮内链重排改过的高流量页
DEFAULT_URLS = [
    # 卡住的页
    f"{BASE}/blog/moq-sample-orders-lead-time-wholesale",
    f"{BASE}/blog/top-10-phone-parts-suppliers-in-china",
    f"{BASE}/products/screens/jk",
    f"{BASE}/products/screens-grade-guide",
    # 本轮改动（新增了指向上面几页的内链）
    f"{BASE}/blog/iphone-boot-loop-after-screen-replacement-causes",
    f"{BASE}/blog/samsung-s23-s24-screen-replacement-guide",
    f"{BASE}/blog/iphone-11-screen-replacement-worth-it-2026",
    f"{BASE}/blog/which-iphone-14-pro-max-screen-replacement-option-delivers-the-best-value-for-your-repair-business",
    f"{BASE}/blog/is-your-iphone-14-pro-max-back-glass-worth-fixing-the-complete-cost-benefit-guide-for-repair-shop-owners",
    f"{BASE}/products/screens/gx",
]

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"


def check_key():
    req = urllib.request.Request(KEY_LOCATION, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            body = r.read().decode().strip()
            ok = body == KEY
            print(f"{'✓' if ok else '✗'} {KEY_LOCATION} → HTTP {r.status}, body={body!r}")
            return ok
    except urllib.error.HTTPError as e:
        print(f"✗ {KEY_LOCATION} → HTTP {e.code}（key 文件未部署或被 WAF 拦）")
        return False
    except Exception as e:
        print(f"✗ {KEY_LOCATION} → {e}")
        return False


def submit(urls):
    payload = json.dumps({
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }).encode()
    req = urllib.request.Request(
        ENDPOINT, data=payload,
        headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": UA},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print(f"✓ IndexNow 已接收 {len(urls)} 条 URL → HTTP {r.status} {r.reason}")
            return True
    except urllib.error.HTTPError as e:
        # 200/202 = 接收；400 参数错；403 key 校验失败；422 URL 与 host 不符；429 限流
        print(f"✗ HTTP {e.code}: {e.read().decode()[:200]}")
        return False


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if "--check" in sys.argv:
        sys.exit(0 if check_key() else 1)
    urls = args or DEFAULT_URLS
    if not check_key():
        print("\n先确认 key 文件已随部署上线，再提交（403 就是 key 校验失败）。")
        sys.exit(1)
    print(f"\n提交 {len(urls)} 条：")
    for u in urls:
        print("  ", u.replace(BASE, ""))
    sys.exit(0 if submit(urls) else 1)
