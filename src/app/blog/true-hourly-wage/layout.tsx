import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What Your Salary Actually Pays Per Hour | Dayblip Blog",
  description:
    "Your true hourly wage accounts for commute time, work food and clothing costs. For most workers it is 15–25% lower than the stated rate.",
  alternates: { canonical: "https://www.dayblip.com/blog/true-hourly-wage" },
  openGraph: {
    title: "What Your Salary Actually Pays Per Hour",
    description: "Your true hourly wage is usually 15–25% lower than your stated salary. Here is how to calculate it.",
    url: "https://www.dayblip.com/blog/true-hourly-wage",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
