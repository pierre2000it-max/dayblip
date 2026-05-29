import type { Metadata } from "next";
import HowLongToBuildTool from "./HowLongToBuildTool";
export const metadata: Metadata = {
  title: "How Long Did It Take to Build? Famous Construction Times",
  description: "Find out how long famous structures took to build compared to your age. From the pyramids to the iPhone.",
  keywords: ["how long did it take to build", "construction time famous buildings", "how long eiffel tower built"],
};
export default function HowLongToBuildPage() { return <HowLongToBuildTool />; }
