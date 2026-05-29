import type { Metadata } from "next";
import WeekNumberTool from "./WeekNumberTool";
export const metadata: Metadata = {
  title: "What Week Number Is It? | Dayblip",
  description: "Find out what week number it is today and the week number for any date. Includes year progress and quarter tracker.",
  keywords: ["what week number is it", "week number today", "current week number", "week of the year calculator"],
};
export default function WeekNumberPage() { return <WeekNumberTool />; }
