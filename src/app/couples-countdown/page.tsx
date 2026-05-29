import type { Metadata } from "next";
import CouplesCountdownTool from "./CouplesCountdownTool";

export const metadata: Metadata = {
  title: "Couples Countdown — How Long Have You Been Together?",
  description: "Calculate how many days you have been with your partner. Find your relationship milestones and anniversary countdown.",
  keywords: ["how long have we been together", "relationship days calculator", "couples countdown", "anniversary countdown"],
};

export default function CouplesCountdownPage() {
  return <CouplesCountdownTool />;
}
