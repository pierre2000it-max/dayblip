import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Salary Negotiation Calculator — How Much Should You Ask For? | Dayblip",
  description: "Calculate exactly how much to negotiate your salary. Get a ready-to-use negotiation script based on real market data.",
  alternates: { canonical: "https://www.dayblip.com/tools/salary-negotiation" },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
