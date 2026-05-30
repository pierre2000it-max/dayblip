import type { Metadata } from "next";
import BornInLanding from "./BornInLanding";

export const metadata: Metadata = {
  title: "Born In — What Year Were You Born? | Dayblip",
  description: "Enter your birth year to discover the #1 song, movies, gas prices and world events from the year you were born.",
  keywords: ["born in", "birth year", "what happened when I was born", "born in 1990"],
};

export default function BornInPage() {
  return <BornInLanding />;
}
