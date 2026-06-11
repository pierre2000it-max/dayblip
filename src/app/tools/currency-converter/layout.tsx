import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Currency Converter — Live Exchange Rates for 150+ Currencies | Dayblip",
  description: "Convert between 150+ currencies with live exchange rates. USD to EUR, GBP, JPY, CAD, AUD and more. Free currency converter — updated daily. No signup required.",
  alternates: { canonical: "https://www.dayblip.com/tools/currency-converter" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
