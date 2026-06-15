import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Love Compatibility Calculator — Are You Compatible? | Dayblip",
  description: "Calculate love compatibility based on numerology life path numbers and Chinese zodiac signs. Free compatibility calculator.",
  alternates: { canonical: "https://www.dayblip.com/curiosity/compatibility" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
