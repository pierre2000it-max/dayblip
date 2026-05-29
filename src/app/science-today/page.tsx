import type { Metadata } from "next";
import ScienceTodayTool from "./ScienceTodayTool";
export const metadata: Metadata = {
  title: "This Day in Science — Daily Science History",
  description: "Discover scientific discoveries and inventions that happened on this day in history. Daily science facts and history.",
  keywords: ["this day in science", "science history today", "scientific discoveries today", "daily science fact"],
};
export default function ScienceTodayPage() { return <ScienceTodayTool />; }
