import type { Metadata } from "next";
import DayOfYearTool from "./DayOfYearTool";

export const metadata: Metadata = {
  title: "What Day of the Year Is It? | Dayblip",
  description: "Find out what day of the year it is today. See the year progress bar and how many days are left in the year.",
  keywords: ["what day of the year is it", "day of the year", "day number today", "how many days left in the year"],
};

export default function DayOfYearPage() {
  return <DayOfYearTool />;
}
