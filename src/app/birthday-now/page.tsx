import type { Metadata } from "next";
import BirthdayNowTool from "./BirthdayNowTool";
export const metadata: Metadata = {
  title: "Is It Still Your Birthday? World Birthday Checker",
  description: "Check if it is still your birthday somewhere in the world. See your birthday status across every time zone. Free birthday tool — no signup required.",
  keywords: ["is it my birthday somewhere", "birthday time zones", "birthday world clock", "is it still my birthday"],
  alternates: { canonical: "https://www.dayblip.com/birthday-now" },
};
export default function BirthdayNowPage() { return <BirthdayNowTool />; }
