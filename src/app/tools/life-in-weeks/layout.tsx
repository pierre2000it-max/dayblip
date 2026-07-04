import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your Life in Weeks — Life Visualization Tool",
  description: "See your entire life visualized in a grid of weeks. Each square is one week. How many do you have left?",
  keywords: "life in weeks visualization, life calendar, weeks left to live, life progress visualization",
  alternates: { canonical: "https://www.dayblip.com/tools/life-in-weeks" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
