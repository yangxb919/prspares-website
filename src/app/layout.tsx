import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteChrome";
import AttributionTracker from "@/components/AttributionTracker";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://www.phonerepairspares.com"
).replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Wholesale Phone Repair Parts Supplier | Factory Direct — PRSPARES",
  description: "Factory-direct wholesale phone repair parts from Shenzhen. OEM iPhone & Samsung screens, batteries, and tools for repair shops and distributors.",
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Wholesale Phone Repair Parts Supplier | Factory Direct — PRSPARES",
    description: "Factory-direct wholesale phone repair parts from Shenzhen. OEM iPhone & Samsung screens, batteries, and tools for repair shops and distributors.",
    type: "website",
    url: "/",
    siteName: "PRSPARES",
    images: [
      {
        url: "/PRSPARES1.png",
        width: 1200,
        height: 630,
        alt: "PRSPARES - Wholesale Phone Repair Parts Supplier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wholesale Phone Repair Parts Supplier | Factory Direct — PRSPARES",
    description: "Factory-direct wholesale phone repair parts from Shenzhen. OEM iPhone & Samsung screens, batteries, and tools for repair shops and distributors.",
    images: ["/PRSPARES1.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 🔴 这里以前调用 headers() 读 x-pathname 和 host。根 layout 一旦调用它，
  // App Router 会把整棵渲染树标记为动态渲染，全站静态生成与 ISR 同时失效
  // （2026-09-04 实测：构建产物静态路由 0 条，去掉后 72 条 + 2 条 ISR）。后果是全站响应
  // 3.4-3.9 秒、Google 按响应速度降低抓取频率、66 个页面从未被抓过。
  // 现在两个用途都改成不依赖请求头：
  //   · 页头页脚的显示判断 → 下沉到客户端组件 SiteChrome（usePathname）
  //   · GTM 的环境判断     → 改用下面的构建期环境变量

  // 只在真正的生产站点加载 GTM（它会带出 GA4 + Ads + Clarity），避免本地
  // 开发/预览流量污染统计（2026-06-02 曾有 localhost:3100 的会话漏进线上
  // Clarity）。两道闸：NODE_ENV 挡住 `next dev`；NEXT_PUBLIC_SITE_URL 挡住
  // 「在本地跑生产构建」——该变量只存在于 VPS 的 .env.production，本地没有。
  const analyticsEnabled =
    process.env.NODE_ENV === 'production' &&
    (process.env.NEXT_PUBLIC_SITE_URL || '').includes('phonerepairspares.com');

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    "name": "PRSPARES",
    "description": "Professional Mobile Phone Repair Parts Factory & OEM/ODM Manufacturer from Shenzhen Huaqiangbei",
    "url": SITE_URL,
    "logo": `${SITE_URL}/PRSPARES1.png`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Shenzhen",
      "addressRegion": "Guangdong",
      "addressCountry": "CN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+8618312589439",
      "contactType": "customer service",
      "availableLanguage": ["English", "Chinese"]
    },
    // TODO(P1): populate with real PRSPARES social profile URLs (LinkedIn, YouTube, etc.)
    "sameAs": []
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    "name": "PRSPARES",
    "url": SITE_URL,
    "description": "Factory-direct wholesale phone repair parts from Shenzhen — OEM iPhone & Samsung screens, batteries, and tools for repair shops and distributors.",
    "inLanguage": "en",
    "publisher": { "@id": `${SITE_URL}/#organization` }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema])
          }}
        />
      </head>
      {analyticsEnabled && <GoogleTagManager gtmId="GTM-TTBMN854" />}
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <AttributionTracker />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
