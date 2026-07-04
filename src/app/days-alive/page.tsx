import type { Metadata } from "next";
import DaysAliveTool from "./DaysAliveTool";

export const metadata: Metadata = {
  title: "Days Alive Calculator — How Many Days Old Are You?",
  description: "Find out exactly how many days old you are today. See when you hit milestones like 10,000 days alive and what date your next milestone falls on. Free.",
  keywords: ["how many days old am I", "days alive", "10000 days old", "days alive calculator"],
  alternates: { canonical: "https://www.dayblip.com/days-alive" },
  openGraph: {
    title: "Days Alive Calculator — How Many Days Old Are You?",
    description: "Find out exactly how many days old you are today. See when you hit milestones like 10,000 days alive and what date your next milestone falls on. Free.",
    type: "website",
    url: "https://www.dayblip.com/days-alive",
    images: [{ url: "/api/og?title=Days+Alive+Calculator&emoji=🎯&subtitle=Find+your+exact+day+milestones", width: 1200, height: 630, alt: "Days Alive Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Days Alive Calculator — How Many Days Old Are You?",
    description: "Find out exactly how many days old you are today. See when you hit milestones like 10,000 days alive and what date your next milestone falls on. Free.",
    images: ["/api/og?title=Days+Alive+Calculator&emoji=🎯&subtitle=Find+your+exact+day+milestones"],
  },
};

export default function DaysAlivePage() {
  return <DaysAliveTool />;
}
