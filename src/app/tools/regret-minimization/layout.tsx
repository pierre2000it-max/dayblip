import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Regret Minimization Calculator — Will You Regret This?",
  description: "Use Jeff Bezos's regret minimization framework to evaluate any major life decision. Free calculator.",
  keywords: "regret minimization framework, bezos regret minimization calculator, should I do it calculator, life decision calculator",
  alternates: { canonical: "https://www.dayblip.com/tools/regret-minimization" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
