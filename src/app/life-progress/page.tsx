import type { Metadata } from "next";
import LifeProgressTool from "./LifeProgressTool";

export const metadata: Metadata = {
  title: "Life Progress Bar — How Far Through Life Are You?",
  description: "See your life as a progress bar. Find out what percentage of your life you have lived and how many days you have remaining.",
  keywords: ["life progress bar", "how far through life am I", "days alive", "life percentage"],
};

export default function LifeProgressPage() {
  return <LifeProgressTool />;
}
