import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
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
      "telephone": "+8618312589439",
      "contactType": "customer service",
      "availableLanguage": ["English", "Chinese"]
    },
    "sameAs": []
  };

  return (
    <html lang={lang}>
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

        {chrome && <Header />}
        {children}
        {chrome && <Footer />}


      </body>
    </html>
  );
}
