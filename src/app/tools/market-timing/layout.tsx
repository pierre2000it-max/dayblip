import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Market Timing Cost Calculator — What Does Missing Best Days Cost? | Dayblip",
  description: "See how much missing the stock market's best days costs you. Missing just 10 days over 20 years dramatically reduces returns.",
  keywords: ["market timing calculator", "cost of missing best market days", "time in market vs timing the market", "S&P 500 missing best days calculator"],
  alternates: { canonical: "https://www.dayblip.com/tools/market-timing" },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
