import type { Metadata } from "next";
import BirthdayCountdownMain from "./BirthdayCountdownMain";
export const metadata: Metadata = {
  title: "Create Your Birthday Countdown",
  description: "Create a personal birthday countdown page to share with friends and family. See the days, hours, and minutes left. Free — no signup required.",
  keywords: ["birthday countdown", "birthday countdown generator", "share birthday countdown"],
  alternates: { canonical: "https://www.dayblip.com/birthday-countdown" },
};
export default function BirthdayCountdownPage() { return <BirthdayCountdownMain />; }
