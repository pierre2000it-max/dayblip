import type { Metadata } from "next";
import BirthdayTwinsTool from "./BirthdayTwinsTool";

export const metadata: Metadata = {
  title: "Birthday Twin Finder — Famous People Who Share Your Birthday",
  description: "Find famous people who share your birthday. Discover your celebrity birthday twins from history, pop culture, and world events. Free — no signup required.",
  keywords: ["birthday twin finder", "famous people born on my birthday", "celebrity birthday twins", "who shares my birthday"],
  alternates: { canonical: "https://www.dayblip.com/birthday-twins" },
};

export default function BirthdayTwinsPage() {
  return <BirthdayTwinsTool />;
}
