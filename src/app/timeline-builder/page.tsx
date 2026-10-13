import type { Metadata } from "next";
import TimelineBuilderTool from "./TimelineBuilderTool";
export const metadata: Metadata = {
  title: "Timeline Builder — History Ordering Game",
  description: "Put historical events in chronological order in this history game and test when things happened. Free timeline builder — no signup required.",
  keywords: ["timeline game", "history ordering game", "chronological order quiz", "history timeline builder"],
  alternates: { canonical: "https://www.dayblip.com/timeline-builder" },
};
export default function TimelineBuilderPage() { return <TimelineBuilderTool />; }
