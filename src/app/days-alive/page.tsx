import type { Metadata } from "next";
import DaysAliveTool from "./DaysAliveTool";

export const metadata: Metadata = {
  title: "Days Alive Calculator — How Many Days Old Are You?",
  description: "Find out exactly how many days old you are today. See when you hit milestones like 10,000 days alive and what date your next milestone falls on. Free.",
  keywords: ["how many days old am I", "days alive", "10000 days old", "days alive calculator"],
};

export default function DaysAlivePage() {
  return <DaysAliveTool />;
}
