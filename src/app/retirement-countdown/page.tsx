import type { Metadata } from "next";
import RetirementCountdownTool from "./RetirementCountdownTool";
export const metadata: Metadata = {
  title: "Retirement Countdown Calculator",
  description: "Count down to your retirement date. Calculate exactly how many days until you retire and track your career progress.",
  keywords: ["retirement countdown", "days until retirement", "retirement calculator", "how many days until I retire", "retirement date calculator"],
  alternates: { canonical: "https://www.dayblip.com/retirement-countdown" },
};
export default function RetirementCountdownPage() { return <RetirementCountdownTool />; }
