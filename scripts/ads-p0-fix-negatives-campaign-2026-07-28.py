#!/usr/bin/env python3
"""
修正 ads-p0-prune-2026-07-28.py 的 campaign 归属 bug。

出了什么事：该脚本用「广告组名」查 campaign_id，而广告组名 `Replacement Parts` 只存在于
旧的已暂停 campaign `PRSPARES-Search-FactoryDirect-US-01`（不是在投的主 campaign），
导致 9 个否定词被加到了那个暂停 campaign 上，对在投流量零作用。

本脚本：把这 9 个否定词从旧 campaign 删除 → 加到在投的主 campaign。
（关键词暂停部分不受影响：那段用的是精确 campaign 名匹配，已确认正确。）

用法：
    /Users/yangxiaobo/.hermes/hermes-agent/venv/bin/python3 scripts/ads-p0-fix-negatives-campaign-2026-07-28.py
    /Users/yangxiaobo/.hermes/hermes-agent/venv/bin/python3 scripts/ads-p0-fix-negatives-campaign-2026-07-28.py --apply
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
BACKUP = ROOT / "Analytics" / "_backups_ads-p0-fix-2026-07-28.json"
ENV_PATH = Path.home() / ".hermes" / ".env"

WRONG_CAMPAIGN = "PRSPARES-Search-FactoryDirect-US-01"          # 旧的已暂停 campaign
RIGHT_CAMPAIGN = "Search | PR Spares | Factory Direct | US-UK | EN"  # 在投主 campaign

TARGET_NEGATIVES = {
    "accessories", "motorola", "tcl", "gsx", "apple oem", "genuine apple",
    "phone parts usa", "samsung phone parts usa", "chinese phone parts market",
}


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

    # campaign 一律按精确名字取 id（这就是原 bug 的正解）
    campaign_ids = {}
    for row in ga.search(customer_id=cid, query="""
        SELECT campaign.id, campaign.name FROM campaign WHERE campaign.status != 'REMOVED'
    """):
        campaign_ids[row.campaign.name] = row.campaign.id

    for need in (WRONG_CAMPAIGN, RIGHT_CAMPAIGN):
        if need not in campaign_ids:
            sys.exit(f"❌ 找不到 campaign: {need}")

    misplaced, already_right = [], set()
    for row in ga.search(customer_id=cid, query="""
        SELECT campaign.name, campaign_criterion.resource_name,
               campaign_criterion.keyword.text, campaign_criterion.keyword.match_type
        FROM campaign_criterion WHERE campaign_criterion.negative = TRUE
    """):
        text = row.campaign_criterion.keyword.text
        if text not in TARGET_NEGATIVES:
            continue
        mt = row.campaign_criterion.keyword.match_type.name
        if row.campaign.name == WRONG_CAMPAIGN:
            misplaced.append({"text": text, "match_type": mt,
                              "resource_name": row.campaign_criterion.resource_name})
        elif row.campaign.name == RIGHT_CAMPAIGN:
            already_right.add((text, mt))

    to_add = [m for m in misplaced if (m["text"], m["match_type"]) not in already_right]

    print(f"错放在 `{WRONG_CAMPAIGN}` 的否定词: {len(misplaced)} 个")
    for m in misplaced:
        print(f"   [{m['match_type']}] {m['text']}")
    print(f"主 campaign 已有的: {len(already_right)} 个 / 待搬运: {len(to_add)} 个")

    if not args.apply:
        print("\n(预演模式，账户未改动。加 --apply 执行)")
        return

    BACKUP.write_text(json.dumps({
        "date": str(date.today()),
        "removed_from": WRONG_CAMPAIGN,
        "added_to": RIGHT_CAMPAIGN,
        "criteria": misplaced,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✓ 备份写入 {BACKUP}")

    try:
        svc = client.get_service("CampaignCriterionService")

        if to_add:
            ops = []
            for m in to_add:
                op = client.get_type("CampaignCriterionOperation")
                c = op.create
                c.campaign = f"customers/{cid}/campaigns/{campaign_ids[RIGHT_CAMPAIGN]}"
                c.negative = True
                c.keyword.text = m["text"]
                c.keyword.match_type = getattr(client.enums.KeywordMatchTypeEnum, m["match_type"])
                ops.append(op)
            svc.mutate_campaign_criteria(customer_id=cid, operations=ops)
            print(f"✓ 已加 {len(to_add)} 个否定词到主 campaign")

        if misplaced:
            ops = []
            for m in misplaced:
                op = client.get_type("CampaignCriterionOperation")
                op.remove = m["resource_name"]
                ops.append(op)
            svc.mutate_campaign_criteria(customer_id=cid, operations=ops)
            print(f"✓ 已从旧 campaign 移除 {len(misplaced)} 个错放否定词")

    except GoogleAdsException as ex:
        print(f"❌ API 报错 request_id={ex.request_id}")
        for err in ex.failure.errors:
            print(f"   {err.error_code}: {err.message}")
        sys.exit(1)


if __name__ == "__main__":
    main()
