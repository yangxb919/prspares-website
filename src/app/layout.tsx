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

export const metadata: Metadata = {
  title: "Mobile Phone Repair Parts Factory & Wholesale Supplier | OEM·ODM Manufacturer – PRSPARES",
  description: "PRSPARES is a 10-year mobile phone parts manufacturer from Shenzhen Huaqiangbei, providing iPhone/Android screens, batteries, cameras OEM • ODM wholesale, global shipping, sufficient stock, 12-month warranty.",
  keywords: "mobile phone repair parts, iPhone parts, Samsung parts, Android parts, OEM manufacturer, ODM supplier, wholesale, Shenzhen Huaqiangbei, screen replacement, battery, camera module",
  icons: {
    icon: [
      { url: '/favicon .png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon .png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/favicon .png',
    apple: '/favicon .png',
  },
  openGraph: {
    title: "Mobile Phone Repair Parts Factory & Wholesale Supplier | PRSPARES",
    description: "PRSPARES is a 10-year mobile phone parts manufacturer from Shenzhen Huaqiangbei, providing iPhone/Android screens, batteries, cameras OEM • ODM wholesale.",
    type: "website",
    url: "https://prspares.com",
    images: [
      {
        url: "https://prspares.com/PRSPARES1 .png",
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
    images: ["https://prspares.com/PRSPARES1 .png"],
  },
  alternates: {
    canonical: "https://prspares.com",
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
    "url": "https://prspares.com",
    "logo": "https://prspares.com/PRSPARES1 .png",
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
    "sameAs": [
      "https://github.com/yangxb919/moldall-website"
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Mobile Phone Repair Parts",
    "description": "OEM Quality Cell Phone Replacement Parts - iPhone LCD Screen, Samsung Battery, Android Smartphone Components",
    "brand": {
      "@type": "Brand",
      "name": "PRSPARES"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "PRSPARES"
    },
    "category": "Mobile Phone Parts",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema)
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />

        {/* N8N Chat - Intelligent Customer Service */}
        <N8NChat />
      </body>
    </html>
  );
}
