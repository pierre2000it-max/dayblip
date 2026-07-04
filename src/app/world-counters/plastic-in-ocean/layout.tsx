import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Plastic Entering the Ocean Today — Live Counter",
  description: "See how much plastic has entered the ocean today. Live counter based on 11 million metric tons per year entering our oceans. Real-time. Free — no signup.",
  alternates: { canonical: "https://www.dayblip.com/world-counters/plastic-in-ocean" },
  openGraph: {
    title: "Plastic Entering the Ocean Today — Live Counter",
    description: "11 million metric tons of plastic enter the ocean each year. Watch today's total tick up in real time.",
    url: "https://www.dayblip.com/world-counters/plastic-in-ocean",
  },
  twitter: { card: "summary_large_image" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
