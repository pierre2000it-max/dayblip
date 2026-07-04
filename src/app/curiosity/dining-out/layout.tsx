import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dining Out Opportunity Cost Calculator",
  description: "See what you spend dining out vs cooking at home and what investing the difference could build over time. Balanced perspective included. Educational only.",
  alternates: { canonical: "https://www.dayblip.com/curiosity/dining-out" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
