import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Side Hustle Investment Calculator — Build Wealth With Extra Income",
  description: "Calculate how much a side hustle could build if you invested the earnings. See milestones at 1, 5, 10 and 20 years. Motivational financial calculator.",
  alternates: { canonical: "https://www.dayblip.com/curiosity/side-hustle" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
