import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What Is a Roth IRA and Who Should Open One in 2026?",
  description:
    "A Roth IRA lets $7,500 a year grow tax-free. Contributions come out penalty-free any time. The 2026 single-filer income limit is $153,000. Free guide.",
  alternates: { canonical: "https://www.dayblip.com/blog/what-is-a-roth-ira" },
  openGraph: {
    title: "What Is a Roth IRA and Who Should Open One?",
    description: "$7,500/year at 7% for 30 years grows to ~$708,000 tax-free. The 2026 contribution limit, income phase-outs, and how to open one in 15 minutes.",
    url: "https://www.dayblip.com/blog/what-is-a-roth-ira",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
