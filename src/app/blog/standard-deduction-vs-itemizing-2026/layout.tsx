import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Standard Deduction vs Itemizing in 2026: Which Saves More?",
  description:
    "Standard deduction or itemize? 2026 amounts are $16,100 single and $32,200 married. Worked examples show the break-even. Free tax bracket calculator.",
  alternates: { canonical: "https://www.dayblip.com/blog/standard-deduction-vs-itemizing-2026" },
  openGraph: {
    title: "Standard Deduction vs Itemizing in 2026: Which Saves More?",
    description: "Itemize only when your deductions top $16,100 (single) or $32,200 (married). See the SALT cap, mortgage break-even and a bunching example.",
    url: "https://www.dayblip.com/blog/standard-deduction-vs-itemizing-2026",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
