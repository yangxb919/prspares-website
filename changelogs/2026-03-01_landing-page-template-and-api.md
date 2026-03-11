# 2026-03-01 着陆页模板系统与 API 端点搭建

## 概述

为 PRSPARES Google Ads 广告投放创建了一套完整的静态着陆页工作流，包括专用 API 端点、可复用 HTML 模板、以及素材资源部署。

---

## 一、Google Ads 着陆页审阅与建议

### 审阅文件
- `phone repair parts/index.html` — 静态着陆页（Modern Industrial Minimalist 设计风格）
- `phone repair parts/google_ads_plan.md` — B2B Google Ads 投放计划（$50/天预算）
- `phone repair parts/ads_measurement_guide.md` — 广告效果衡量指南
- `手机维修零件出口市场分析报告.md` — 出口市场分析

### 主要建议
- 着陆页表单仅有 Name + Email 两个字段，建议保持简洁但需要接入真实后端
- Google Ads 计划中关键词策略合理（仅使用 exact/phrase match），建议前 2 周用 Maximize Clicks，积累 5-10 个询盘后切换 Maximize Conversions
- 健康的 B2B CPA 基准：$25-$60/询盘

---

## 二、视频压缩处理

### 操作类型：新增

### 处理方式
使用 FFmpeg 对 5 个产品/仓库视频进行压缩：
- 编码：H.264, CRF 32-33
- 分辨率：320-360px 宽度
- 音频：全部移除（`-an` 标志）
- 时长：Hero 视频限制为 12 秒

### 压缩结果

| 文件 | 原始大小 | 压缩后 | 压缩率 |
|------|---------|--------|--------|
| vid_01.mp4 | 1.7MB | 327KB | 81% |
| vid_02.mp4 | 2.7MB | 509KB | 81% |
| vid_03.mp4 | 1.6MB | 132KB | 92% |
| vid_04.mp4 (Hero) | 3.6MB | 543KB | 85% |
| vid_05.mp4 | 2.8MB | 448KB | 84% |
| **总计** | **13MB** | **2MB** | **84%** |

### 额外生成
- 3 张 poster 静态帧：`vid_02_poster.jpg`、`vid_03_poster.jpg`、`vid_05_poster.jpg`
- WebM 格式测试后放弃（VP9 编码反而比 MP4 大 38-49%）

---

## 三、网站集成方案分析

### 现有网站架构
- Next.js 14 (App Router) + Tailwind CSS + TypeScript
- 已有 `/wholesale-inquiry` React 页面（完整表单 + Supabase + 邮件通知）
- GTM 已集成：`GTM-TTBMN854`
- Supabase 数据库存储 RFQ 询盘
- 邮件通知 API：`/api/send-rfq-email`（原生 SMTP）

### 确定方案
- 静态着陆页放入 `public/lp/` 目录
- 创建专用 API 端点给静态页面调用
- 复用现有 GTM 代码和邮件通知机制

---

## 四、创建着陆页专用 API

### 操作类型：新增
### 涉及文件：`src/app/api/lp-inquiry/route.ts`

### 功能说明
- 接受 POST 请求，字段：name、email、company、phone、productInterest、message、source、pageUrl
- 数据写入 Supabase `rfqs` 表（使用 server client）
- 内部调用 `/api/send-rfq-email` 发送邮件通知
- 邮件发送到与现有网站表单相同的邮箱地址（`SMTP_TEST_TO` / `SMTP_USER`）
- Supabase 写入失败不影响邮件发送（容错设计）

---

## 五、创建可复用着陆页 HTML 模板

### 操作类型：新增
### 涉及文件：`public/lp/_template.html`

### 模板特性
- **GTM 集成**：`GTM-TTBMN854`（含 `<noscript>` 兼容）
- **表单提交**：POST → `/api/lp-inquiry` → Supabase + 邮件通知
- **GA4 转化追踪**：提交成功后自动推送 `generate_lead` 事件到 dataLayer
- **响应式设计**：Tailwind CSS CDN + Inter 字体 + Lucide 图标
- **配置化**：顶部 `LP_CONFIG` 对象，每个新页面只需修改几行

### LP_CONFIG 配置项
```javascript
const LP_CONFIG = {
    title: "页面标题",
    description: "页面描述",
    source: "campaign-identifier",  // 广告来源标识
    whatsapp: "8618588999234",
    apiEndpoint: "/api/lp-inquiry",
    robots: "noindex, nofollow",
};
```

### 页面结构
1. 固定导航栏（玻璃态效果）
2. Hero 区域（视频 autoplay + 文案 + CTA）
3. Why Us 四宫格卡片
4. 产品库存 Tab 切换（Screens / Batteries / Cameras）
5. 仓库实拍视频/图片网格
6. WhatsApp 聊天截图社交证明
7. 底部询盘表单（pill 形状设计）
8. Footer

---

## 六、素材部署

### 操作类型：新增
### 涉及文件：`public/images/wholesale/` （22 个文件）

### 文件清单
- 5 个压缩 MP4 视频：`vid_01.mp4` ~ `vid_05.mp4`
- 3 张视频 poster：`vid_02_poster.jpg`、`vid_03_poster.jpg`、`vid_05_poster.jpg`
- 11 张产品图片：`img_02.jpg` ~ `img_30.jpg`
- 3 张 WhatsApp 截图：`whatsapp_chat_*.png`

---

## 七、以后的着陆页工作流

```
1. 复制 public/lp/_template.html → public/lp/your-campaign.html
2. 修改顶部 LP_CONFIG（title, description, source）
3. 替换图片/视频/文案内容
4. git push 部署
5. 访问 https://www.phonerepairspares.com/lp/your-campaign.html
```

---

## 变更文件清单

| 操作 | 文件路径 |
|------|---------|
| 新增 | `src/app/api/lp-inquiry/route.ts` |
| 新增 | `public/lp/_template.html` |
| 新增 | `public/images/wholesale/` （22 个素材文件） |

## 待办事项

- [ ] 将 `/wholesale-inquiry` React 页面的视觉风格改为与静态模板一致
- [ ] 部署后测试 `/api/lp-inquiry` 端点是否正常工作
- [ ] 在 GTM 中配置 `generate_lead` 事件作为 Google Ads 转化目标
- [ ] 用模板创建第一个正式着陆页并设置 Google Ads 广告组指向
