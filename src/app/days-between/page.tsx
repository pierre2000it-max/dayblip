import type { Metadata } from "next";
import DaysBetweenTool from "./DaysBetweenTool";

export const metadata: Metadata = {
  title: "Days Between Dates Calculator",
  description:
    "Calculate the exact number of days between any two dates. Find weekdays, weekends, weeks and months between dates instantly.",
  keywords: [
    "days between dates",
    "days between two dates calculator",
    "how many days between dates",
  ],
};

export default function DaysBetweenPage() {
  return <DaysBetweenTool />;
}
