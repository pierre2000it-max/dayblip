import type { Metadata } from "next";
import DateCalculatorTool from "./DateCalculatorTool";

export const metadata: Metadata = {
  title: "Date Calculator — Add or Subtract Days",
  description:
    "Free date calculator. Add or subtract days, weeks, months or years from any date. Find the difference between two dates instantly.",
  keywords: [
    "date calculator",
    "add days to date",
    "days between dates",
    "what date is 90 days from today",
  ],
};

export default function DateCalculatorPage() {
  return <DateCalculatorTool />;
}
