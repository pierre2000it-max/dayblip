import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generateOrganizationSchema } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const BASE = "https://dayblip.com";
const DEFAULT_DESCRIPTION =
  "Free countdown timers, date calculators and curiosity tools. Find out how many days until any event, what happened on your birthday, and more.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    template: "%s | Dayblip",
    default: "Dayblip | Countdown & Date Tools",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "countdown timer",
    "days until christmas",
    "age calculator",
    "date calculator",
    "how many days until",
  ],
  openGraph: {
    type: "website",
    siteName: "Dayblip",
    title: "Dayblip | Countdown & Date Tools",
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "Dayblip — Countdown & Date Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dayblip",
    title: "Dayblip | Countdown & Date Tools",
    description: "Free countdown timers and date calculators",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "placeholder-will-add-later",
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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
