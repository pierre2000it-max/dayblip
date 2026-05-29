import type { Metadata } from "next";
import AgeCalculatorTool from "./AgeCalculatorTool";

export const metadata: Metadata = {
  title: "Age Calculator — How Old Am I?",
  description:
    "Free age calculator. Find out exactly how old you are in years, months, weeks, days and hours. Also shows your next birthday countdown.",
  keywords: ["age calculator", "how old am I", "age in days", "birthday calculator"],
};

export default function AgeCalculatorPage() {
  return <AgeCalculatorTool />;
}
