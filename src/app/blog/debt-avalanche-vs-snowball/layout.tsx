import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Debt Avalanche vs Debt Snowball — Which Method Pays Off Debt Faster? | Dayblip",
  description: "The debt avalanche saves the most in interest. The debt snowball gets more people to finish. With a real $18,000 multi-debt example the avalanche saves $1,361 and 3 months. The full comparison.",
  alternates: {
    canonical: "https://www.dayblip.com/blog/debt-avalanche-vs-snowball",
  },
  openGraph: {
    title: "Debt Avalanche vs Debt Snowball — Which Method Actually Works Better?",
    description: "Avalanche saves $1,361 more in a real $18,000 scenario. Snowball gets more people to finish per Journal of Marketing Research. The full comparison with real numbers.",
    url: "https://www.dayblip.com/blog/debt-avalanche-vs-snowball",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
