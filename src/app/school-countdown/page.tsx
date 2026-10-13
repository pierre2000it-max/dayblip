import type { Metadata } from "next";
import SchoolCountdownTool from "./SchoolCountdownTool";
export const metadata: Metadata = {
  title: "School Countdown — Days Until Summer Break",
  description: "Count down to summer break, back to school, or graduation. A school countdown calculator for students and parents. Free — no signup required.",
  keywords: ["days until summer break", "school countdown", "back to school countdown", "graduation countdown", "days until summer vacation"],
  alternates: { canonical: "https://www.dayblip.com/school-countdown" },
};
export default function SchoolCountdownPage() { return <SchoolCountdownTool />; }
