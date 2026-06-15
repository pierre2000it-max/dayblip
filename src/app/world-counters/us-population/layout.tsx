import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "US Population Live Counter 2026 | Dayblip",
  description: "Watch the US population tick up in real time. Live counter based on US Census Bureau rates — 1 birth every 9 seconds, 1 death every 9.5 seconds. Free.",
  alternates: { canonical: "https://www.dayblip.com/world-counters/us-population" },
  openGraph: {
    title: "US Population Live Counter 2026 | Dayblip",
    description: "Real-time US population estimate based on Census Bureau birth, death, and migration rates.",
    url: "https://www.dayblip.com/world-counters/us-population",
  },
  twitter: { card: "summary_large_image" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
