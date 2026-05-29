import type { Metadata } from "next";
import WorldCountdownsTool from "./WorldCountdownsTool";

export const metadata: Metadata = {
  title: "Live World Countdowns — Real-Time Timers",
  description: "Live real-time countdowns to Christmas, New Year, Halloween and all major world events. Updates every second.",
  keywords: ["live countdown", "world countdowns", "real time countdown", "countdown to christmas", "countdown to new year"],
};

export default function WorldCountdownsPage() {
  return <WorldCountdownsTool />;
}
