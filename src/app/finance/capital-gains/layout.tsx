import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Capital Gains Tax Calculator 2026",
  description: "Calculate capital gains tax on stocks, real estate and investments. Compare short vs long-term rates and see your after-tax profit. Educational only.",
  alternates: { canonical: "https://www.dayblip.com/finance/capital-gains" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
