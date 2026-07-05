import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generateOrganizationSchema } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const BASE = "https://www.dayblip.com";
const DEFAULT_DESCRIPTION =
  "Dayblip — 300+ free interactive calculators for personal finance, career decisions, life in weeks, born in year facts and more. No signup. No email. Free forever.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  alternates: { canonical: "https://www.dayblip.com/" },
  title: {
    template: "%s",
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
    description: "300+ free tools for life, money, history and more. No signup. No email. Ever.",
    url: "https://www.dayblip.com",
    images: [{ url: "https://www.dayblip.com/api/og?title=Free+Tools+for+Curious+Minds&emoji=🧮&subtitle=No+signup.+No+email.+Free+forever.", width: 1200, height: 630, alt: "Dayblip — Free Tools for Curious Minds" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dayblip365",
    creator: "@dayblip365",
    title: "Dayblip — Free Tools for Curious Minds",
    description: "300+ free tools for life, money, history and more. No signup. No email. Ever.",
    images: ["https://www.dayblip.com/api/og?title=Free+Tools+for+Curious+Minds&emoji=🧮&subtitle=No+signup.+No+email.+Free+forever."],
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

export const viewport: Viewport = {
  themeColor: "#0d1b2a",
  colorScheme: "dark",
};

const orgSchema = generateOrganizationSchema();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Resource hints — reduce connection latency for external assets */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
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
