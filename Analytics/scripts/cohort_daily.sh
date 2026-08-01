#!/bin/bash
# 每日 cohort 快照 —— 由 launchd 调用（~/Library/LaunchAgents/com.prspares.crawl-cohort.plist）
#
# 为什么要每天跑：08-07 熔断判据要看的是「状态迁移」，只有首尾两个点看不出中间过程
# （比如某页哪天被抓、抓完几天后才进索引）。断档一天就少一个观测点。
#
# launchd 不继承登录 shell 环境，所以 PATH/HOME 必须显式设置。

export HOME=/Users/yangxiaobo
export PATH=/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin
export LANG=en_US.UTF-8

PROJ=/Users/yangxiaobo/Desktop/prspares-website
PY=/Users/yangxiaobo/.hermes/hermes-agent/venv/bin/python3
LOG="$PROJ/Analytics/cohort/_daily.log"

cd "$PROJ" || exit 1
mkdir -p "$PROJ/Analytics/cohort"

{
  echo "════════ $(date '+%Y-%m-%d %H:%M:%S') ════════"
  "$PY" Analytics/scripts/crawl_cohort.py --compare 2>&1
  echo "exit=$?"
  echo
} >> "$LOG" 2>&1

# 日志只留最近 2000 行，避免无限增长
if [ "$(wc -l < "$LOG")" -gt 2000 ]; then
  tail -1500 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi
