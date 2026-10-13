import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Tax Case for Moving States: What Relocating Actually Saves You",
  description:
    "Moving from California to Texas saves $4,285 a year on a $75,000 salary. Invested at 7% for 30 years, that gap grows to $429,000. See the math.",
  alternates: { canonical: "https://www.dayblip.com/blog/moving-states-tax-savings" },
  openGraph: {
    title: "The Tax Case for Moving States: What Relocating Actually Saves You",
    description: "Moving from a high-tax to a no-tax state can save $4,000+ per year. Here is what that savings compounds to over a career — and what to watch out for.",
    url: "https://www.dayblip.com/blog/moving-states-tax-savings",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
