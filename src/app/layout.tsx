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
  title: "PRSPARES - Excellence in Mobile Repair Parts",
  description: "Leading supplier of high-quality mobile repair parts and OEM components in Shenzhen Huaqiangbei",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
