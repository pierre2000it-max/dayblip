import type { Metadata } from "next";
import DayOfYearTool from "./DayOfYearTool";

export const metadata: Metadata = {
  title: "What Day of the Year Is It?",
  description: "Find out what day of the year it is today, with a year progress bar and the number of days left in the year. Free — no signup required.",
  keywords: ["what day of the year is it", "day of the year", "day number today", "how many days left in the year"],
  alternates: { canonical: "https://www.dayblip.com/day-of-year" },
};

export default function DayOfYearPage() {
  return <DayOfYearTool />;
}
