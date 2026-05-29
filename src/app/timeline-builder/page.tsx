import type { Metadata } from "next";
import TimelineBuilderTool from "./TimelineBuilderTool";
export const metadata: Metadata = {
  title: "Timeline Builder — History Ordering Game",
  description: "Put historical events in chronological order in this fun history game. Test your knowledge of when things happened.",
  keywords: ["timeline game", "history ordering game", "chronological order quiz", "history timeline builder"],
};
export default function TimelineBuilderPage() { return <TimelineBuilderTool />; }
