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
  description: "PRSPARES 是深圳华强北 10 年手机配件制造商，提供 iPhone/Android 屏幕、电池、摄像头等 OEM • ODM 批发，全球发货，库存充足，质保 12 个月。",
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
    "logo": "https://prspares.com/PRSPARES1.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Shenzhen",
      "addressRegion": "Guangdong",
      "addressCountry": "CN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+86-xxx-xxxx-xxxx",
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

        {/* N8N Chat - 智能客服聊天功能 */}
        <N8NChat />
      </body>
    </html>
  );
}
