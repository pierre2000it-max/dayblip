import type { Metadata } from "next";
import RetirementCountdownTool from "./RetirementCountdownTool";
export const metadata: Metadata = {
  title: "Retirement Countdown Calculator",
  description: "Count down to your retirement date. Calculate exactly how many days until you retire and track your career progress.",
  keywords: ["retirement countdown", "days until retirement", "retirement calculator", "how many days until I retire", "retirement date calculator"],
  alternates: { canonical: "https://www.dayblip.com/retirement-countdown" },
  openGraph: {
    title: "Retirement Countdown Calculator",
    description: "Count down to your retirement date. Calculate exactly how many days until you retire and track your career progress.",
    type: "website",
    url: "https://www.dayblip.com/retirement-countdown",
    images: [{ url: "/api/og?title=Retirement+Countdown&emoji=💼&subtitle=Count+down+to+your+retirement+day", width: 1200, height: 630, alt: "Retirement Countdown" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Retirement Countdown Calculator",
    description: "Count down to your retirement date. Calculate exactly how many days until you retire and track your career progress.",
    images: ["/api/og?title=Retirement+Countdown&emoji=💼&subtitle=Count+down+to+your+retirement+day"],
  },
};
export default function RetirementCountdownPage() { return <RetirementCountdownTool />; }
