#!/usr/bin/env python3
"""
Google Ads P0 剪枝（2026-07-28 审计结论落地）。

做三件事（全部可回滚：暂停不是删除）：
1. 暂停广告组 `Replacement Parts`（11 个关键词 30 天零曝光）
2. 暂停零曝光关键词（保留 `phone battery wholesale` 在 Wholesale Parts Supplier 的那份，
   否则电池品类无广告覆盖；`wholesale phone screens` 跨组重复不动，两份都出过转化）
3. 主 campaign 加 9 个否定词（来自 06-29~07-28 搜索词报告实测浪费）

用法：
    # 预演（默认，不改账户）
    /Users/yangxiaobo/.hermes/hermes-agent/venv/bin/python3 scripts/ads-p0-prune-2026-07-28.py
    # 实际执行
    /Users/yangxiaobo/.hermes/hermes-agent/venv/bin/python3 scripts/ads-p0-prune-2026-07-28.py --apply

回滚：备份 JSON 记录了每条被改对象的 resource_name 与原 status，
按 Analytics/_backups_ads-p0-2026-07-28.json 逐条改回 ENABLED / 删除新增否定词即可。
"""
import argparse
import json
import os
import sys
from datetime import date
from pathlib import Path

from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from google.api_core import protobuf_helpers

ROOT = Path(__file__).resolve().parents[1]
BACKUP = ROOT / "Analytics" / "_backups_ads-p0-2026-07-28.json"
ENV_PATH = Path.home() / ".hermes" / ".env"
WINDOW = ("2026-06-29", "2026-07-28")

MAIN_CAMPAIGN = "Search | PR Spares | Factory Direct | US-UK | EN"
DEAD_AD_GROUP = "Replacement Parts"

# 保留名单：即使零曝光也不暂停（理由写在值里，供日后复查）
KEEP = {
    ("Wholesale Parts Supplier", "phone battery wholesale", "PHRASE"):
        "唯一的电池品类词，全暂停会导致电池无广告覆盖",
}

# 新增否定词（campaign 级，加到主 campaign）
NEW_NEGATIVES = [
    ("accessories", "BROAD"),          # wholesale wireless accessories / cell phone accessories wholesale distributor
    ("motorola", "BROAD"),             # motorola razr replacement parts —— 品类外
    ("tcl", "BROAD"),                  # tcl phone parts —— 品类外
    ("gsx", "BROAD"),                  # Apple 授权件意图
    ("apple oem", "PHRASE"),
    ("genuine apple", "PHRASE"),
    ("phone parts usa", "EXACT"),      # 要美国本土供应商，地理错配
    ("samsung phone parts usa", "EXACT"),
    ("chinese phone parts market", "EXACT"),  # 研究意图非采购
]


def load_env():
    if not ENV_PATH.exists():
        sys.exit(f"❌ 凭据文件不存在: {ENV_PATH}")
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


