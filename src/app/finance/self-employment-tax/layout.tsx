import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Self-Employment Tax Calculator — Freelance Tax Estimate",
  description: "Calculate self-employment tax for freelancers and business owners. Includes quarterly estimated tax schedule and SE tax deduction. Educational only.",
  alternates: { canonical: "https://www.dayblip.com/finance/self-employment-tax" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
