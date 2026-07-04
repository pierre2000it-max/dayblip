import type { Metadata } from "next";
import FamousOrFictionalTool from "./FamousOrFictionalTool";
export const metadata: Metadata = {
  title: "Famous or Fictional? History Quiz",
  description: "Was Sherlock Holmes real? Was Amelia Earhart fictional? Test your knowledge in this fun real vs fictional people quiz.",
  keywords: ["famous or fictional quiz", "real or fictional", "history trivia", "was sherlock holmes real"],
  alternates: { canonical: "https://www.dayblip.com/famous-or-fictional" },
};
export default function FamousOrFictionalPage() { return <FamousOrFictionalTool />; }
