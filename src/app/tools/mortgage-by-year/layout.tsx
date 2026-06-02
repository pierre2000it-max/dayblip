import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home Affordability by Year — Could You Afford a Home in 1990? | Dayblip",
  description: "See how home affordability has changed from 1970 to today. Calculate what income you needed to buy a home in any decade.",
  keywords: "home affordability history, could I afford a house in 1990, housing affordability calculator by year",
  alternates: { canonical: "https://www.dayblip.com/tools/mortgage-by-year" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
