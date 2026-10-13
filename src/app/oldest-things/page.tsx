import type { Metadata } from "next";
import OldestThingsTool from "./OldestThingsTool";
export const metadata: Metadata = {
  title: "Oldest Things in the World",
  description: "Discover the oldest living things, the oldest human creations, and the oldest companies. How does your age compare? Free — no signup required.",
  keywords: ["oldest things in the world", "oldest living thing", "oldest tree", "oldest person", "oldest company"],
  alternates: { canonical: "https://www.dayblip.com/oldest-things" },
};
export default function OldestThingsPage() { return <OldestThingsTool />; }
