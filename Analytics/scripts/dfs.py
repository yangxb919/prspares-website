#!/usr/bin/env python3
"""dfs.py — DataForSEO REST CLI（替代常驻 MCP 的 83 个 tools）。

本项目把 dataforseo MCP 列入 ~/.claude.json 的 disabledMcpServers（省 context），
需要 DataForSEO 时走这个脚本直连 REST API —— 功能是 MCP 的超集：
  - MCP 每个工具本质就是 POST 一个 /v3/... 端点（body 必须是数组 [{...}]），
    本脚本封装了同样的调用 + 友好输出 + 缓存，并用 `raw` 子命令兜底任意端点。
  - 凭据从 ~/.claude.json 的 mcpServers.dataforseo.env 读取（不硬编码、不 commit）。

常用子命令（覆盖项目实际用到的 MCP 工具）:
  vol          关键词月搜量/竞争/CPC（google_ads，带缓存省钱）
  overview     关键词总览（labs：搜量+难度+意图+CPC）
  serp         Google 自然结果 + SERP 特征检测（ai_overview / PAA / featured_snippet / local_pack）
  chatgpt      ChatGPT 实际回答抓取（GEO：看 PRSPARES 是否被提及；--web 强制联网）
  llm          任意模型回答（claude/gemini/chat_gpt/perplexity），需 --model（先用 models 查）
  models       列出某 llm_type 可用模型
  ranked       某域名当前排名的关键词
  ideas        关键词 ideas（扩词）
  suggestions  关键词 suggestions（长尾）
  difficulty   批量关键词难度
  intent       搜索意图分类
  domain       域名排名总览
  raw          兜底：调任意 /v3 端点（保证 = MCP 全部 84 个工具的超集）

示例:
  python3 Analytics/scripts/dfs.py vol "iphone screen wholesale" "phone parts supplier"
  python3 Analytics/scripts/dfs.py overview "oled screen replacement" --location "United Kingdom"
  python3 Analytics/scripts/dfs.py serp "wholesale phone parts" --location "United States"
  python3 Analytics/scripts/dfs.py chatgpt "best factory-direct phone parts supplier in China" --web
  python3 Analytics/scripts/dfs.py models chat_gpt
  python3 Analytics/scripts/dfs.py llm "who sells wholesale iPhone screens" --type chat_gpt --model "gpt-4o" --web
  python3 Analytics/scripts/dfs.py ranked phonerepairspares.com --limit 50
  python3 Analytics/scripts/dfs.py raw /v3/ai_optimization/llm_mentions/search/live --data @payload.json --json

全局开关:
  --json   打印该端点完整原始 result（JSON），跳过友好摘要
  --full   打印整个 API 响应（含 tasks 元信息 + cost）
  --out F  把原始响应写到文件 F
"""
from __future__ import annotations

import argparse
import base64
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

BASE = "https://api.dataforseo.com"
ROOT = Path(__file__).resolve().parents[2]
CACHE_FILE = ROOT / "Analytics" / "scripts" / ".dfs_volume_cache.json"  # 与 keyword_opportunity.py 共用


# ---------- 凭据 ----------
def read_creds():
    """从 ~/.claude.json 递归找 DATAFORSEO_USERNAME/PASSWORD（与 keyword_opportunity.py 一致）。"""
    cfg = json.loads((Path.home() / ".claude.json").read_text(encoding="utf-8"))

    def find(o):
        if isinstance(o, dict):
            if "DATAFORSEO_USERNAME" in o:
                return o["DATAFORSEO_USERNAME"], o["DATAFORSEO_PASSWORD"]
            for v in o.values():
                r = find(v)
                if r:
                    return r
        return None

    creds = find(cfg)
    if not creds:
        raise SystemExit("找不到 DataForSEO 凭据（~/.claude.json → mcpServers.dataforseo.env）")
    return creds


def auth_header():
    user, pw = read_creds()
    return "Basic " + base64.b64encode(f"{user}:{pw}".encode()).decode()


