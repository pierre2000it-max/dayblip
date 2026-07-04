import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "On This Day in History — Any Date",
  description: "Discover historical events, famous birthdays and scientific discoveries for any day of the year. Select your date to explore history.",
  alternates: { canonical: "https://www.dayblip.com/on-this-day" },
}

export default function OnThisDayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
