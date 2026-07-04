import type { Metadata } from "next";
import ThisWeekInHistoryTool from "./ThisWeekInHistoryTool";
export const metadata: Metadata = {
  title: "This Week in History",
  description: "Discover major historical events that happened this week throughout history. Updated every week.",
  keywords: ["this week in history", "what happened this week in history", "historical events this week"],
  alternates: { canonical: "https://www.dayblip.com/this-week-in-history" },
};
export default function ThisWeekInHistoryPage() { return <ThisWeekInHistoryTool />; }
