import type { Metadata } from "next";
import FullMoonsTool from "./FullMoonsTool";
export const metadata: Metadata = {
  title: "How Many Full Moons Since I Was Born? Calculator | Dayblip",
  description: "Calculate exactly how many full moons have occurred since your birthday. Updates in real time. Based on the 29.5-day lunar cycle. Free calculator — no signup ever.",
  keywords: ["how many full moons have I lived", "next full moon", "full moon calculator", "moon phase today"],
};
export default function FullMoonsPage() { return <FullMoonsTool />; }
