import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Heart Rate Calculator — Target Heart Rate Zones for Exercise",
  description:
    "Calculate your target heart rate zones for fat burning cardio and peak performance. Find your maximum heart rate and optimal training zones by age.",
  alternates: { canonical: "https://www.dayblip.com/health/heart-rate" },
  openGraph: {
    title: "Heart Rate Calculator — Target Heart Rate Zones for Exercise",
    description: "Calculate your target heart rate zones for fat burning cardio and peak performance.",
    url: "https://www.dayblip.com/health/heart-rate",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
