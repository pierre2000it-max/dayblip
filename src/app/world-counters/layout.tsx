import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "World Live Counters — Births, Deaths, US Debt in Real Time | Dayblip",
  description: "Live world counters showing births, deaths, US national debt, emails, Google searches and more — updating every second. Free real-time statistics.",
  alternates: { canonical: "https://www.dayblip.com/world-counters" },
}

export default function WorldCountersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
