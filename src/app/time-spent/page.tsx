import type { Metadata } from "next";
import TimeSpentTool from "./TimeSpentTool";
export const metadata: Metadata = {
  title: "Time Spent Calculator — How Many Years Have You Spent Sleeping? | Dayblip",
  description: "Find out how many years of your life you have spent sleeping, working, eating, and commuting. Free life time calculator.",
  keywords: ["how much time have I spent sleeping", "life time calculator", "time spent calculator", "how much of my life sleeping"],
};
export default function TimeSpentPage() { return <TimeSpentTool />; }
