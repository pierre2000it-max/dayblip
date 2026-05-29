import type { Metadata } from "next";
import TimeCapsuleTool from "./TimeCapsuleTool";
export const metadata: Metadata = {
  title: "Personal Time Capsule — Write to Your Future Self",
  description: "Create a personal time capsule and write a message to your future self. Set a date to open it and share the countdown.",
  keywords: ["time capsule", "letter to future self", "write to future self", "personal time capsule online"],
};
export default function TimeCapsulePage() { return <TimeCapsuleTool />; }
