'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

// 东南亚落地页（/id/*、/th/*）自带完整版式，不套全站页头页脚。
//
// 🔴 这个判断为什么放在客户端组件里，而不是在根 layout 读 headers()：
// 根 layout 一旦调用 headers()，App Router 会把整棵渲染树标记为动态渲染，
// 全站的静态生成和 ISR 会同时失效 —— 2026-09-04 实测，构建产物里的静态页
// 数量因此是 0（去掉后是 72 条静态 + 2 条 ISR）。代价是全站响应 3.4-3.9 秒、Google 按响应
// 速度降低抓取频率、66 个页面从来没被抓过。为两个页面的版式付这个代价不值。
//
// usePathname 是客户端 hook，不触发动态渲染；服务端预渲染每个路径时也能拿到
// 正确的 pathname，所以静态 HTML 里就已经是正确结果，不会出现先显示再消失。
const NO_CHROME_PREFIXES = ['/id/', '/th/'];

function hideChrome(pathname: string | null): boolean {
  const p = pathname || '/';
  return NO_CHROME_PREFIXES.some((prefix) => p.startsWith(prefix));
}

export function SiteHeader() {
  return hideChrome(usePathname()) ? null : <Header />;
}

export function SiteFooter() {
  return hideChrome(usePathname()) ? null : <Footer />;
}

// <html lang> 必须在根 layout 上静态给出，否则又要读 headers()。
// 根 layout 固定 lang="en"，这两个落地页在客户端修正为自己的语言 ——
// 对屏幕阅读器有效；搜索引擎判断语言主要靠 hreflang（已在各自 layout 的
// metadata.alternates.languages 里正确声明）和正文本身，不依赖这个属性。
export function SetHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const prev = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = prev;
    };
  }, [lang]);
  return null;
}
