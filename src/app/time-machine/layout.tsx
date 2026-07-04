import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Historical Date Calculator — What Did the World Look Like on Any Date in History?",
  description: "Enter any date from 1920 to today. See what things cost, gas prices, the #1 song, and major events from that day. Free time machine.",
  alternates: { canonical: "https://www.dayblip.com/time-machine" },
  openGraph: {
    title: "Historical Date Time Machine",
    description: "Travel back to any date in history and see what life was like.",
    url: "https://www.dayblip.com/time-machine",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
