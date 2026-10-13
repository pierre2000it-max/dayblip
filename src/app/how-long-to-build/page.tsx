import type { Metadata } from "next";
import HowLongToBuildTool from "./HowLongToBuildTool";
export const metadata: Metadata = {
  title: "How Long Did It Take to Build? Famous Construction Times",
  description: "Find out how long famous structures took to build compared to your age, from the pyramids to the iPhone. Free — no signup required.",
  keywords: ["how long did it take to build", "construction time famous buildings", "how long eiffel tower built"],
  alternates: { canonical: "https://www.dayblip.com/how-long-to-build" },
};
export default function HowLongToBuildPage() { return <HowLongToBuildTool />; }
