import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "No Tax on Overtime in 2026: What It Actually Means for Your Paycheck",
  description:
    "The proposed overtime tax exemption explained in plain terms — what qualifies, how much you could keep, and what the catch is.",
  alternates: { canonical: "https://www.dayblip.com/blog/no-tax-on-overtime-2026" },
  openGraph: {
    title: "No Tax on Overtime in 2026: What It Actually Means for Your Paycheck",
    description: "The overtime tax exemption would exclude overtime wages from federal income tax — but not FICA. Here is how to calculate your real number.",
    url: "https://www.dayblip.com/blog/no-tax-on-overtime-2026",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
