import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Paycheck Calculator 2026 — Net Pay After Taxes and Deductions | Dayblip",
  description: "Calculate your net paycheck after federal tax, state tax, FICA, and pre-tax deductions like 401k and health insurance. Free paycheck calculator — no signup.",
  alternates: { canonical: "https://www.dayblip.com/finance/paycheck-calculator" },
  openGraph: {
    title: "Paycheck Calculator 2026 — Net Pay After Taxes | Dayblip",
    description: "Calculate your net paycheck after federal tax, state tax, FICA, and pre-tax deductions like 401k and health insurance.",
    url: "https://www.dayblip.com/finance/paycheck-calculator",
    images: [{ url: "https://www.dayblip.com/api/og?title=Paycheck+Calculator&emoji=%F0%9F%A7%BE&subtitle=Net+pay+after+federal+state+%26+FICA+taxes+%E2%80%94+Free&v=2", width: 1200, height: 630, alt: "Paycheck Calculator — Dayblip" }],
  },
  twitter: { card: "summary_large_image", images: ["https://www.dayblip.com/api/og?title=Paycheck+Calculator&emoji=%F0%9F%A7%BE&subtitle=Net+pay+after+federal+state+%26+FICA+taxes+%E2%80%94+Free&v=2"] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
