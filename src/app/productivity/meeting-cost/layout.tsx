import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Meeting Cost Calculator — Live Timer & Manual",
  description: "Calculate the real cost of meetings in salary time. Includes a live ticking timer. See annual cost of weekly meetings. Free meeting cost calculator.",
  alternates: { canonical: "https://www.dayblip.com/productivity/meeting-cost" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
