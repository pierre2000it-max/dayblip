import type { Metadata } from "next";
import FullMoonsTool from "./FullMoonsTool";
export const metadata: Metadata = {
  title: "Full Moon Calculator — How Many Full Moons Have You Lived?",
  description: "Calculate how many full moons you have lived through and find the next full moon dates. Includes moon phase calculator.",
  keywords: ["how many full moons have I lived", "next full moon", "full moon calculator", "moon phase today"],
};
export default function FullMoonsPage() { return <FullMoonsTool />; }
