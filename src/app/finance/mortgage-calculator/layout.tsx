import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mortgage Payment Calculator — Monthly Payments & Amortization | Dayblip",
  description: "Calculate monthly mortgage payments with principal, interest, taxes and insurance. Includes 30/20/15yr comparison and amortization table. Free calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/mortgage-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
