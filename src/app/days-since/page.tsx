import type { Metadata } from "next";
import DaysSinceTool from "./DaysSinceTool";
export const metadata: Metadata = {
  title: "Days Since Famous Events — Live Historical Counters",
  description: "See live counters showing exactly how many days since famous historical events. From 9/11 to the first iPhone.",
  keywords: ["days since 9/11", "days since moon landing", "how long ago did it happen", "days since famous events", "historical event counters"],
};
export default function DaysSincePage() { return <DaysSinceTool />; }
