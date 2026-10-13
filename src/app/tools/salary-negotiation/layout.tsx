import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Salary Negotiation Calculator — How Much Should You Ask For?",
  description: "Calculate how much to negotiate on your salary and get a ready-to-use negotiation script based on market data. Free — no signup required.",
  alternates: { canonical: "https://www.dayblip.com/tools/salary-negotiation" },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
