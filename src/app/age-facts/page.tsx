import type { Metadata } from "next";
import AgeFactsTool from "./AgeFactsTool";
export const metadata: Metadata = {
  title: "Fun Facts About Your Age — Life Stats Calculator",
  description: "Discover how many times your heart has beaten, how much you have slept and other amazing facts about your life.",
  keywords: ["how many times has my heart beaten", "fun age facts", "life stats calculator", "how many times have I breathed"],
};
export default function AgeFactsPage() { return <AgeFactsTool />; }
