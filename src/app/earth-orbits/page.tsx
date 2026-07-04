import type { Metadata } from "next";
import EarthOrbitsTool from "./EarthOrbitsTool";
export const metadata: Metadata = {
  title: "How Many Times Has Earth Orbited the Sun in Your Lifetime?",
  description: "Find out how many times Earth has orbited the sun since you were born. Cosmic facts about your time on Earth.",
  keywords: ["earth orbits calculator", "how many times earth orbited sun", "cosmic age calculator", "earth travel distance lifetime"],
  alternates: { canonical: "https://www.dayblip.com/earth-orbits" },
};
export default function EarthOrbitsPage() { return <EarthOrbitsTool />; }
