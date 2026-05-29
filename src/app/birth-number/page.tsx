import type { Metadata } from "next";
import BirthNumberTool from "./BirthNumberTool";
export const metadata: Metadata = {
  title: "What Number Human Are You? Birth Number Calculator",
  description: "Find out approximately what number human being you are in the history of our species. Born out of 108 billion people.",
  keywords: ["what number human am I", "how many humans have ever lived", "birth number", "my number in history"],
};
export default function BirthNumberPage() { return <BirthNumberTool />; }
