import type { Metadata } from "next";
import ResolutionTrackerTool from "./ResolutionTrackerTool";
export const metadata: Metadata = {
  title: "New Year Resolution Tracker — Year Progress",
  description: "Track your New Year resolutions and see how far through the year you are. Year progress tracker and resolution checker.",
  keywords: ["new year resolution tracker", "year progress", "how far through the year", "resolution checker 2026"],
};
export default function ResolutionTrackerPage() { return <ResolutionTrackerTool />; }
