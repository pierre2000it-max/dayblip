import type { Metadata } from "next";
import WorldRecordsTool from "./WorldRecordsTool";
export const metadata: Metadata = {
  title: "World Records Through Time",
  description: "See how world records have changed over the decades, including the fastest mile and the tallest building. Free world records tool — no signup required.",
  keywords: ["world records history", "fastest mile record history", "tallest building history", "world records through time"],
  alternates: { canonical: "https://www.dayblip.com/world-records" },
};
export default function WorldRecordsPage() { return <WorldRecordsTool />; }
