import type { Metadata } from "next";
import BirthNumberTool from "./BirthNumberTool";
export const metadata: Metadata = {
  title: "What Number Human Are You? Birth Number Calculator",
  description: "Find out roughly what number human being you are in the history of our species, born out of 108 billion people. Free — no signup required.",
  keywords: ["what number human am I", "how many humans have ever lived", "birth number", "my number in history"],
  alternates: { canonical: "https://www.dayblip.com/birth-number" },
};
export default function BirthNumberPage() { return <BirthNumberTool />; }
