'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import type { BlogCtaContext } from '@/lib/blog-cta-context';
import { wholesaleInquiryHref } from '@/lib/blog-cta-context';

/**
 * Blog 转化 CTA 套件 — 腿1（转化漏桶）。
 * 三种形态共用同一上下文（ctx），均带 GA4 埋点 (quote_cta_click + event_label 区分位置)。
 *
 * 背景：Clarity 显示 blog 平均滚动深度仅 ~37%，唯一 CTA 在底部没人看到；
 *       ~78% 移动流量但无常驻 CTA；ChatGPT 已能把真人带到站点但 begin_form=0。
 */

function track(label: string, product: string) {
  trackEvent('quote_cta_click', { event_label: label, product: product || '(generic)' });
}

/** ① 正文中段内联 CTA 卡（catch <40% 滚动区，移动+桌面都吃到） */
export function BlogInlineCTA({ ctx }: { ctx: BlogCtaContext }) {
  return (
    <div className="my-10 rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-sm not-prose">
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{ctx.headline}</h3>
      <p className="text-gray-600 mb-4 text-[15px] leading-relaxed">{ctx.sub}</p>
      <Link
        href={wholesaleInquiryHref(ctx.product)}
        onClick={() => track('Blog Inline CTA', ctx.product)}
        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow"
      >
        Get Wholesale Quote
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}

/** ② 移动端 sticky 底部条（覆盖 ~78% 移动流量，全程可见，可关闭） */
export function BlogStickyCTA({ ctx }: { ctx: BlogCtaContext }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0f2440]/97 backdrop-blur border-t border-white/10 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.25)]">
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">{ctx.headline}</p>
        <p className="text-blue-200 text-xs truncate">Factory-direct • 12-month warranty</p>
      </div>
      <Link
        href={wholesaleInquiryHref(ctx.product)}
        onClick={() => track('Blog Sticky CTA', ctx.product)}
        className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-2.5 px-4 rounded-lg transition-colors"
      >
        Get Quote
      </Link>
      <button
        aria-label="Dismiss"
        onClick={() => setDismissed(true)}
        className="shrink-0 text-white/50 hover:text-white/80 p-1"
      >
        <X size={16} />
      </button>
    </div>
  );
}

/** ③ 桌面 sticky 侧栏卡（放 TOC 下方，桌面读者全程可见） */
export function BlogSidebarCTA({ ctx }: { ctx: BlogCtaContext }) {
  return (
    <div className="hidden lg:block rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] p-5 shadow-md">
      <h3 className="text-white font-bold text-base mb-2 leading-snug">{ctx.headline}</h3>
      <p className="text-blue-200 text-sm mb-4 leading-relaxed">{ctx.sub}</p>
      <Link
        href={wholesaleInquiryHref(ctx.product)}
        onClick={() => track('Blog Sidebar CTA', ctx.product)}
        className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm"
      >
        Get Wholesale Quote
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
