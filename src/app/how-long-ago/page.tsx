import type { Metadata } from "next";
import HowLongAgoTool from "./HowLongAgoTool";
export const metadata: Metadata = {
  title: "How Long Ago? History Slider Game",
  description: "Drag the slider to guess how many years ago famous events happened. An addictive history guessing game.",
  keywords: ["how long ago game", "history slider", "years ago quiz", "history guessing game"],
  alternates: { canonical: "https://www.dayblip.com/how-long-ago" },
};
export default function HowLongAgoPage() { return <HowLongAgoTool />; }
