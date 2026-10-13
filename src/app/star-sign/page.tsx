import type { Metadata } from "next";
import StarSignTool from "./StarSignTool";
export const metadata: Metadata = {
  title: "Star Sign Calculator & Birthday Countdown",
  description: "Find your zodiac star sign and count down to your next birthday, with horoscope traits and compatible signs. Free star sign finder — no signup required.",
  keywords: ["star sign calculator", "zodiac sign", "what is my star sign", "horoscope birthday countdown", "zodiac traits"],
  alternates: { canonical: "https://www.dayblip.com/star-sign" },
};
export default function StarSignPage() { return <StarSignTool />; }
