import type { Metadata } from "next";
import OldestThingsTool from "./OldestThingsTool";
export const metadata: Metadata = {
  title: "Oldest Things in the World | Dayblip",
  description: "Discover the oldest living things, oldest human creations and oldest companies. How does your age compare?",
  keywords: ["oldest things in the world", "oldest living thing", "oldest tree", "oldest person", "oldest company"],
};
export default function OldestThingsPage() { return <OldestThingsTool />; }
