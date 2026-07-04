import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Retirement Savings Calculator — Are You On Track?",
  description: "Find out if your retirement savings are on track. See projected balance vs amount needed using the 25x rule. Free retirement calculator, no signup.",
  alternates: { canonical: "https://www.dayblip.com/finance/retirement-savings" },
  openGraph: {
    title: "Retirement Savings Calculator — Are You On Track?",
    description: "Find out if your retirement savings are on track. See projected balance vs amount needed using the 25x rule.",
    url: "https://www.dayblip.com/finance/retirement-savings",
    images: [{ url: "https://www.dayblip.com/api/og?title=Retirement+Savings+Calculator&emoji=%F0%9F%8F%96%EF%B8%8F&subtitle=Are+your+savings+on+track%3F+Free+calculator&v=2", width: 1200, height: 630, alt: "Retirement Savings Calculator — Dayblip" }],
  },
  twitter: { card: "summary_large_image", images: ["https://www.dayblip.com/api/og?title=Retirement+Savings+Calculator&emoji=%F0%9F%8F%96%EF%B8%8F&subtitle=Are+your+savings+on+track%3F+Free+calculator&v=2"] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
