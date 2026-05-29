import type { Metadata } from "next";
import BirthdayCountdownMain from "./BirthdayCountdownMain";
export const metadata: Metadata = {
  title: "Create Your Birthday Countdown | Dayblip",
  description: "Generate a personal birthday countdown page to share with friends and family.",
  keywords: ["birthday countdown", "birthday countdown generator", "share birthday countdown"],
};
export default function BirthdayCountdownPage() { return <BirthdayCountdownMain />; }
