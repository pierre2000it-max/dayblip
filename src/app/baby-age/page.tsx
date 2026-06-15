import type { Metadata } from "next";
import BabyAgeTool from "./BabyAgeTool";
export const metadata: Metadata = {
  title: "Baby Age Calculator — How Old is My Baby in Weeks?",
  description: "Calculate your baby's age in days, weeks, months and milestones. See developmental stages and upcoming growth markers. Free — no signup required.",
  keywords: ["baby age calculator", "how old is my baby in weeks", "baby weeks calculator", "baby milestones", "how many weeks old is my baby"],
};
export default function BabyAgePage() { return <BabyAgeTool />; }
