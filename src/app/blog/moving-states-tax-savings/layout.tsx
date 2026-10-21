import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Tax Case for Moving States: What You Save",
  description:
    "Moving from California to Texas saves about $2,800 a year in state tax on $75,000. Invested at 7% for 30 years that grows to $263,000. See the math.",
  alternates: { canonical: "https://www.dayblip.com/blog/moving-states-tax-savings" },
  openGraph: {
    title: "The Tax Case for Moving States: What You Save",
    description: "Moving from a high-tax to a no-tax state can save $2,500 to $5,700 per year at a $75,000 salary. Here is what that savings compounds to over a career — and what to watch out for.",
    url: "https://www.dayblip.com/blog/moving-states-tax-savings",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
