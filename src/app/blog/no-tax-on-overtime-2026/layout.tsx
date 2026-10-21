import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "No Tax on Overtime in 2026: What It Means for Your Pay",
  description:
    "The federal overtime deduction is law for 2025 through 2028. See what qualifies, the $12,500 cap, who phases out, and what it saves you.",
  alternates: { canonical: "https://www.dayblip.com/blog/no-tax-on-overtime-2026" },
  openGraph: {
    title: "No Tax on Overtime in 2026: What It Means for Your Pay",
    description: "A federal deduction covers the premium part of overtime pay, up to $12,500. FICA still applies. Here is how to calculate your real number.",
    url: "https://www.dayblip.com/blog/no-tax-on-overtime-2026",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
