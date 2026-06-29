import type { Metadata } from "next";
import WorldPopulationTool from "./WorldPopulationTool";
export const metadata: Metadata = {
  title: "World Population When You Were Born | Dayblip",
  description: "Find out what the world population was when you were born and how much it has grown since.",
  keywords: ["world population when I was born", "population growth", "how many people alive when I was born", "world population history"],
  alternates: { canonical: "https://www.dayblip.com/world-population" },
};
export default function WorldPopulationPage() { return <WorldPopulationTool />; }
