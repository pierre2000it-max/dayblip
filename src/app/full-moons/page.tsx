import type { Metadata } from "next";
import FullMoonsTool from "./FullMoonsTool";
export const metadata: Metadata = {
  title: "How Many Full Moons Since I Was Born? Calculator | Dayblip",
  description: "Calculate how many full moons you have witnessed since your birthday. Live count updated in real time. Free — no signup required.",
  keywords: ["how many full moons have I lived", "next full moon", "full moon calculator", "moon phase today"],
};
export default function FullMoonsPage() { return <FullMoonsTool />; }
