import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lottery vs Investing Calculator — What If You Invested Instead?",
  description: "See what your weekly lottery spending could be worth if invested in the S&P 500. Lottery odds vs investment returns compared. Educational tool only.",
  alternates: { canonical: "https://www.dayblip.com/curiosity/lottery" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
