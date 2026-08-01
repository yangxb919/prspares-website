# 定时任务（launchd）

`com.prspares.crawl-cohort.plist` 是 `~/Library/LaunchAgents/` 下同名文件的副本，**仅供追溯**。
改动要改真身再复制回来，或 `cp ops/launchd/*.plist ~/Library/LaunchAgents/ && launchctl unload/load`。

## crawl-cohort：每天 20:30 跑 20 URL 抓取快照

链路：

```
launchd (20:30)
  └─ ~/.local/bin/prspares-cohort-daily.sh        ← 跳板，只有一行 exec
       └─ Analytics/scripts/cohort_daily.sh        ← 真正的逻辑（随 git 走）
            └─ Analytics/scripts/crawl_cohort.py --compare
                 └─ Analytics/cohort/YYYY-MM-DD.json + _daily.log
```

### 🔴 为什么要多一层跳板（macOS TCC）

launchd **直接执行 `~/Desktop` 下的脚本会被拒绝**：

```
/bin/bash: .../Analytics/scripts/cohort_daily.sh: Operation not permitted
```

这是 macOS 的 TCC 隐私保护 —— Desktop/Documents/Downloads 都是受保护目录，launchd 启动的
进程没有完全磁盘访问权限就不能执行里面的文件。

但**从非受保护目录启动的进程，可以正常读写 Desktop 下的文件**。所以解法是把入口放在
`~/.local/bin/`，逻辑仍留在项目里。这样既绕开 TCC，又不必给 `/bin/bash` 授予完全磁盘访问
（那个授权范围过大）。

⚠️ 跳板脚本里**不要复制逻辑**，只保留一行 `exec`，否则两份脚本会不同步。

### 为什么用 launchd 而不是 cron

机器睡眠或关机错过执行时间后，launchd 会在下次唤醒时**补跑一次**，cron 直接跳过。
这个任务断档一天就少一个观测点，08-07 复盘时会看不出中间过程（某页哪天被抓、抓完几天才进索引）。

### 运维

```bash
launchctl list | grep crawl-cohort          # 确认已加载
launchctl start com.prspares.crawl-cohort   # 手动触发一次
tail -40 Analytics/cohort/_daily.log        # 看执行结果
cat Analytics/cohort/_launchd.err           # 看启动层错误（TCC/路径问题会出现在这里）
launchctl unload ~/Library/LaunchAgents/com.prspares.crawl-cohort.plist   # 停用
```

### 已知失败模式

- **GSC token 每 7 天过期**（OAuth 应用处于 Testing 态）。脚本已容错：认证失败时降级为
  「仅日志」快照并在日志里标 🔴，不会整次失败。修复方式是跑一次 `gsc_fetch.py` 走浏览器授权。
- `_launchd.err` 非空通常意味着**启动层**问题（路径、权限），而不是脚本逻辑问题。
