import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Calorie Calculator — Daily Calorie Needs for Your Goals | Dayblip",
  description:
    "Calculate your daily calorie needs based on age weight height activity level and goal. Uses the Mifflin-St Jeor equation — the most accurate calorie formula available.",
  alternates: { canonical: "https://www.dayblip.com/health/calorie-calculator" },
  openGraph: {
    title: "Calorie Calculator — Daily Calorie Needs for Your Goals",
    description: "Calculate your daily calorie needs based on age weight height activity level and goal.",
    url: "https://www.dayblip.com/health/calorie-calculator",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
