import type { Metadata } from "next";
import TimeCapsuleTool from "./TimeCapsuleTool";
export const metadata: Metadata = {
  title: "Personal Time Capsule — Write to Your Future Self",
  description: "Create a personal time capsule with a message to your future self. Set a date to open it and share the countdown. Free — no signup required.",
  keywords: ["time capsule", "letter to future self", "write to future self", "personal time capsule online"],
  alternates: { canonical: "https://www.dayblip.com/time-capsule" },
};
export default function TimeCapsulePage() { return <TimeCapsuleTool />; }
