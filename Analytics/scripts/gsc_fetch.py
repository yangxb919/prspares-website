#!/usr/bin/env python3
"""Fetch Google Search Console search analytics with OAuth.

First run opens a browser for account consent, then caches the refresh token at:
  .secrets/gsc-token.json

Recommended run command when Google client libraries are not installed:
  uv run --with google-api-python-client --with google-auth-oauthlib --with google-auth \
    Analytics/scripts/gsc_fetch.py --days 28
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import sys
from datetime import date, timedelta
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

try:
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
except ModuleNotFoundError as exc:
    print(
        "Missing Google API client libraries.\n"
        "Run with:\n"
        "  uv run --with google-api-python-client --with google-auth-oauthlib --with google-auth "
        "Analytics/scripts/gsc_fetch.py --days 28\n",
        file=sys.stderr,
    )
    raise SystemExit(2) from exc


ROOT = Path(__file__).resolve().parents[2]
CLIENT_SECRET = ROOT / ".secrets" / "gsc-oauth-client.json"
TOKEN_FILE = ROOT / ".secrets" / "gsc-token.json"
OUTPUT_DIR = ROOT / "Analytics" / "gsc"

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
DEFAULT_SITE_CANDIDATES = [
    "sc-domain:phonerepairspares.com",
    "https://www.phonerepairspares.com/",
    "https://phonerepairspares.com/",
]


def parse_args() -> argparse.Namespace:
    today = date.today()
    default_end = today - timedelta(days=2)
    default_start = default_end - timedelta(days=27)

    parser = argparse.ArgumentParser(
        description="Fetch GSC Search Analytics data for PRSPARES."
    )
    parser.add_argument(
        "--site",
        help="GSC siteUrl. If omitted, auto-selects phonerepairspares.com if accessible.",
    )
    parser.add_argument(
        "--start",
        default=default_start.isoformat(),
        help=f"Start date YYYY-MM-DD. Default: {default_start.isoformat()}",
    )
    parser.add_argument(
        "--end",
        default=default_end.isoformat(),
        help=f"End date YYYY-MM-DD. Default: {default_end.isoformat()}",
    )
    parser.add_argument(
        "--days",
        type=int,
        help="Shortcut for last N days ending at today-2, because GSC data lags.",
    )
    parser.add_argument(
        "--row-limit",
        type=int,
        default=250,
        help="Rows per table for query/page/country/device exports. Default: 250",
    )
    parser.add_argument(
        "--list-sites",
        action="store_true",
        help="List accessible GSC properties and exit.",
    )
    parser.add_argument(
        "--include-query-pages",
        action="store_true",
        help="Also export query+page rows. This can be larger and slower.",
    )
    parser.add_argument(
        "--auth-port",
        type=int,
        default=0,
        help="Local OAuth callback port. Default 0 lets the OS choose.",
    )
    return parser.parse_args()


def apply_days_shortcut(args: argparse.Namespace) -> None:
    if not args.days:
        return
    end = date.today() - timedelta(days=2)
    start = end - timedelta(days=args.days - 1)
    args.start = start.isoformat()
    args.end = end.isoformat()


def load_credentials(auth_port: int) -> Credentials:
    if not CLIENT_SECRET.exists():
        raise SystemExit(f"Missing OAuth client file: {CLIENT_SECRET}")

    creds: Optional[Credentials] = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)

    if creds and creds.expired and creds.refresh_token:
        try:
            creds.refresh(Request())
        except Exception as exc:  # RefreshError: token expired/revoked (e.g. Testing-mode 7-day expiry)
            print(
                f"Cached refresh token unusable ({exc}); falling back to browser consent.",
                file=sys.stderr,
            )
            creds = None

    if not creds or not creds.valid:
        print(
            "Opening browser for GSC OAuth consent. "
            "Use lijiedong08@gmail.com if that account owns the Search Console property."
        )
        flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRET), SCOPES)
        creds = flow.run_local_server(
            port=auth_port,
            open_browser=True,
            authorization_prompt_message="Authorize GSC access in the browser: {url}",
            success_message="GSC authorization complete. You can close this tab.",
        )

    TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)
    TOKEN_FILE.write_text(creds.to_json(), encoding="utf-8")
    os.chmod(TOKEN_FILE, 0o600)
    return creds


def build_service(creds: Credentials):
    return build("searchconsole", "v1", credentials=creds)


def list_sites(service) -> List[Dict[str, str]]:
    resp = service.sites().list().execute()
    sites = resp.get("siteEntry", [])
    sites.sort(key=lambda row: row.get("siteUrl", ""))
    return sites


def select_site(service, explicit_site: Optional[str]) -> str:
    if explicit_site:
        return explicit_site

    sites = list_sites(service)
    accessible = [
        s
        for s in sites
        if s.get("permissionLevel") and s.get("permissionLevel") != "siteUnverifiedUser"
    ]
    site_urls = {s.get("siteUrl") for s in accessible}
    for candidate in DEFAULT_SITE_CANDIDATES:
        if candidate in site_urls:
            return candidate

    print("Could not auto-select a PRSPARES GSC property.", file=sys.stderr)
    print("Accessible sites:", file=sys.stderr)
    for site in accessible:
        print(f"  {site.get('siteUrl')} ({site.get('permissionLevel')})", file=sys.stderr)
    raise SystemExit("Pass one explicitly, for example: --site sc-domain:phonerepairspares.com")


def query_search_analytics(
    service,
    site_url: str,
    start_date: str,
    end_date: str,
    dimensions: List[str],
    row_limit: int,
) -> List[Dict[str, Any]]:
    body = {
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": dimensions,
        "rowLimit": row_limit,
    }
    resp = service.searchanalytics().query(siteUrl=site_url, body=body).execute()
    rows = []
    for row in resp.get("rows", []):
        item: Dict[str, Any] = {}
        keys = row.get("keys", [])
        for idx, dim in enumerate(dimensions):
            item[dim] = keys[idx] if idx < len(keys) else ""
        item.update(
            {
                "clicks": row.get("clicks", 0),
                "impressions": row.get("impressions", 0),
                "ctr": row.get("ctr", 0),
                "position": row.get("position", 0),
            }
        )
        rows.append(item)
    return rows


def write_csv(path: Path, rows: List[Dict[str, Any]], fieldnames: List[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow({key: row.get(key, "") for key in fieldnames})


def totals_from_rows(rows: Iterable[Dict[str, Any]]) -> Dict[str, Any]:
    row_list = list(rows)
    clicks = sum(float(row.get("clicks") or 0) for row in row_list)
    impressions = sum(float(row.get("impressions") or 0) for row in row_list)
    weighted_position_numerator = sum(
        float(row.get("position") or 0) * float(row.get("impressions") or 0)
        for row in row_list
    )
    return {
        "clicks": int(clicks),
        "impressions": int(impressions),
        "ctr": clicks / impressions if impressions else 0,
        "avg_position": weighted_position_numerator / impressions if impressions else 0,
    }


def export_dataset(
    service,
    site_url: str,
    start_date: str,
    end_date: str,
    row_limit: int,
    include_query_pages: bool,
) -> Path:
    out_dir = OUTPUT_DIR / f"{start_date}_to_{end_date}"
    out_dir.mkdir(parents=True, exist_ok=True)

    exports = {
        "daily": ["date"],
        "queries": ["query"],
        "pages": ["page"],
        "countries": ["country"],
        "devices": ["device"],
    }
    if include_query_pages:
        exports["query_pages"] = ["query", "page"]

    all_data: Dict[str, Any] = {
        "site_url": site_url,
        "start_date": start_date,
        "end_date": end_date,
        "exports": {},
    }

    for name, dimensions in exports.items():
        limit = row_limit
        if name == "daily":
            limit = 1000
        rows = query_search_analytics(
            service, site_url, start_date, end_date, dimensions, limit
        )
        if name == "daily":
            rows.sort(key=lambda row: row.get("date", ""))
        metric_fields = ["clicks", "impressions", "ctr", "position"]
        write_csv(out_dir / f"{name}.csv", rows, dimensions + metric_fields)
        all_data["exports"][name] = rows

    all_data["summary"] = totals_from_rows(all_data["exports"].get("daily", []))
    (out_dir / "search_analytics.json").write_text(
        json.dumps(all_data, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return out_dir


def print_summary(out_dir: Path, data: Dict[str, Any]) -> None:
    summary = data["summary"]
    print(f"GSC export written: {out_dir.relative_to(ROOT)}")
    print(
        "Summary: "
        f"clicks={summary['clicks']} "
        f"impressions={summary['impressions']} "
        f"ctr={summary['ctr']:.2%} "
        f"avg_position={summary['avg_position']:.1f}"
    )


def main() -> None:
    args = parse_args()
    apply_days_shortcut(args)
    creds = load_credentials(args.auth_port)
    service = build_service(creds)

    if args.list_sites:
        for site in list_sites(service):
            print(f"{site.get('siteUrl')}\t{site.get('permissionLevel')}")
        return

    site_url = select_site(service, args.site)
    out_dir = export_dataset(
        service=service,
        site_url=site_url,
        start_date=args.start,
        end_date=args.end,
        row_limit=args.row_limit,
        include_query_pages=args.include_query_pages,
    )

    data = json.loads((out_dir / "search_analytics.json").read_text(encoding="utf-8"))
    print_summary(out_dir, data)


if __name__ == "__main__":
    main()
