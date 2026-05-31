import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Stock Return Calculator — Investment Return Calculator | Dayblip",
  description: "Calculate your stock market investment returns including dividends. Compare performance to the S&P 500 benchmark. Free investment return calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/stock-return" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
