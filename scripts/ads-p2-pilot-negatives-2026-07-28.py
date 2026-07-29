#!/usr/bin/env python3
"""
把主 campaign 的否定词表复制到 pilot-geo（pilot 原本只有 6 个 vs 主表 102 个）。

用法：
    /Users/yangxiaobo/.hermes/hermes-agent/venv/bin/python3 scripts/ads-p2-pilot-negatives-2026-07-28.py
    /Users/yangxiaobo/.hermes/hermes-agent/venv/bin/python3 scripts/ads-p2-pilot-negatives-2026-07-28.py --apply

回滚：备份 JSON 列出本次新增的每个否定词，按 (text, match_type) 在 pilot campaign 删除即可。
"""
import argparse
import json
import os
import sys
from datetime import date
from pathlib import Path

from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException

ROOT = Path(__file__).resolve().parents[1]
BACKUP = ROOT / "Analytics" / "_backups_ads-pilot-negatives-2026-07-28.json"
ENV_PATH = Path.home() / ".hermes" / ".env"

SRC_CAMPAIGN = "Search | PR Spares | Factory Direct | US-UK | EN"
DST_CAMPAIGN = "Search | PRSPARES | pilot-geo-2026w28 | CA-AU-EU | EN"


def load_env():
    for line in ENV_PATH.read_text().splitlines():
        if "=" in line and not line.startswith("#"):
            k, _, v = line.partition("=")
            if k.strip() and v.strip():
                os.environ.setdefault(k.strip(), v.strip())


def make_client():
    return GoogleAdsClient.load_from_dict({
        "developer_token":   os.environ["GOOGLE_ADS_DEVELOPER_TOKEN"],
        "client_id":         os.environ["GOOGLE_ADS_CLIENT_ID"],
        "client_secret":     os.environ["GOOGLE_ADS_CLIENT_SECRET"],
        "refresh_token":     os.environ["GOOGLE_ADS_REFRESH_TOKEN"],
        "login_customer_id": os.environ["GOOGLE_ADS_LOGIN_CUSTOMER_ID"],
        "use_proto_plus":    True,
    })


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    load_env()
    client = make_client()
    cid = os.environ["GOOGLE_ADS_CUSTOMER_ID"]
    ga = client.get_service("GoogleAdsService")

    campaigns = {}
    for row in ga.search(customer_id=cid, query="""
        SELECT campaign.id, campaign.name FROM campaign WHERE campaign.status != 'REMOVED'
    """):
        campaigns[row.campaign.name] = row.campaign.id

    src, dst = [], set()
    for row in ga.search(customer_id=cid, query="""
        SELECT campaign.name, campaign_criterion.keyword.text,
               campaign_criterion.keyword.match_type
        FROM campaign_criterion WHERE campaign_criterion.negative = TRUE
    """):
        text = row.campaign_criterion.keyword.text
        if not text:
            continue
        mt = row.campaign_criterion.keyword.match_type.name
        if row.campaign.name == SRC_CAMPAIGN:
            src.append((text, mt))
        elif row.campaign.name == DST_CAMPAIGN:
            dst.add((text.lower(), mt))

    todo = [(t, m) for t, m in src if (t.lower(), m) not in dst]

    print(f"主 campaign 否定词 {len(src)} / pilot 现有 {len(dst)} / 待复制 {len(todo)}")
    brands = [t for t, _ in todo if t.lower() in {
        "oppo", "redmi", "realme", "honor x6b", "hmd vibe", "infocus",
        "oneplus 12r display price original", "reno 14 original display price",
    }]
    if brands:
        print(f"⚠️  其中含品牌类否定词（沿用主 campaign 既有策略，如 EU/AU 想吃这些品牌需单独摘掉）：{brands}")

    if not args.apply:
        print("\n(预演模式，账户未改动。加 --apply 执行)")
        return

    BACKUP.write_text(json.dumps({
        "date": str(date.today()),
        "dst_campaign": DST_CAMPAIGN,
        "added": [{"text": t, "match_type": m} for t, m in todo],
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✓ 备份写入 {BACKUP}")

    try:
        svc = client.get_service("CampaignCriterionService")
        ops = []
        for text, mt in todo:
            op = client.get_type("CampaignCriterionOperation")
            c = op.create
            c.campaign = f"customers/{cid}/campaigns/{campaigns[DST_CAMPAIGN]}"
            c.negative = True
            c.keyword.text = text
            c.keyword.match_type = getattr(client.enums.KeywordMatchTypeEnum, mt)
            ops.append(op)
        # 分批（单请求上限 5000，这里远低于，但保持批量习惯）
        for i in range(0, len(ops), 200):
            svc.mutate_campaign_criteria(customer_id=cid, operations=ops[i:i + 200])
        print(f"✓ 已复制 {len(todo)} 个否定词到 pilot-geo")
    except GoogleAdsException as ex:
        print(f"❌ API 报错 request_id={ex.request_id}")
        for err in ex.failure.errors:
            print(f"   {err.error_code}: {err.message}")
        sys.exit(1)


if __name__ == "__main__":
    main()
