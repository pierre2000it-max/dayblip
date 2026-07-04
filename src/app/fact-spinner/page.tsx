import type { Metadata } from "next";
import FactSpinnerTool from "./FactSpinnerTool";
export const metadata: Metadata = {
  title: "Random Historical Fact Spinner",
  description: "Spin to discover random historical facts and trivia. Learn something new every spin at Dayblip.",
  keywords: ["random historical facts", "history trivia", "fun facts spinner", "random fun facts"],
  alternates: { canonical: "https://www.dayblip.com/fact-spinner" },
};
export default function FactSpinnerPage() { return <FactSpinnerTool />; }
