import type { Metadata } from "next";
import DaysAliveTool from "./DaysAliveTool";

export const metadata: Metadata = {
  title: "Days Alive Calculator — How Many Days Old Are You?",
  description: "Find out exactly how many days old you are and when you hit major milestones like 10,000 days alive.",
  keywords: ["how many days old am I", "days alive", "10000 days old", "days alive calculator"],
};

export default function DaysAlivePage() {
  return <DaysAliveTool />;
}
