#!/usr/bin/env python3
"""
🔴🔴 已废弃，不要使用，也不要为它去申请 Google 授权。 🔴🔴

本脚本调用 indexing.googleapis.com（scope auth/indexing）。Google 官方的
Indexing API **只支持 JobPosting 和 BroadcastEvent 两类页面** —— 博客文章和
产品页不在支持范围内。对我们的页面调用它：
  · 要么像 2026-08-12 实测那样直接 403；
  · 要么返回 200「成功」但 Google 根本不会去抓。
配 Service Account 也解决不了 —— 这不是权限问题，是 API 压根不支持这类页面。
（2026-08-12 我一度把 403 误判成「凭据权限没配好」并建议去配 Service Account，
2026-08-24 查清后收回该建议。）

✅ 正解：GSC 后台的「请求编入索引」按钮，对所有页面有效，配额约 10-20 条/天。
   已验证可由 ego-browser 代操作（见 2026-09-04 changelog 的实现）。
   .secrets/gsc-token.json 保持只读 scope（webmasters.readonly）是对的：
   读数据交给脚本，写操作走界面。

以下原始代码仅作记录保留。
"""

import sys
import json
from pathlib import Path
from typing import List

try:
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build
except ImportError:
    print("❌ 缺少依赖。运行：")
    print("  uv run --with google-auth-oauthlib --with google-api-python-client \\")
    print("    Analytics/scripts/gsc_request_indexing.py")
    sys.exit(1)

BASE = "https://www.phonerepairspares.com"

# 🔴 2026-08-12 优先级清单：卡住的页面 + 从未爬过的页面
PRIORITY_URLS = [
    # 已发现但未索引（07-30 提交后仍卡住）
    "/blog/moq-sample-orders-lead-time-wholesale",

    # Google 无法识别（从未被抓过，可能是新页）
    "/blog/top-10-phone-parts-suppliers-in-china",

    # 已抓取但未索引（07-28，可能是内容质量问题）
    "/products/screens/jk",

    # 备选：其他低流量但高价值的页面
    # "/products/screens/gx",  # 已索引，无需
    # "/blog/lcd-vs-oled-hard-soft-oled-repair-shops",
]


def load_credentials(token_path: str | None = None) -> Credentials:
    """加载 Indexing API 凭据（OAuth 2.0 用户令牌）。

    优先级：
    1. gsc-token.json（来自 gsc_fetch.py 的已授权凭据）
    2. 如果不存在，引导用户运行 gsc_fetch.py 进行授权
    """
    if not token_path:
        token_path = ".secrets/gsc-token.json"

    path = Path(token_path).expanduser()
    if not path.exists():
        print(
            f"❌ 找不到凭据文件：{path}\n\n"
            f"解决方案：先运行 gsc_fetch.py 进行 OAuth 授权\n"
            f"  uv run --with google-api-python-client --with google-auth-oauthlib --with google-auth \\\n"
            f"    Analytics/scripts/gsc_fetch.py --days 1\n\n"
            f"这会在 {path} 生成授权令牌，然后重试本脚本。"
        )
        raise SystemExit(1)

    try:
        with open(path) as f:
            token_data = json.load(f)
        creds = Credentials.from_authorized_user_info(
            token_data,
            scopes=["https://www.googleapis.com/auth/indexing"]
        )

        # 刷新令牌（如果需要）
        if creds.expired:
            from google.auth.transport.requests import Request
            req = Request()
            creds.refresh(req)

        return creds
    except (json.JSONDecodeError, KeyError) as e:
        raise FileNotFoundError(
            f"❌ 凭据文件格式错误或不完整：{path}\n"
            f"错误：{e}\n\n"
            f"请重新运行 gsc_fetch.py 重新授权。"
        )


def request_indexing(creds: Credentials, urls: List[str], dry_run: bool = False) -> None:
    """请求 Google 索引指定的 URL。

    Args:
        creds: Google API 凭据
        urls: URL 列表（相对路径或完整 URL）
        dry_run: 如果 True，仅预览不发送请求
    """
    service = build("indexing", "v3", credentials=creds)

    # 规范化 URL
    normalized_urls = []
    for url in urls:
        if url.startswith("http"):
            normalized_urls.append(url)
        else:
            normalized_urls.append(BASE + url)

    print(f"\n📤 准备请求 {len(normalized_urls)} 个 URL 的索引")
    print(f"{'🔄 DRY-RUN 模式（预览，不发送）' if dry_run else '🔴 LIVE 模式（正式提交）'}\n")

    for i, url in enumerate(normalized_urls, 1):
        print(f"  {i}. {url}", end="")

        if dry_run:
            print(" [预览]")
            continue

        try:
            response = service.urlNotifications().publish(
                body={
                    "url": url,
                    "type": "URL_UPDATED"  # 或 URL_DELETED（删除索引）
                }
            ).execute()

            if response:
                print(f" ✅ 已提交")
            else:
                print(f" ⚠️  响应为空，可能已排队")
        except Exception as e:
            print(f" ❌ 失败：{str(e)[:100]}")

    if not dry_run:
        print(f"\n✅ 完成！Google 会在 24-48 小时内处理这些请求。")
        print(f"   使用 `gsc_inspect.py` 追踪索引状态。")
    else:
        print(f"\n💡 预览完成。移除 --dry-run 标志来正式提交。")


if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv

    # 解析命令行 URL
    custom_urls = [a for a in sys.argv[1:] if not a.startswith("--")]
    urls = custom_urls if custom_urls else PRIORITY_URLS

    try:
        creds = load_credentials()
        request_indexing(creds, urls, dry_run=dry_run)
    except Exception as e:
        print(f"\n❌ 错误：{e}", file=sys.stderr)
        sys.exit(1)
