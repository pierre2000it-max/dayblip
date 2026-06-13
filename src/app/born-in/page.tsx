import type { Metadata } from "next";
import BornInLanding from "./BornInLanding";

export const metadata: Metadata = {
  title: "Born In — What Year Were You Born? | Dayblip",
  description: "Enter your birth year to discover the #1 song, movies, gas prices and world events from the year you were born.",
  keywords: ["born in", "birth year", "what happened when I was born", "born in 1990"],
  openGraph: {
    title: "Born In — What Year Were You Born? | Dayblip",
    description: "Discover the #1 song, movies, gas prices and world events from the year you were born.",
    url: "https://www.dayblip.com/born-in",
    images: [{ url: "/api/og/born-in?year=1980&song=Call+Me+%E2%80%94+Blondie&gas=1.25&pop=4.45", width: 1200, height: 630, alt: "Born In 1980 — Dayblip" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/api/og/born-in?year=1980&song=Call+Me+%E2%80%94+Blondie&gas=1.25&pop=4.45"],
  },
};

export default function BornInPage() {
  return <BornInLanding />;
}
