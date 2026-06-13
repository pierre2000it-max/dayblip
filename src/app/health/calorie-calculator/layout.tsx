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
    images: [{ url: "https://www.dayblip.com/api/og?title=Calorie+Calculator&emoji=%F0%9F%A5%97&subtitle=Daily+calorie+needs+for+your+goal+%E2%80%94+Free", width: 1200, height: 630, alt: "Calorie Calculator — Dayblip" }],
  },
  twitter: { card: "summary_large_image", images: ["https://www.dayblip.com/api/og?title=Calorie+Calculator&emoji=%F0%9F%A5%97&subtitle=Daily+calorie+needs+for+your+goal+%E2%80%94+Free"] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
