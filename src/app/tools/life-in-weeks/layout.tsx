import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your Life in Weeks — Life Visualization Tool",
  description: "See your entire life as a grid of weeks, with one square per week. How many do you have left? Free life in weeks chart — no signup required.",
  keywords: "life in weeks visualization, life calendar, weeks left to live, life progress visualization",
  alternates: { canonical: "https://www.dayblip.com/tools/life-in-weeks" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
