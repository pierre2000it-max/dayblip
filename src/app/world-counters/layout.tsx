import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Live World Counters — Real Time Global Stats Updating Every Second | Dayblip",
  description: "Watch world population births deaths and US national debt update live every second. Real time global statistics based on current annual rates from UN and US Treasury. Free — no signup ever.",
  alternates: { canonical: "https://www.dayblip.com/world-counters" },
}

export default function WorldCountersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
