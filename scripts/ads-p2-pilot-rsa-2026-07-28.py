#!/usr/bin/env python3
"""
pilot-geo 的 RSA ad strength AVERAGE → 目标 GOOD+。

RSA 不支持原地编辑素材，只能「新建一条 + 移除旧的」。
改动：标题 10 → 15（补 5 条不同卖点角度）、加 path1/path2、描述沿用 4 条。

文案纪律：pilot 投 CA/AU/EU，"省 30-40%" 对欧澳本地分销商成立（有我方价格情报支撑），
不写对 US 不成立的版本。

用法：
    /Users/yangxiaobo/.hermes/hermes-agent/venv/bin/python3 scripts/ads-p2-pilot-rsa-2026-07-28.py
    /Users/yangxiaobo/.hermes/hermes-agent/venv/bin/python3 scripts/ads-p2-pilot-rsa-2026-07-28.py --apply

回滚：备份 JSON 存了旧广告的完整素材，按其重建即可（旧广告是 REMOVE，不可恢复原 id）。
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
BACKUP = ROOT / "Analytics" / "_backups_ads-pilot-rsa-2026-07-28.json"
ENV_PATH = Path.home() / ".hermes" / ".env"

PILOT_CAMPAIGN = "Search | PRSPARES | pilot-geo-2026w28 | CA-AU-EU | EN"

NEW_HEADLINES = [   # 每条 ≤30 字符（Google RSA 硬限制）
    "Wholesale Phone Repair Parts",
    "Factory-Direct From Shenzhen",
    "iPhone Screens Wholesale",
    "12-Month Warranty On Parts",
    "MOQ From 10 Pcs",
    "Transparent Tiered Pricing",
    "24h Wholesale Quote",
    "OEM & Aftermarket Grades",
    "Ships DHL/FedEx 3-7 Days",
    "For Repair Shops & Resellers",
    # ↓ 新增 5 条
    "Save 30-40% vs Distributors",
    "500+ SKUs Ready to Ship",
    "Samsung & iPhone Parts",
    "Batteries, Screens, Flex",
    "No Single-Model MOQ",
]
NEW_DESCRIPTIONS = [   # 每条 ≤90 字符
    "Factory-direct iPhone & Samsung parts. QC'd batches, 12-month warranty, DHL 3-7 days.",
    "Transparent tiered pricing for repair shops & distributors. Get your quote in 24 hours.",
    "Skip the middleman markup. Original, OEM & aftermarket grades, honestly labeled.",
    "500+ SKUs in stock: screens, batteries, cameras, flex cables. MOQ from 10 pcs.",
]
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


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    over = [h for h in NEW_HEADLINES if len(h) > 30]
    over_d = [d for d in NEW_DESCRIPTIONS if len(d) > 90]
    if over or over_d:
        sys.exit(f"❌ 超长素材（标题>30 / 描述>90）: {over} {over_d}")

    load_env()
    client = make_client()
    cid = os.environ["GOOGLE_ADS_CUSTOMER_ID"]
    ga = client.get_service("GoogleAdsService")

    old = None
    for row in ga.search(customer_id=cid, query="""
        SELECT campaign.name, ad_group.resource_name, ad_group.name,
               ad_group_ad.resource_name, ad_group_ad.ad.id, ad_group_ad.ad_strength,
               ad_group_ad.ad.final_urls,
               ad_group_ad.ad.responsive_search_ad.headlines,
               ad_group_ad.ad.responsive_search_ad.descriptions
        FROM ad_group_ad
        WHERE ad_group_ad.status != 'REMOVED'
    """):
        if row.campaign.name == PILOT_CAMPAIGN:
            old = {
                "ad_group": row.ad_group.resource_name,
                "ad_resource": row.ad_group_ad.resource_name,
                "ad_id": row.ad_group_ad.ad.id,
                "strength": row.ad_group_ad.ad_strength.name,
                "final_urls": list(row.ad_group_ad.ad.final_urls),
                "headlines": [a.text for a in row.ad_group_ad.ad.responsive_search_ad.headlines],
                "descriptions": [a.text for a in row.ad_group_ad.ad.responsive_search_ad.descriptions],
            }
            break

    if not old:
        sys.exit(f"❌ 没找到 pilot campaign 的广告: {PILOT_CAMPAIGN}")

    print(f"旧广告 id={old['ad_id']} strength={old['strength']} "
          f"标题 {len(old['headlines'])} 条 / 描述 {len(old['descriptions'])} 条")
    added = [h for h in NEW_HEADLINES if h not in old["headlines"]]
    print(f"新广告：标题 {len(NEW_HEADLINES)} 条（新增 {len(added)}：{added}）+ path /{PATH1}/{PATH2}")

    if not args.apply:
        print("\n(预演模式，账户未改动。加 --apply 执行)")
        return

    BACKUP.write_text(json.dumps({"date": str(date.today()), "old_ad": old},
                                 ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✓ 旧广告素材已备份 {BACKUP}")

    try:
        svc = client.get_service("AdGroupAdService")
        op = client.get_type("AdGroupAdOperation")
        ada = op.create
        ada.ad_group = old["ad_group"]
        ada.status = client.enums.AdGroupAdStatusEnum.ENABLED
        for u in old["final_urls"]:
            ada.ad.final_urls.append(u)
        ada.ad.responsive_search_ad.path1 = PATH1
        ada.ad.responsive_search_ad.path2 = PATH2
        for text in NEW_HEADLINES:
            a = client.get_type("AdTextAsset"); a.text = text
            ada.ad.responsive_search_ad.headlines.append(a)
        for text in NEW_DESCRIPTIONS:
            a = client.get_type("AdTextAsset"); a.text = text
            ada.ad.responsive_search_ad.descriptions.append(a)
        new_rn = svc.mutate_ad_group_ads(customer_id=cid, operations=[op]).results[0].resource_name
        print(f"✓ 新 RSA 已建 {new_rn}")

        rm = client.get_type("AdGroupAdOperation")
        rm.remove = old["ad_resource"]
        svc.mutate_ad_group_ads(customer_id=cid, operations=[rm])
        print(f"✓ 旧广告已移除 (id={old['ad_id']})")

    except GoogleAdsException as ex:
        print(f"❌ API 报错 request_id={ex.request_id}")
        for err in ex.failure.errors:
            path = ".".join(e.field_name for e in err.location.field_path_elements)
            print(f"   {err.error_code}: {err.message}  [字段: {path}]")
        sys.exit(1)


if __name__ == "__main__":
    main()
