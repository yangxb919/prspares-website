import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { headers } from "next/headers";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AttributionTracker from "@/components/AttributionTracker";

// Route-prefix-based locale for SEA landing pages (plan A MVP).
// Keeps the site's single-root-layout architecture while giving /id and /th:
//   - correct <html lang> for accessibility + SEO
//   - a "naked" layout without English Header/Footer (so SEA ad traffic
//     cannot click their way back into the English site)
function localeForPath(pathname: string): { lang: string; chrome: boolean } {
  if (pathname.startsWith('/id/')) return { lang: 'id', chrome: false };
  if (pathname.startsWith('/th/')) return { lang: 'th', chrome: false };
  return { lang: 'en', chrome: true };
}


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
  const pathname = headers().get('x-pathname') || '/';
  const { lang, chrome } = localeForPath(pathname);

  // Only load GTM (which loads GA4 + Ads + Clarity) on the real production
  // host. This prevents local dev / preview traffic from polluting analytics —
  // e.g. localhost:3100 sessions were leaking into the production Clarity
  // project (2026-06-02). Gate on BOTH NODE_ENV (blocks `next dev`) and the
  // request host (blocks a production build run locally, where NODE_ENV=production).
  const host = (headers().get('host') || '').toLowerCase();
  const isLocalHost =
    host.startsWith('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('0.0.0.0') ||
    host.startsWith('[::1]') ||
    host.endsWith('.local');
  const analyticsEnabled = process.env.NODE_ENV === 'production' && !isLocalHost;

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
    <html lang={lang}>
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
        {chrome && <Header />}
        {children}
        {chrome && <Footer />}
      </body>
    </html>
  );
}
