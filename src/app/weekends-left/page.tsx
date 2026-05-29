import type { Metadata } from "next";
import WeekendsLeftTool from "./WeekendsLeftTool";
export const metadata: Metadata = {
  title: "How Many Weekends Do You Have Left?",
  description: "Calculate how many weekends you have left in your life. A thought-provoking countdown to make the most of your time.",
  keywords: ["how many weekends left", "weekends remaining", "weekends left in life", "life weekends calculator"],
};
export default function WeekendsLeftPage() { return <WeekendsLeftTool />; }
