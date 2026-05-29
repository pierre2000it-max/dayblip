import type { Metadata } from "next";
import BirthdayNowTool from "./BirthdayNowTool";
export const metadata: Metadata = {
  title: "Is It Still Your Birthday? World Birthday Checker",
  description: "Check if it is still your birthday somewhere in the world. See your birthday status across all time zones.",
  keywords: ["is it my birthday somewhere", "birthday time zones", "birthday world clock", "is it still my birthday"],
};
export default function BirthdayNowPage() { return <BirthdayNowTool />; }
