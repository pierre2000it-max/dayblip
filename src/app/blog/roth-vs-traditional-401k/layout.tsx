import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Roth 401k vs Traditional 401k in 2026: Which Wins?",
  description:
    "Roth or traditional 401k? It turns on your tax rate now versus in retirement. 2026 worked examples at 3 incomes. Free 401k calculator.",
  alternates: { canonical: "https://www.dayblip.com/blog/roth-vs-traditional-401k" },
  openGraph: {
    title: "Roth 401k vs Traditional 401k in 2026: Which Wins?",
    description: "Traditional wins when your tax rate drops in retirement, Roth wins when it rises. Worked 2026 examples with the limits and the new Roth catch-up rule.",
    url: "https://www.dayblip.com/blog/roth-vs-traditional-401k",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
