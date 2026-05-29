import type { Metadata } from "next";
import TimeSpentTool from "./TimeSpentTool";
export const metadata: Metadata = {
  title: "Time Spent Calculator — How Have You Spent Your Life?",
  description: "Calculate how much of your life you have spent sleeping, working, eating and on screens. Discover your life time breakdown.",
  keywords: ["how much time have I spent sleeping", "life time calculator", "time spent calculator", "how much of my life sleeping"],
};
export default function TimeSpentPage() { return <TimeSpentTool />; }
