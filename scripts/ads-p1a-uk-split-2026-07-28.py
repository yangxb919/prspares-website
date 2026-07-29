#!/usr/bin/env python3
"""
P1-a UK 拆分（2026-07-28）——账户总预算不变，只做拆分。

背景：US CPA ¥139（9 转化）vs UK CPA ¥242（2 转化），UK 的 CPC 反而更便宜（¥8.8）
= 便宜但不转化。拆开后 UK 可独立控制、不再吃 US 的预算。

做四件事：
1. 新建 campaign `Search | PRSPARES | UK | EN`（¥15/天，Search only，PRESENCE，UK+英语）
2. 复制主 campaign 的 102 个否定词 + 6 个已验证关键词 + RSA 素材（含 UK 版文案修正）
3. 主 campaign 移除 UK 地域 → 只投 US
4. 主 campaign 预算 ¥50 → ¥35（¥35 + ¥15 = ¥50，账户总额不变）

出价策略：Maximize Clicks + CPC 上限 ¥9（不用 MaxConv/tCPA——新 campaign 零转化历史，
¥15/天 + 月 ~2 转化喂不动智能出价，这是 pilot-geo 的同款理由）。

用法：
    /Users/yangxiaobo/.hermes/hermes-agent/venv/bin/python3 scripts/ads-p1a-uk-split-2026-07-28.py
    /Users/yangxiaobo/.hermes/hermes-agent/venv/bin/python3 scripts/ads-p1a-uk-split-2026-07-28.py --apply

回滚：备份 JSON 含新建对象的 resource_name（删掉即可）+ 主 campaign 的原预算/原地域。
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
BACKUP = ROOT / "Analytics" / "_backups_ads-uk-split-2026-07-28.json"
ENV_PATH = Path.home() / ".hermes" / ".env"

MAIN_CAMPAIGN = "Search | PR Spares | Factory Direct | US-UK | EN"
NEW_CAMPAIGN = "Search | PRSPARES | UK | EN"
NEW_AD_GROUP = "UK Wholesale Parts"

GEO_UK = "geoTargetConstants/2826"
GEO_US = "geoTargetConstants/2840"
LANG_EN = "languageConstants/1000"

NEW_BUDGET_MICROS = 15_000_000      # ¥15/天
MAIN_BUDGET_MICROS = 35_000_000     # ¥50 → ¥35，两者合计仍是 ¥50
CPC_CEILING_MICROS = 9_000_000      # ¥9（UK 实测 CPC ¥8.8）

# 只带 30 天内真正跑出数据的词（3 个出过转化 + 3 个主力点击词），¥15/天 不铺量
UK_KEYWORDS = [
    ("phone parts distributor", "PHRASE"),        # 44 点击 / 3 转化
    ("mobile repair parts distributor", "PHRASE"),# 26 点击 / 3 转化（CPA ¥110 最优之一）
    ("mobile parts wholesale", "PHRASE"),         # 8 点击 / 1 转化
    ("wholesale phone screens", "PHRASE"),        # 3 点击 / 2 转化（CPA ¥24 全账户最好）
    ("wholesale phone parts", "PHRASE"),          # 20 点击主力词
    ("phone parts supplier", "EXACT"),            # 18 点击主力词
]

# 沿用主 campaign 的 EXCELLENT 素材；仅把 US 专属那条换成对 UK 成立的版本
# （我方价格情报：对 US 分销商只省 0-15%，30-40% 只对欧澳本地分销商成立）
HEADLINES = [
    "Phone Parts — Factory Direct",
    "Wholesale Phone Repair Parts",
    "Save 30-40% vs UK Distributors",   # ← US 版原文是 "vs US Distributors"，对 US 不成立
    "Direct From Shenzhen Factory",
    "B2B Phone Parts Supplier",
    "Bulk Phone Parts — Low MOQ",
    "500+ SKUs Ready to Ship",
    "OEM Quality Phone Parts",
    "Get Quote in 24 Hours",
    "For Repair Shops & Resellers",
    "Skip the Middleman — Save More",
    "12-Month Warranty Included",
    "Wholesale LCD Screens & More",
    "DHL/FedEx — Ships in 3-7 Days",
    "Free Wholesale Quote Today",
]
DESCRIPTIONS = [
    "Phone parts factory-direct from Shenzhen. OEM quality, triple QC'd. Get a quote today.",
    "Wholesale screens, batteries & parts for repair shops. MOQ 10 pcs. Free quote in 24h.",
    "Skip the middleman - save 30-40% on phone parts. 500+ SKUs in stock. Ships in 3-7 days.",
    "B2B phone parts supplier. 12-month warranty. Screens, batteries & cables. Get pricing.",
]
FINAL_URL = "https://www.phonerepairspares.com/lp/google-ads-factory-direct.html"
PATH1, PATH2 = "wholesale", "parts"


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


def survey(ga, cid):
    """现状：campaign id / 主 campaign 的预算与 UK 地域 criterion / 否定词表。"""
    campaigns = {}
    for row in ga.search(customer_id=cid, query="""
        SELECT campaign.id, campaign.name, campaign.status,
               campaign_budget.resource_name, campaign_budget.amount_micros
        FROM campaign WHERE campaign.status != 'REMOVED'
    """):
        campaigns[row.campaign.name] = {
            "id": row.campaign.id,
            "status": row.campaign.status.name,
            "budget_resource": row.campaign_budget.resource_name,
            "budget_micros": row.campaign_budget.amount_micros,
        }

    uk_criterion = None
    for row in ga.search(customer_id=cid, query=f"""
        SELECT campaign.name, campaign_criterion.resource_name,
               campaign_criterion.location.geo_target_constant
        FROM campaign_criterion
        WHERE campaign_criterion.negative = FALSE
          AND campaign_criterion.type = 'LOCATION'
    """):
        if (row.campaign.name == MAIN_CAMPAIGN
                and row.campaign_criterion.location.geo_target_constant == GEO_UK):
            uk_criterion = row.campaign_criterion.resource_name

    negatives = []
    for row in ga.search(customer_id=cid, query="""
        SELECT campaign.name, campaign_criterion.keyword.text,
               campaign_criterion.keyword.match_type
        FROM campaign_criterion WHERE campaign_criterion.negative = TRUE
    """):
        if row.campaign.name == MAIN_CAMPAIGN and row.campaign_criterion.keyword.text:
            negatives.append((row.campaign_criterion.keyword.text,
                              row.campaign_criterion.keyword.match_type.name))

    return campaigns, uk_criterion, negatives


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    load_env()
    client = make_client()
    cid = os.environ["GOOGLE_ADS_CUSTOMER_ID"]
    ga = client.get_service("GoogleAdsService")

    campaigns, uk_criterion, negatives = survey(ga, cid)

    if MAIN_CAMPAIGN not in campaigns:
        sys.exit(f"❌ 找不到主 campaign: {MAIN_CAMPAIGN}")
    if NEW_CAMPAIGN in campaigns:
        sys.exit(f"❌ campaign 已存在，勿重复建: {NEW_CAMPAIGN}（如需重跑请先删除）")
    if not uk_criterion:
        print("⚠️  主 campaign 上没找到 UK 地域定向（可能已摘除），第 3 步将跳过")

    main_c = campaigns[MAIN_CAMPAIGN]
    print("== 计划 ==")
    print(f"1. 新建 `{NEW_CAMPAIGN}`：¥{NEW_BUDGET_MICROS/1e6:.0f}/天，Maximize Clicks + CPC 上限 ¥{CPC_CEILING_MICROS/1e6:.0f}")
    print(f"   地域 UK(2826) / 语言 EN / 仅 Google 搜索网络 / PRESENCE")
    print(f"   广告组 `{NEW_AD_GROUP}`：{len(UK_KEYWORDS)} 个已验证关键词 + 1 条 RSA（15 标题 / 4 描述）")
    print(f"   否定词复制：{len(negatives)} 个")
    print(f"2. 主 campaign 移除 UK 地域 -> {'是' if uk_criterion else '跳过'}（US 2840 保留）")
    print(f"3. 主 campaign 预算 ¥{main_c['budget_micros']/1e6:.0f} -> ¥{MAIN_BUDGET_MICROS/1e6:.0f}/天")
    print(f"   账户合计：¥{(MAIN_BUDGET_MICROS+NEW_BUDGET_MICROS)/1e6:.0f}/天（拆分前主 campaign ¥{main_c['budget_micros']/1e6:.0f}，pilot 不动）")

    if not args.apply:
        print("\n(预演模式，账户未改动。加 --apply 执行)")
        return

    created = {}
    try:
        # ---- 1. 预算 ----
        bsvc = client.get_service("CampaignBudgetService")
        budget_name = f"{NEW_CAMPAIGN} — budget"
        budget_rn = None
        for row in ga.search(customer_id=cid, query=f'''
            SELECT campaign_budget.resource_name, campaign_budget.name
            FROM campaign_budget WHERE campaign_budget.status != 'REMOVED'
        '''):
            if row.campaign_budget.name == budget_name:
                budget_rn = row.campaign_budget.resource_name
                print(f"↻ 复用已存在的预算 {budget_rn}")
                break
        if not budget_rn:
            bop = client.get_type("CampaignBudgetOperation")
            b = bop.create
            b.name = budget_name
            b.amount_micros = NEW_BUDGET_MICROS
            b.delivery_method = client.enums.BudgetDeliveryMethodEnum.STANDARD
            b.explicitly_shared = False
            budget_rn = bsvc.mutate_campaign_budgets(
                customer_id=cid, operations=[bop]).results[0].resource_name
            created["budget"] = budget_rn
            print(f"✓ 预算已建 {budget_rn}")

        # ---- 2. campaign ----
        csvc = client.get_service("CampaignService")
        cop = client.get_type("CampaignOperation")
        c = cop.create
        c.name = NEW_CAMPAIGN
        c.status = client.enums.CampaignStatusEnum.ENABLED
        c.advertising_channel_type = client.enums.AdvertisingChannelTypeEnum.SEARCH
        c.campaign_budget = budget_rn
        c.target_spend.cpc_bid_ceiling_micros = CPC_CEILING_MICROS
        c.network_settings.target_google_search = True
        c.network_settings.target_search_network = False
        c.network_settings.target_content_network = False
        c.network_settings.target_partner_search_network = False
        c.geo_target_type_setting.positive_geo_target_type = (
            client.enums.PositiveGeoTargetTypeEnum.PRESENCE)
        # TTPA（欧盟政治广告条例）：新建 campaign 必须显式声明，否则报
        # "The required field was not present."（错误里不给字段路径，很难查）
        c.contains_eu_political_advertising = (
            client.enums.EuPoliticalAdvertisingStatusEnum
            .DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING)
        camp_rn = csvc.mutate_campaigns(
            customer_id=cid, operations=[cop]).results[0].resource_name
        created["campaign"] = camp_rn
        print(f"✓ campaign 已建 {camp_rn}")

        # ---- 3. 地域 + 语言 + 否定词 ----
        ccsvc = client.get_service("CampaignCriterionService")
        ops = []
        for rn_field, value in (("location", GEO_UK), ("language", LANG_EN)):
            op = client.get_type("CampaignCriterionOperation")
            cc = op.create
            cc.campaign = camp_rn
            if rn_field == "location":
                cc.location.geo_target_constant = value
            else:
                cc.language.language_constant = value
            ops.append(op)
        for text, mt in negatives:
            op = client.get_type("CampaignCriterionOperation")
            cc = op.create
            cc.campaign = camp_rn
            cc.negative = True
            cc.keyword.text = text
            cc.keyword.match_type = getattr(client.enums.KeywordMatchTypeEnum, mt)
            ops.append(op)
        for i in range(0, len(ops), 200):
            ccsvc.mutate_campaign_criteria(customer_id=cid, operations=ops[i:i + 200])
        print(f"✓ 地域/语言 + {len(negatives)} 个否定词已挂上")

        # ---- 4. 广告组 ----
        agsvc = client.get_service("AdGroupService")
        agop = client.get_type("AdGroupOperation")
        ag = agop.create
        ag.name = NEW_AD_GROUP
        ag.campaign = camp_rn
        ag.status = client.enums.AdGroupStatusEnum.ENABLED
        ag.type_ = client.enums.AdGroupTypeEnum.SEARCH_STANDARD
        ag_rn = agsvc.mutate_ad_groups(
            customer_id=cid, operations=[agop]).results[0].resource_name
        created["ad_group"] = ag_rn
        print(f"✓ 广告组已建 {ag_rn}")

        # ---- 5. 关键词 ----
        acsvc = client.get_service("AdGroupCriterionService")
        ops = []
        for text, mt in UK_KEYWORDS:
            op = client.get_type("AdGroupCriterionOperation")
            k = op.create
            k.ad_group = ag_rn
            k.status = client.enums.AdGroupCriterionStatusEnum.ENABLED
            k.keyword.text = text
            k.keyword.match_type = getattr(client.enums.KeywordMatchTypeEnum, mt)
            ops.append(op)
        acsvc.mutate_ad_group_criteria(customer_id=cid, operations=ops)
        print(f"✓ {len(UK_KEYWORDS)} 个关键词已加")

        # ---- 6. RSA ----
        adsvc = client.get_service("AdGroupAdService")
        adop = client.get_type("AdGroupAdOperation")
        ada = adop.create
        ada.ad_group = ag_rn
        ada.status = client.enums.AdGroupAdStatusEnum.ENABLED
        ada.ad.final_urls.append(FINAL_URL)
        ada.ad.responsive_search_ad.path1 = PATH1
        ada.ad.responsive_search_ad.path2 = PATH2
        for text in HEADLINES:
            asset = client.get_type("AdTextAsset")
            asset.text = text
            ada.ad.responsive_search_ad.headlines.append(asset)
        for text in DESCRIPTIONS:
            asset = client.get_type("AdTextAsset")
            asset.text = text
            ada.ad.responsive_search_ad.descriptions.append(asset)
        ad_rn = adsvc.mutate_ad_group_ads(
            customer_id=cid, operations=[adop]).results[0].resource_name
        created["ad"] = ad_rn
        print(f"✓ RSA 已建 {ad_rn}")

        # ---- 7. 主 campaign 摘掉 UK ----
        if uk_criterion:
            op = client.get_type("CampaignCriterionOperation")
            op.remove = uk_criterion
            ccsvc.mutate_campaign_criteria(customer_id=cid, operations=[op])
            print("✓ 主 campaign 已移除 UK 地域（US 保留）")

        # ---- 8. 主 campaign 降预算 ----
        bop2 = client.get_type("CampaignBudgetOperation")
        bu = bop2.update
        bu.resource_name = main_c["budget_resource"]
        bu.amount_micros = MAIN_BUDGET_MICROS
        client.copy_from(bop2.update_mask, protobuf_helpers.field_mask(None, bu._pb))
        bsvc.mutate_campaign_budgets(customer_id=cid, operations=[bop2])
        print(f"✓ 主 campaign 预算 -> ¥{MAIN_BUDGET_MICROS/1e6:.0f}/天")

    except GoogleAdsException as ex:
        print(f"\n❌ API 报错 request_id={ex.request_id}")
        for err in ex.failure.errors:
            path = ".".join(e.field_name for e in err.location.field_path_elements)
            print(f"   {err.error_code}: {err.message}  [字段: {path}]")
        print(f"   已创建对象（可能需手动清理）：{json.dumps(created, ensure_ascii=False)}")
        sys.exit(1)
    finally:
        BACKUP.write_text(json.dumps({
            "date": str(date.today()),
            "created": created,
            "main_campaign_budget_before_micros": main_c["budget_micros"],
            "main_campaign_budget_resource": main_c["budget_resource"],
            "main_campaign_uk_criterion_removed": uk_criterion,
            "uk_keywords": UK_KEYWORDS,
        }, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"备份写入 {BACKUP}")


if __name__ == "__main__":
    main()
