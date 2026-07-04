import type { Metadata } from "next";
import LifeProgressTool from "./LifeProgressTool";

export const metadata: Metadata = {
  title: "Life Progress Bar — How Far Through Life Are You?",
  description: "See your life as a progress bar. Find out what percentage of your life you have lived and how many days you have remaining.",
  keywords: ["life progress bar", "how far through life am I", "days alive", "life percentage"],
  alternates: { canonical: "https://www.dayblip.com/life-progress" },
  openGraph: {
    title: "Life Progress Bar — How Far Through Life Are You?",
    description: "See your life as a progress bar. Find out what percentage of your life you have lived and how many days you have remaining.",
    type: "website",
    url: "https://www.dayblip.com/life-progress",
    images: [{ url: "/api/og?title=Life+Progress+Bar&emoji=📊&subtitle=See+what+%25+of+your+life+you%27ve+lived", width: 1200, height: 630, alt: "Life Progress Bar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Progress Bar — How Far Through Life Are You?",
    description: "See your life as a progress bar. Find out what percentage of your life you have lived and how many days you have remaining.",
    images: ["/api/og?title=Life+Progress+Bar&emoji=📊&subtitle=See+what+%25+of+your+life+you%27ve+lived"],
  },
};

export default function LifeProgressPage() {
  return <LifeProgressTool />;
}
