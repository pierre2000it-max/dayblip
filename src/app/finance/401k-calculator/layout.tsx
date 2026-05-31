import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "401(k) Calculator — Maximize Your Employer Match | Dayblip",
  description: "Calculate your 401k projected balance and monthly retirement income. See if you're leaving employer match money on the table. Free 401k calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/401k-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
