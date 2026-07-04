import type { Metadata } from "next";
import DailyTriviaTool from "./DailyTriviaTool";
export const metadata: Metadata = {
  title: "Daily History Trivia — New Question Every Day",
  description: "Test your history knowledge with a new trivia question every day. Track your streak and challenge friends.",
  keywords: ["daily history trivia", "history quiz", "daily trivia question", "history trivia game"],
  alternates: { canonical: "https://www.dayblip.com/daily-trivia" },
};
export default function DailyTriviaPage() { return <DailyTriviaTool />; }
