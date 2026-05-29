import type { Metadata } from "next";
import GuessTheYearTool from "./GuessTheYearTool";
export const metadata: Metadata = {
  title: "Guess the Year — History Quiz Game",
  description: "Test your history knowledge by guessing what year famous events happened. Score points for accuracy in this addictive quiz.",
  keywords: ["guess the year game", "history quiz", "what year did it happen", "history trivia game"],
};
export default function GuessTheYearPage() { return <GuessTheYearTool />; }
