import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Is My Salary Fair for My Area? A 3-Step Check",
  description:
    "Check if your salary is fair for your area: pull 3 benchmarks, adjust for cost of living, apply a 10% band. Worked examples. Free, no signup required.",
  alternates: { canonical: "https://www.dayblip.com/blog/is-my-salary-fair" },
  openGraph: {
    title: "Is My Salary Fair for My Area? A 3-Step Check",
    description: "A fair salary is within 10% of the local market. Here is how to find that number and what a gap costs over 10 years.",
    url: "https://www.dayblip.com/blog/is-my-salary-fair",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
