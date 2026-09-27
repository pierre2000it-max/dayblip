import type { Metadata } from "next";
import ZipScoreTool from "./ZipScoreTool";

const TITLE = "Free ZIP Market Score — Is Your Business Idea Viable?";
const DESC =
  "Enter a business category and US ZIP code. Get a free market viability score band in seconds. Powered by Ziplicit.";

const OG_IMAGE =
  "https://www.dayblip.com/api/og?title=Free+ZIP+Market+Score&emoji=%F0%9F%93%8A&subtitle=Is+Your+ZIP+a+Winner%3F";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "market viability score",
    "local business score",
    "ZIP code market analysis",
    "business viability checker",
  ],
  alternates: { canonical: "/zip-score" },
  openGraph: {
    title: TITLE,
    description: DESC,
    type: "website",
    url: "/zip-score",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [OG_IMAGE],
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ZIP Market Score Tool",
  url: "https://www.dayblip.com/zip-score",
  description: DESC,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function ZipScorePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <ZipScoreTool />
    </>
  );
}
