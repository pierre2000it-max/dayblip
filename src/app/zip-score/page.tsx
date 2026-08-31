import type { Metadata } from "next";
import ZipScoreTool from "./ZipScoreTool";

const TITLE = "Free ZIP Market Score — Is Your Business Idea Viable?";
const DESC =
  "Enter a business category and US ZIP code. Get a free market viability score band in seconds. Powered by Ziplicit.";

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
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function ZipScorePage() {
  return <ZipScoreTool />;
}
