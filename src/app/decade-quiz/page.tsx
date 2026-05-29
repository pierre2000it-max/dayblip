import type { Metadata } from "next";
import DecadeQuizTool from "./DecadeQuizTool";
export const metadata: Metadata = {
  title: "Which Decade Were You Born For? Personality Quiz",
  description: "Take our personality quiz to discover which decade matches your soul. Are you a 50s, 80s or 90s person?",
  keywords: ["which decade are you", "decade personality quiz", "what decade were you born for", "decade quiz"],
};
export default function DecadeQuizPage() { return <DecadeQuizTool />; }
