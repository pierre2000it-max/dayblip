import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generateOrganizationSchema } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const BASE = "https://www.dayblip.com";
const DEFAULT_DESCRIPTION =
  "120+ free tools for life, money, history and more. Finance calculators, countdown timers, birthday tools, live world counters and much more. No signup. No email. Ever.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  alternates: { canonical: "/" },
  title: {
    template: "%s | Dayblip",
    default: "Dayblip — Free Tools for Curious Minds",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "free tools",
    "finance calculator",
    "countdown timer",
    "birthday calculator",
    "salary calculator",
    "mortgage calculator",
    "life tools",
    "history facts",
    "date calculator",
    "curiosity tools",
  ],
  openGraph: {
    type: "website",
    siteName: "Dayblip",
    title: "Dayblip — Free Tools for Curious Minds",
    description: "120+ free tools for life, money, history and more. No signup ever.",
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "Dayblip — Free Tools for Curious Minds" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dayblip",
    title: "Dayblip — Free Tools for Curious Minds",
    description: "120+ free tools for life, money, history and more. No signup ever.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "XPU0b15l1TCe4pDxqg18LsAHwCPr4gJny3kZGd5pwdQ",
  },
};

const orgSchema = generateOrganizationSchema();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8231179871551744"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
