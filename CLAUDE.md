# Changelog 操作日志规则

每次完成用户交给的任务后，必须自动将本次操作总结保存到 `changelogs/` 文件夹中。

## 规则
- 文件命名：`YYYY-MM-DD.md`（按当天日期），如果当天文件已存在则追加内容
- 每条记录包含：
  - 时间
  - 操作类型（新增 / 修改 / 删除 / 配置 / 修复）
  - 涉及的文件路径
  - 变更说明（简要描述做了什么）
- 使用中文记录
- 这是强制要求，不可跳过

# 按需读取的指引

- 营销 / SEO / GEO / 内容任务：先读 `.agents/product-marketing.md`（PRSPARES 真实 B2B 定位），产出必须基于其中事实和真实数据。
- Google Ads API（凭据位置 / 调用方式 / GAQL 模板）：见 `docs/google-ads-api.md`。
- UI / 前端设计任务：用 `superdesign` 技能（`.claude/skills/superdesign/`）。


# Herdr PRSPARES 项目资料试点

仅当作为 Herdr 的 Main 工作时，启动先读 `项目资料/业务背景.md` 和 `项目资料/使用说明.md`；以任务卡保存已授权任务，在关键进展和结束前通过 `herdr-team memory checkpoint` 保存并核验。Agy / Image Maker 只交回结果，由 Main 核查归档。待办不等于执行授权，启动只展示接续摘要。用户要求分析、规划、只读或不写文件时，不写项目资料，也不因本文件的日志规则强行写入。其他会话和项目不自动启用试点。
