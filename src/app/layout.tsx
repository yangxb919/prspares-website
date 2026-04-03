import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";


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
  title: "Wholesale Phone Repair Parts | iPhone Screens, Batteries & Tools — Factory Direct | PRSPARES",
  description: "Wholesale phone repair parts from Shenzhen: iPhone & Samsung screens from $19, batteries from $5, cameras, charging ports & repair tools. 500+ SKUs, MOQ 10 pcs, 12-month warranty. Factory-direct B2B supplier serving 1,000+ repair shops in 50+ countries.",
  keywords: "wholesale phone repair parts, iphone screen wholesale, phone parts supplier, wholesale phone screens, cell phone parts wholesale, phone repair parts wholesale, iphone battery wholesale, samsung screen wholesale, phone repair tools wholesale",
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Wholesale Phone Repair Parts — Screens, Batteries & Tools | PRSPARES",
    description: "Factory-direct phone repair parts: iPhone & Samsung screens from $19, batteries from $5. 500+ SKUs, 12-month warranty. B2B wholesale from Shenzhen.",
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
    title: "Wholesale Phone Repair Parts — Screens, Batteries & Tools | PRSPARES",
    description: "Factory-direct phone repair parts from Shenzhen. 500+ SKUs, MOQ 10 pcs, 12-month warranty. Serving 1,000+ repair shops worldwide.",
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
      "telephone": "+8618312589439",
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


      </body>
    </html>
  );
}
