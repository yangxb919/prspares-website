import type { Metadata } from 'next';

const metaTitle = 'Wholesale iPhone Samsung Screens LCD/OLED | PRSPARES';
const metaDescription =
  'Wholesale iPhone and Samsung LCD/OLED screens from Shenzhen. MOQ 10 pcs, grade options, batch QC, warranty support and fast quote for shops worldwide.';

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  keywords: 'wholesale phone screens, iPhone screen wholesale, bulk iPhone screens, cell phone screen wholesale, wholesale iPhone LCD, phone LCD wholesale, iPhone replacement screen wholesale, cell phone parts wholesale',
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    type: 'website',
    url: '/products/screens',
    images: [
      {
        url: '/PRSPARES1.png',
        width: 1200,
        height: 630,
        alt: 'Wholesale Phone Screens - PRSPARES',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: metaTitle,
    description: metaDescription,
    images: ['/PRSPARES1.png'],
  },
  alternates: {
    canonical: '/products/screens',
  },
};

export default function ScreensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Product schema 由 WholesaleScreenTable 从真实 catalog 计算输出（唯一一份）。
  // 此处曾有两个硬编码 Product+AggregateOffer（iPhone $19-339 / Samsung $35-290），
  // 数字无来源且与表格 schema 矛盾，2026-07-15 schema 审计（Phase 0.8）移除。
  // FAQ/Breadcrumb schema 在 page.tsx（2026-07-19 移出）：layout 会级联到
  // /products/screens/gx|jk 品牌子页，放这里会让子页出现两套 FAQPage/BreadcrumbList。
  return <>{children}</>;
}
