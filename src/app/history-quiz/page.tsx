import type { Metadata } from "next";
import HistoryQuizTool from "./HistoryQuizTool";
export const metadata: Metadata = {
  title: "Before or After? History Quiz",
  description: "Test your history knowledge with our Before or After quiz. Did the iPhone come before or after Facebook? Free to play — no signup required.",
  keywords: ["history quiz", "before or after quiz", "history trivia game", "timeline quiz"],
  alternates: { canonical: "https://www.dayblip.com/history-quiz" },
};
export default function HistoryQuizPage() { return <HistoryQuizTool />; }
