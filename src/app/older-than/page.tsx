import type { Metadata } from "next";
import OlderThanTool from "./OlderThanTool";
export const metadata: Metadata = {
  title: "Are You Older Than the iPhone? Age Comparison Calculator",
  description: "Find out if you are older or younger than famous inventions, websites and world events. Compare your age to history.",
  keywords: ["am I older than the internet", "older than the iphone", "age comparison", "older than calculator"],
};
export default function OlderThanPage() { return <OlderThanTool />; }
