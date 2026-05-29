import type { Metadata } from "next";
import CountryHistoryTool from "./CountryHistoryTool";
export const metadata: Metadata = {
  title: "Historical Events by Country",
  description: "Explore major historical events from countries around the world. Filter by country and decade.",
  keywords: ["historical events by country", "history of United States", "world history timeline", "country history events"],
};
export default function CountryHistoryPage() { return <CountryHistoryTool />; }
