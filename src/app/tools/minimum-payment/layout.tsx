import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Minimum Payment Calculator — True Cost of Paying Minimums | Dayblip",
  description: "See the shocking true cost of only paying credit card minimums. Find out how long it really takes to pay off your debt. Free calculator.",
  keywords: ["minimum payment calculator", "true cost of minimum payments", "credit card payoff calculator", "how long to pay off credit card"],
  alternates: { canonical: "https://www.dayblip.com/tools/minimum-payment" },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
