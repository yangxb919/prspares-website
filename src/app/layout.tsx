import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import N8NChat from "@/components/N8NChat";

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
  title: "Mobile Phone Repair Parts Factory & Wholesale Supplier | OEM·ODM Manufacturer – PRSPARES",
  description: "PRSPARES is a 10-year mobile phone parts manufacturer from Shenzhen Huaqiangbei, providing iPhone/Android screens, batteries, cameras OEM • ODM wholesale, global shipping, sufficient stock, 12-month warranty.",
  keywords: "mobile phone repair parts, iPhone parts, Samsung parts, Android parts, OEM manufacturer, ODM supplier, wholesale, Shenzhen Huaqiangbei, screen replacement, battery, camera module",
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Mobile Phone Repair Parts Factory & Wholesale Supplier | PRSPARES",
    description: "PRSPARES is a 10-year mobile phone parts manufacturer from Shenzhen Huaqiangbei, providing iPhone/Android screens, batteries, cameras OEM • ODM wholesale.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/PRSPARES1.png",
        width: 1200,
        height: 630,
        alt: "PRSPARES - Mobile Phone Repair Parts Factory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mobile Phone Repair Parts Factory & Wholesale Supplier | PRSPARES",
    description: "PRSPARES is a 10-year mobile phone parts manufacturer from Shenzhen Huaqiangbei, providing iPhone/Android screens, batteries, cameras OEM • ODM wholesale.",
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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
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
      "telephone": "+8618588999234",
      "contactType": "customer service",
      "availableLanguage": ["English", "Chinese"]
    },
    "sameAs": []
  };

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TTBMN854');`
          }}
        />
        {/* End Google Tag Manager */}

        {/* Google tag (gtag.js) — GA4 + Google Ads */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GT-TQS9VZ7Z" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','GT-TQS9VZ7Z');gtag('config','AW-1000630085');`
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />


      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TTBMN854"
            height="0"
            width="0"
            style={{display:'none',visibility:'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <Header />
        {children}
        <Footer />

        {/* N8N Chat - Intelligent Customer Service */}
        <N8NChat />
      </body>
    </html>
  );
}
