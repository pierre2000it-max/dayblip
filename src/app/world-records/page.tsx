import type { Metadata } from "next";
import WorldRecordsTool from "./WorldRecordsTool";
export const metadata: Metadata = {
  title: "World Records Through Time",
  description: "See how world records have changed across the decades. Fastest mile, tallest building and more historical records.",
  keywords: ["world records history", "fastest mile record history", "tallest building history", "world records through time"],
  alternates: { canonical: "https://www.dayblip.com/world-records" },
};
export default function WorldRecordsPage() { return <WorldRecordsTool />; }