def fetch_state(client, cid):
    """当前关键词状态 + 30 天指标 + 现有否定词。"""
    ga = client.get_service("GoogleAdsService")

    kws = {}
    q_kw = """
        SELECT campaign.name, campaign.id, ad_group.name, ad_group.id, ad_group.status,
               ad_group_criterion.criterion_id, ad_group_criterion.status,
               ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type
        FROM ad_group_criterion
        WHERE ad_group_criterion.type = 'KEYWORD'
          AND ad_group_criterion.negative = FALSE
          AND ad_group_criterion.status != 'REMOVED'
    """
    # 🔴 key 必须是 (ad_group_id, criterion_id)：Google 的关键词 criterion_id 在账户内按
    # (文案, 匹配类型) 全局唯一，同一个词挂在两个广告组时 criterion_id 相同，只用它做 key
    # 会让跨组重复词互相覆盖、指标错配。
    for row in ga.search(customer_id=cid, query=q_kw):
        kws[(row.ad_group.id, row.ad_group_criterion.criterion_id)] = {
            "campaign": row.campaign.name,
            "ad_group": row.ad_group.name,
            "ad_group_id": row.ad_group.id,
            "ad_group_status": row.ad_group.status.name,
            "criterion_id": row.ad_group_criterion.criterion_id,
            "text": row.ad_group_criterion.keyword.text,
            "match_type": row.ad_group_criterion.keyword.match_type.name,
            "status": row.ad_group_criterion.status.name,
            "resource_name": f"customers/{cid}/adGroupCriteria/{row.ad_group.id}~{row.ad_group_criterion.criterion_id}",
            "impressions": 0, "clicks": 0, "cost": 0.0, "conversions": 0.0,
        }

    q_metrics = f"""
        SELECT ad_group.id, ad_group_criterion.criterion_id, metrics.impressions,
               metrics.clicks, metrics.cost_micros, metrics.conversions
        FROM keyword_view
        WHERE segments.date BETWEEN '{WINDOW[0]}' AND '{WINDOW[1]}'
    """
    for row in ga.search(customer_id=cid, query=q_metrics):
        k = kws.get((row.ad_group.id, row.ad_group_criterion.criterion_id))
        if k:
            k["impressions"] += row.metrics.impressions
            k["clicks"] += row.metrics.clicks
            k["cost"] += row.metrics.cost_micros / 1_000_000
            k["conversions"] += row.metrics.conversions

    ad_groups = {}
    for row in ga.search(customer_id=cid, query="""
        SELECT campaign.name, campaign.id, ad_group.id, ad_group.name, ad_group.status,
               ad_group.resource_name
        FROM ad_group WHERE ad_group.status != 'REMOVED'
    """):
        ad_groups[row.ad_group.name] = {
            "campaign": row.campaign.name, "campaign_id": row.campaign.id,
            "id": row.ad_group.id, "status": row.ad_group.status.name,
            "resource_name": row.ad_group.resource_name,
        }

    negatives = set()
    for row in ga.search(customer_id=cid, query="""
        SELECT campaign.name, campaign_criterion.keyword.text,
               campaign_criterion.keyword.match_type
        FROM campaign_criterion WHERE campaign_criterion.negative = TRUE
    """):
        if row.campaign_criterion.keyword.text:
            negatives.add((row.campaign.name,
                           row.campaign_criterion.keyword.text.lower(),
                           row.campaign_criterion.keyword.match_type.name))

    return kws, ad_groups, negatives


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="真正执行（默认只预演）")
    args = ap.parse_args()

    load_env()
    client = make_client()
    cid = os.environ["GOOGLE_ADS_CUSTOMER_ID"]

    kws, ad_groups, negatives = fetch_state(client, cid)

    # ---- 计划 1：暂停死广告组 ----
    dead = ad_groups.get(DEAD_AD_GROUP)
    pause_group = dead if dead and dead["status"] == "ENABLED" else None

    # ---- 计划 2：暂停零曝光关键词（跳过死广告组内的，组暂停已覆盖）----
    pause_kws = []
    for k in kws.values():
        if k["campaign"] != MAIN_CAMPAIGN:
            continue
        if k["ad_group"] == DEAD_AD_GROUP:
            continue
        if k["status"] != "ENABLED":
            continue
        if k["impressions"] > 0:
            continue
        if (k["ad_group"], k["text"], k["match_type"]) in KEEP:
            continue
        pause_kws.append(k)

    # ---- 计划 3：新增否定词（去重）----
    add_negs = [(t, m) for t, m in NEW_NEGATIVES
                if (MAIN_CAMPAIGN, t.lower(), m) not in negatives]

    print(f"== 计划（窗口 {WINDOW[0]}~{WINDOW[1]}）==")
    print(f"1. 暂停广告组: {DEAD_AD_GROUP} -> {'是' if pause_group else '跳过（不存在或已非 ENABLED）'}")
    print(f"2. 暂停零曝光关键词: {len(pause_kws)} 个")
    for k in sorted(pause_kws, key=lambda x: (x["ad_group"], x["text"])):
        print(f"     [{k['match_type']:<6}] {k['text']:<40} | {k['ad_group']}")
    for (ag, text, mt), why in KEEP.items():
        print(f"   （保留）[{mt}] {text} | {ag} —— {why}")
    print(f"3. 新增否定词: {len(add_negs)} 个 -> {[f'{m}:{t}' for t, m in add_negs]}")
    skipped = len(NEW_NEGATIVES) - len(add_negs)
    if skipped:
        print(f"   （{skipped} 个已存在，跳过）")

    if not args.apply:
        print("\n(预演模式，账户未改动。加 --apply 执行)")
        return

    # ---- 备份 ----
    BACKUP.write_text(json.dumps({
        "date": str(date.today()),
        "window": WINDOW,
        "customer_id": cid,
        "ad_group_paused": pause_group,
        "keywords_paused": pause_kws,
        "negatives_added": [{"campaign": MAIN_CAMPAIGN, "text": t, "match_type": m}
                            for t, m in add_negs],
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n✓ 备份写入 {BACKUP}")

    try:
        # 1. 暂停广告组
        if pause_group:
            svc = client.get_service("AdGroupService")
            op = client.get_type("AdGroupOperation")
            op.update.resource_name = pause_group["resource_name"]
            op.update.status = client.enums.AdGroupStatusEnum.PAUSED
            client.copy_from(op.update_mask,
                             protobuf_helpers.field_mask(None, op.update._pb))
            svc.mutate_ad_groups(customer_id=cid, operations=[op])
            print(f"✓ 广告组已暂停: {DEAD_AD_GROUP}")

        # 2. 暂停关键词
        if pause_kws:
            svc = client.get_service("AdGroupCriterionService")
            ops = []
            for k in pause_kws:
                op = client.get_type("AdGroupCriterionOperation")
                op.update.resource_name = k["resource_name"]
                op.update.status = client.enums.AdGroupCriterionStatusEnum.PAUSED
                client.copy_from(op.update_mask,
                                 protobuf_helpers.field_mask(None, op.update._pb))
                ops.append(op)
            svc.mutate_ad_group_criteria(customer_id=cid, operations=ops)
            print(f"✓ 已暂停 {len(pause_kws)} 个零曝光关键词")

        # 3. 加否定词
        if add_negs:
            camp_id = ad_groups[DEAD_AD_GROUP]["campaign_id"] if dead else None
            if camp_id is None:
                for ag in ad_groups.values():
                    if ag["campaign"] == MAIN_CAMPAIGN:
                        camp_id = ag["campaign_id"]
                        break
            svc = client.get_service("CampaignCriterionService")
            ops = []
            for text, mt in add_negs:
                op = client.get_type("CampaignCriterionOperation")
                c = op.create
                c.campaign = f"customers/{cid}/campaigns/{camp_id}"
                c.negative = True
                c.keyword.text = text
                c.keyword.match_type = getattr(client.enums.KeywordMatchTypeEnum, mt)
                ops.append(op)
            svc.mutate_campaign_criteria(customer_id=cid, operations=ops)
            print(f"✓ 已加 {len(add_negs)} 个否定词到主 campaign")

    except GoogleAdsException as ex:
        print(f"\n❌ API 报错 request_id={ex.request_id}")
        for err in ex.failure.errors:
            print(f"   {err.error_code}: {err.message}")
        sys.exit(1)

    print("\n完成。回滚见备份文件。")


if __name__ == "__main__":
    main()