# ---------- 通用请求 ----------
def request(path, payload=None, method="POST"):
    """打任意 /v3 端点。payload 是单个 task dict（自动包成数组）或 None（GET）。
    返回完整解析后的响应 dict。"""
    if not path.startswith("/"):
        path = "/" + path
    data = None
    if payload is not None:
        body = payload if isinstance(payload, list) else [payload]
        data = json.dumps(body).encode()
    req = urllib.request.Request(
        BASE + path,
        data=data,
        method=method,
        headers={"Authorization": auth_header(), "Content-Type": "application/json"},
    )
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=180).read())
    except urllib.error.HTTPError as e:
        sys.exit(f"[HTTP {e.code}] {e.read().decode(errors='replace')[:500]}")
    except Exception as e:  # noqa: BLE001
        sys.exit(f"[请求失败] {e!r}")
    # 顶层状态 + 花费 → stderr
    sc, sm, cost = resp.get("status_code"), resp.get("status_message"), resp.get("cost", 0)
    print(f"[dfs] {path}  status={sc} {sm}  cost=${cost}", file=sys.stderr)
    if sc and sc != 20000:
        print(f"[dfs][warn] 顶层非 20000，可能未返回数据", file=sys.stderr)
    return resp


def first_result(resp):
    """取 tasks[0].result（并把 task 级错误打到 stderr）。"""
    tasks = resp.get("tasks") or []
    if not tasks:
        return []
    t0 = tasks[0]
    if t0.get("status_code") not in (20000, None):
        print(f"[dfs][task] {t0.get('status_code')} {t0.get('status_message')}", file=sys.stderr)
    return t0.get("result") or []


