import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Recession Readiness Score — How Prepared Are You? | Dayblip",
  description: "Get your personal recession readiness score. Find out how long you could survive a job loss and your top 3 actions to prepare. Free calculator.",
  keywords: ["recession readiness calculator", "am I prepared for recession", "recession survival calculator", "emergency fund calculator", "financial preparedness score"],
  alternates: { canonical: "https://www.dayblip.com/tools/recession-score" },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
