import type { Metadata } from "next";
import PriceHistoryTool from "./PriceHistoryTool";
export const metadata: Metadata = {
  title: "Historical Price Comparison — What Did Things Cost?",
  description: "See what gas, bread, houses and cars cost in the past. Compare historical prices from 1950 to today.",
  keywords: ["historical prices", "what did things cost in 1990", "price history", "inflation calculator", "gas prices 1990"],
};
export default function PriceHistoryPage() { return <PriceHistoryTool />; }
