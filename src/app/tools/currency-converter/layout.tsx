import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Currency Converter — Live Exchange Rates for 150+ Currencies",
  description: "Convert between 150+ currencies with live exchange rates, including USD to EUR, GBP, JPY, CAD, and AUD. Free currency converter — no signup required.",
  alternates: { canonical: "https://www.dayblip.com/tools/currency-converter" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
