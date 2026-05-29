import type { Metadata } from "next";
import NewspaperTool from "./NewspaperTool";
export const metadata: Metadata = {
  title: "Historical Newspaper Front Page — Headlines from Any Date",
  description: "See historical newspaper-style front pages from any date. What were the headlines on your birthday?",
  keywords: ["historical newspaper", "old newspaper front page", "headlines on my birthday", "newspaper from my birthday"],
};
export default function NewspaperPage() { return <NewspaperTool />; }
