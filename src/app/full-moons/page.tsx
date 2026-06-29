import type { Metadata } from "next";
import FullMoonsTool from "./FullMoonsTool";
export const metadata: Metadata = {
  title: "How Many Full Moons Since I Was Born? Calculator | Dayblip",
  description: "Calculate how many full moons have occurred since your birthday. See your lunar milestone count, next full moon date, and Blue Moon history. Free.",
  keywords: ["how many full moons have I lived", "next full moon", "full moon calculator", "moon phase today"],
  alternates: { canonical: "https://www.dayblip.com/full-moons" },
};
export default function FullMoonsPage() { return <FullMoonsTool />; }
