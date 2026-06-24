import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What Is a Roth IRA and Who Should Open One in 2026? | Dayblip",
  description:
    "A Roth IRA lets $7,000 grow tax-free until retirement. Withdraw contributions any time penalty-free. The 2026 income limit for single filers is $150,000. Everything you need to know to decide.",
  alternates: { canonical: "https://www.dayblip.com/blog/what-is-a-roth-ira" },
  openGraph: {
    title: "What Is a Roth IRA and Who Should Open One?",
    description: "$7,000/year at 7% for 30 years grows to ~$706,000 tax-free. The 2026 contribution limit and income rules explained.",
    url: "https://www.dayblip.com/blog/what-is-a-roth-ira",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
