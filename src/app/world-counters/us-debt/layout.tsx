import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "US National Debt Live Counter 2026",
  description: "Watch the US national debt grow in real time at about $72,920 per second. See what it adds per minute, hour and day. Free, no signup required.",
  alternates: { canonical: "https://www.dayblip.com/world-counters/us-debt" },
  openGraph: {
    title: "US National Debt Live Counter 2026",
    description: "Watch the US national debt grow in real time at about $72,920 per second. See what it adds per minute, hour and day. Free, no signup required.",
    url: "https://www.dayblip.com/world-counters/us-debt",
  },
  twitter: { card: "summary_large_image" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