# ---------- 缓存（仅 vol，复用 keyword_opportunity 的格式 {loc: {kw: {...}}}）----------
def load_cache():
    if CACHE_FILE.exists():
        try:
            return json.loads(CACHE_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return {}
    return {}


def save_cache(c):
    CACHE_FILE.write_text(json.dumps(c, ensure_ascii=False, indent=0), encoding="utf-8")


# ---------- 输出辅助 ----------
def emit(resp, result, args, render):
    """统一出口：--out 落盘原始响应；--full/--json 打 JSON；否则跑 render() 友好摘要。"""
    if getattr(args, "out", None):
        Path(args.out).write_text(json.dumps(resp, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"✅ 原始响应已写入 {args.out}", file=sys.stderr)
    if getattr(args, "full", False):
        print(json.dumps(resp, ensure_ascii=False, indent=2))
        return
    if getattr(args, "json", False):
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return
    try:
        render(result)
    except Exception as e:  # noqa: BLE001
        print(f"[dfs][warn] 摘要渲染失败({e!r})，回退 JSON：", file=sys.stderr)
        print(json.dumps(result, ensure_ascii=False, indent=2))


def _f(x, suffix=""):
    return ("—" if x is None else f"{x}{suffix}")


# ---------- 子命令 ----------
def cmd_vol(args):
    kws = args.keywords
    cache = load_cache()
    bucket = cache.setdefault(args.location, {})
    missing = [k for k in kws if k.lower() not in bucket
               and len(k) <= 80 and len(k.split()) <= 10]
    if missing and not args.no_api:
        resp = request("/v3/keywords_data/google_ads/search_volume/live",
                       {"keywords": missing, "location_name": args.location,
                        "language_code": args.lang})
        for r in first_result(resp):
            kw = (r.get("keyword") or "").lower()
            if kw:
                bucket[kw] = {"sv": r.get("search_volume") or 0,
                              "competition": r.get("competition"),
                              "cpc": r.get("cpc")}
        save_cache(cache)
    rows = [(k, bucket.get(k.lower(), {})) for k in kws]
    if args.json:
        print(json.dumps({k: v for k, v in rows}, ensure_ascii=False, indent=2))
        return
    print(f"# 月搜量 — {args.location}")
    print(f"{'keyword':40} {'volume':>8} {'comp':>8} {'cpc':>8}")
    for k, v in rows:
        cpc = v.get("cpc")
        print(f"{k[:40]:40} {_f(v.get('sv')):>8} {_f(v.get('competition')):>8} "
              f"{('$'+str(round(cpc,2))) if cpc else '—':>8}")


def cmd_overview(args):
    resp = request("/v3/dataforseo_labs/google/keyword_overview/live",
                   {"keywords": args.keywords, "location_name": args.location,
                    "language_code": args.lang})
    result = first_result(resp)

    def render(res):
        items = (res[0].get("items") if res else None) or []
        print(f"# 关键词总览 — {args.location}")
        print(f"{'keyword':38} {'vol':>7} {'diff':>5} {'cpc':>7} intent")
        for it in items:
            ki = it.get("keyword_info") or {}
            kp = it.get("keyword_properties") or {}
            si = it.get("search_intent_info") or {}
            cpc = ki.get("cpc")
            print(f"{(it.get('keyword') or '')[:38]:38} {_f(ki.get('search_volume')):>7} "
                  f"{_f(kp.get('keyword_difficulty')):>5} "
                  f"{('$'+str(round(cpc,2))) if cpc else '—':>7} {si.get('main_intent') or '—'}")
    emit(resp, result, args, render)


def cmd_serp(args):
    resp = request("/v3/serp/google/organic/live/advanced",
                   {"keyword": args.keyword, "location_name": args.location,
                    "language_code": args.lang, "depth": args.depth})
    result = first_result(resp)

    def render(res):
        items = (res[0].get("items") if res else None) or []
        feats = {}
        organic = []
        for it in items:
            t = it.get("type")
            feats[t] = feats.get(t, 0) + 1
            if t == "organic":
                organic.append(it)
        flags = ["ai_overview", "featured_snippet", "people_also_ask", "local_pack",
                 "knowledge_graph", "related_searches", "video", "images"]
        print(f"# SERP — '{args.keyword}' @ {args.location}")
        print("SERP 特征: " + ", ".join(
            f"{f}✅({feats[f]})" if f in feats else f"{f}❌" for f in flags))
        print(f"\nTop organic（共 {len(organic)}）:")
        for it in organic[:args.top]:
            print(f"  #{it.get('rank_absolute'):>2}  {it.get('domain')}")
            print(f"       {(it.get('title') or '')[:80]}")
    emit(resp, result, args, render)


def cmd_chatgpt(args):
    payload = {"keyword": args.keyword, "location_name": args.location, "language_code": args.lang}
    if args.web:
        payload["force_web_search"] = True
    resp = request("/v3/ai_optimization/chat_gpt/llm_scraper/live/advanced", payload)
    result = first_result(resp)

    def render(res):
        items = (res[0].get("items") if res else None) or []
        print(f"# ChatGPT 抓取 — '{args.keyword}'  (force_web_search={args.web})")
        for it in items:
            for sect in (it.get("sections") or []):
                txt = sect.get("text") or ""
                if txt:
                    print(txt)
            ws = it.get("web_search_used")
            if ws is not None:
                print(f"\n[web_search_used={ws}] —— false 表示模型用训练知识、非实时联网", file=sys.stderr)
    emit(resp, result, args, render)


def cmd_models(args):
    resp = request(f"/v3/ai_optimization/{args.type}/llm_responses/models", method="GET")
    result = first_result(resp)
    if args.json or args.full:
        emit(resp, result, args, lambda r: None)
        return
    print(f"# {args.type} 可用模型:")
    for m in result:
        if isinstance(m, dict) and m.get("model_name"):
            extra = []
            if m.get("web_search_supported"):
                extra.append("web")
            if m.get("reasoning"):
                extra.append("reasoning")
            print(f"  {m['model_name']:32} {'/'.join(extra)}")
        elif isinstance(m, dict):  # 兜底：嵌套 items/models
            for x in (m.get("items") or m.get("models") or []):
                print("  " + (x.get("model_name") if isinstance(x, dict) else str(x)))


def cmd_llm(args):
    payload = {"user_prompt": args.prompt, "model_name": args.model}
    if args.web:
        payload["web_search"] = True
    resp = request(f"/v3/ai_optimization/{args.type}/llm_responses/live", payload)
    result = first_result(resp)

    def render(res):
        items = (res[0].get("items") if res else None) or []
        print(f"# {args.type}/{args.model} — '{args.prompt[:60]}'")
        for it in items:
            for sect in (it.get("sections") or []):
                if sect.get("text"):
                    print(sect["text"])
    emit(resp, result, args, render)


def cmd_ranked(args):
    resp = request("/v3/dataforseo_labs/google/ranked_keywords/live",
                   {"target": args.target, "location_name": args.location,
                    "language_code": args.lang, "limit": args.limit})
    result = first_result(resp)

    def render(res):
        items = (res[0].get("items") if res else None) or []
        print(f"# {args.target} 排名关键词（{args.location}，top {len(items)}）")
        print(f"{'kw':40} {'pos':>4} {'vol':>7}")
        for it in items:
            kw = it.get("keyword_data") or {}
            se = it.get("ranked_serp_element") or {}
            el = se.get("serp_item") or {}
            ki = kw.get("keyword_info") or {}
            print(f"{(kw.get('keyword') or '')[:40]:40} "
                  f"{_f(el.get('rank_absolute')):>4} {_f(ki.get('search_volume')):>7}")
    emit(resp, result, args, render)


def _cmd_keywords_list(args, path):
    payload = {"location_name": args.location, "language_code": args.lang, "limit": args.limit}
    if hasattr(args, "keyword") and args.keyword:
        payload["keyword"] = args.keyword
    if hasattr(args, "keywords") and args.keywords:
        payload["keywords"] = args.keywords
    resp = request(path, payload)
    result = first_result(resp)

    def render(res):
        items = (res[0].get("items") if res else None) or []
        print(f"{'keyword':46} {'vol':>7} {'cpc':>7}")
        for it in items:
            ki = it.get("keyword_info") or {}
            cpc = ki.get("cpc")
            print(f"{(it.get('keyword') or '')[:46]:46} {_f(ki.get('search_volume')):>7} "
                  f"{('$'+str(round(cpc,2))) if cpc else '—':>7}")
    emit(resp, result, args, render)


def cmd_ideas(args):
    _cmd_keywords_list(args, "/v3/dataforseo_labs/google/keyword_ideas/live")


def cmd_suggestions(args):
    _cmd_keywords_list(args, "/v3/dataforseo_labs/google/keyword_suggestions/live")


def cmd_difficulty(args):
    resp = request("/v3/dataforseo_labs/google/bulk_keyword_difficulty/live",
                   {"keywords": args.keywords, "location_name": args.location,
                    "language_code": args.lang})
    result = first_result(resp)

    def render(res):
        items = (res[0].get("items") if res else None) or []
        for it in items:
            print(f"{(it.get('keyword') or '')[:50]:50} diff={it.get('keyword_difficulty')}")
    emit(resp, result, args, render)


def cmd_intent(args):
    resp = request("/v3/dataforseo_labs/google/search_intent/live",
                   {"keywords": args.keywords, "language_code": args.lang})
    result = first_result(resp)

    def render(res):
        items = (res[0].get("items") if res else None) or []
        for it in items:
            si = it.get("keyword_intent") or {}
            print(f"{(it.get('keyword') or '')[:50]:50} {si.get('label')}")
    emit(resp, result, args, render)


def cmd_domain(args):
    resp = request("/v3/dataforseo_labs/google/domain_rank_overview/live",
                   {"target": args.target, "location_name": args.location,
                    "language_code": args.lang})
    emit(resp, first_result(resp), args, lambda r: print(json.dumps(r, ensure_ascii=False, indent=2)))


def cmd_raw(args):
    payload = None
    if args.data:
        raw = args.data
        if raw.startswith("@"):
            raw = Path(raw[1:]).read_text(encoding="utf-8")
        payload = json.loads(raw)
    resp = request(args.path, payload, method=args.method)
    # raw 默认就打全量响应
    if args.out:
        Path(args.out).write_text(json.dumps(resp, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"✅ 写入 {args.out}", file=sys.stderr)
    print(json.dumps(resp if args.full else first_result(resp), ensure_ascii=False, indent=2))


# ---------- CLI ----------
def build_parser():
    p = argparse.ArgumentParser(description="DataForSEO REST CLI（替代常驻 MCP）",
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    def add_common(sp, location=True):
        if location:
            sp.add_argument("--location", default="United States")
        sp.add_argument("--lang", default="en")
        sp.add_argument("--json", action="store_true", help="打印原始 result JSON")
        sp.add_argument("--full", action="store_true", help="打印整个 API 响应（含 cost/meta）")
        sp.add_argument("--out", help="把原始响应写到该文件")

    s = sub.add_parser("vol", help="关键词月搜量/竞争/CPC（带缓存）")
    s.add_argument("keywords", nargs="+")
    s.add_argument("--no-api", action="store_true", help="只用缓存，不调用 API")
    add_common(s); s.set_defaults(func=cmd_vol)

    s = sub.add_parser("overview", help="关键词总览（搜量+难度+意图）")
    s.add_argument("keywords", nargs="+"); add_common(s); s.set_defaults(func=cmd_overview)

    s = sub.add_parser("serp", help="Google 自然结果 + SERP 特征")
    s.add_argument("keyword"); s.add_argument("--depth", type=int, default=20)
    s.add_argument("--top", type=int, default=10); add_common(s); s.set_defaults(func=cmd_serp)

    s = sub.add_parser("chatgpt", help="ChatGPT 实际回答抓取（GEO）")
    s.add_argument("keyword"); s.add_argument("--web", action="store_true", help="强制联网搜索")
    add_common(s); s.set_defaults(func=cmd_chatgpt)

    s = sub.add_parser("models", help="列出某 llm_type 可用模型")
    s.add_argument("type", choices=["chat_gpt", "claude", "gemini", "perplexity"])
    s.add_argument("--json", action="store_true"); s.add_argument("--full", action="store_true")
    s.add_argument("--out"); s.set_defaults(func=cmd_models)

    s = sub.add_parser("llm", help="任意模型回答")
    s.add_argument("prompt")
    s.add_argument("--type", default="chat_gpt", choices=["chat_gpt", "claude", "gemini", "perplexity"])
    s.add_argument("--model", required=True, help="model_name（先用 models 子命令查）")
    s.add_argument("--web", action="store_true")
    s.add_argument("--json", action="store_true"); s.add_argument("--full", action="store_true")
    s.add_argument("--out"); s.set_defaults(func=cmd_llm)

    s = sub.add_parser("ranked", help="某域名当前排名的关键词")
    s.add_argument("target"); s.add_argument("--limit", type=int, default=50)
    add_common(s); s.set_defaults(func=cmd_ranked)

    s = sub.add_parser("ideas", help="关键词 ideas（扩词）")
    s.add_argument("keywords", nargs="+"); s.add_argument("--limit", type=int, default=50)
    add_common(s); s.set_defaults(func=cmd_ideas)

    s = sub.add_parser("suggestions", help="关键词 suggestions（长尾）")
    s.add_argument("keyword"); s.add_argument("--limit", type=int, default=50)
    add_common(s); s.set_defaults(func=cmd_suggestions)

    s = sub.add_parser("difficulty", help="批量关键词难度")
    s.add_argument("keywords", nargs="+"); add_common(s); s.set_defaults(func=cmd_difficulty)

    s = sub.add_parser("intent", help="搜索意图分类")
    s.add_argument("keywords", nargs="+")
    s.add_argument("--lang", default="en"); s.add_argument("--json", action="store_true")
    s.add_argument("--full", action="store_true"); s.add_argument("--out")
    s.set_defaults(func=cmd_intent)

    s = sub.add_parser("domain", help="域名排名总览")
    s.add_argument("target"); add_common(s); s.set_defaults(func=cmd_domain)

    s = sub.add_parser("raw", help="兜底：调任意 /v3 端点（= MCP 全部工具的超集）")
    s.add_argument("path", help="如 /v3/ai_optimization/llm_mentions/search/live")
    s.add_argument("--data", help="task 的 JSON（单对象或数组），或 @文件.json")
    s.add_argument("--method", default="POST", choices=["POST", "GET"])
    s.add_argument("--full", action="store_true", help="打全量响应（默认只打 result）")
    s.add_argument("--out"); s.set_defaults(func=cmd_raw)

    return p


def main():
    args = build_parser().parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
