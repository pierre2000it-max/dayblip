import type { Metadata } from "next";
import WorldCountdownsTool from "./WorldCountdownsTool";

export const metadata: Metadata = {
  title: "Live World Countdowns — Real-Time Timers",
  description: "Live real-time countdowns to Christmas, New Year, Halloween and all major world events. Updates every second.",
  keywords: ["live countdown", "world countdowns", "real time countdown", "countdown to christmas", "countdown to new year"],
  alternates: { canonical: "https://www.dayblip.com/world-countdowns" },
  openGraph: {
    title: "Live World Countdowns — Real-Time Timers",
    description: "Live real-time countdowns to Christmas, New Year, Halloween and all major world events. Updates every second.",
    type: "website",
    url: "https://www.dayblip.com/world-countdowns",
    images: [{ url: "/api/og?title=World+Countdowns&emoji=🌍&subtitle=Live+timers+to+every+major+world+event", width: 1200, height: 630, alt: "World Countdowns" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live World Countdowns — Real-Time Timers",
    description: "Live real-time countdowns to Christmas, New Year, Halloween and all major world events. Updates every second.",
    images: ["/api/og?title=World+Countdowns&emoji=🌍&subtitle=Live+timers+to+every+major+world+event"],
  },
};

export default function WorldCountdownsPage() {
  return <WorldCountdownsTool />;
}
