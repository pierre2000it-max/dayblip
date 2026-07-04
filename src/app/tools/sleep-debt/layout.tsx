import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Sleep Debt Calculator — How Much Sleep Have You Lost?",
  description: "Calculate your accumulated sleep debt and how many hours of sleep you have missed over the years. Free sleep deficit calculator.",
  keywords: ["sleep debt calculator", "sleep deficit calculator", "how much sleep debt do I have", "accumulated sleep debt"],
  alternates: { canonical: "https://www.dayblip.com/tools/sleep-debt" },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
