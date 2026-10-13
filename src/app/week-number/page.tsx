import type { Metadata } from "next";
import WeekNumberTool from "./WeekNumberTool";
export const metadata: Metadata = {
  title: "What Week Number Is It?",
  description: "Find out what week number it is today and the week number for any date, with year progress and a quarter tracker. Free — no signup required.",
  keywords: ["what week number is it", "week number today", "current week number", "week of the year calculator"],
  alternates: { canonical: "https://www.dayblip.com/week-number" },
};
export default function WeekNumberPage() { return <WeekNumberTool />; }
