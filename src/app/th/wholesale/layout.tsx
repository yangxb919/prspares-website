import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-thai',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'อะไหล่มือถือราคาส่ง ตรงจากโรงงานเซินเจิ้น | PRSPARES',
  description:
    'อะไหล่มือถือราคาส่ง ตรงจากโรงงานเซินเจิ้น คุณภาพ OEM ลดต้นทุน 30-40% เพราะไม่ผ่านคนกลาง MOQ เริ่ม 10 ชิ้น รับประกัน 12 เดือน สำหรับช่าง ร้านมือถือ และผู้นำเข้ากว่า 1,000 ราย',
  keywords:
    'ขายส่งอะไหล่มือถือ, อะไหล่มือถือราคาส่ง, ขายส่งจอมือถือ, ขายส่งแบตเตอรี่มือถือ, จอไอโฟนราคาส่ง, อะไหล่มือถือโรงงาน',
  alternates: {
    canonical: '/th/wholesale',
    languages: {
      'en': '/wholesale-inquiry',
      'id-ID': '/id/wholesale',
      'th-TH': '/th/wholesale',
      'x-default': '/wholesale-inquiry',
    },
  },
  openGraph: {
    title: 'อะไหล่มือถือราคาส่ง ตรงจากโรงงานเซินเจิ้น | PRSPARES',
    description:
      'อะไหล่มือถือราคาส่ง ตรงจากโรงงานเซินเจิ้น ลดต้นทุน 30-40% MOQ เริ่ม 10 ชิ้น รับประกัน 12 เดือน',
    type: 'website',
    url: '/th/wholesale',
    locale: 'th_TH',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'อะไหล่มือถือราคาส่ง ตรงจากโรงงานเซินเจิ้น | PRSPARES',
    description: 'อะไหล่มือถือราคาส่ง ตรงจากโรงงานเซินเจิ้น ลดต้นทุน 30-40%',
    images: ['/PRSPARES1.png'],
  },
};

export default function ThWholesaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={notoSansThai.variable} style={{ fontFamily: 'var(--font-noto-thai), ui-sans-serif, system-ui' }}>{children}</div>;
}
