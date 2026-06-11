import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Money Transfer Comparison — Cheapest Way to Send Money Internationally | Dayblip",
  description:
    "Compare the cheapest way to send money internationally. See total cost including exchange rate markup for Wise Western Union PayPal Zelle and more. Free. No signup ever.",
  alternates: { canonical: "https://www.dayblip.com/tools/money-transfer-comparison" },
  openGraph: {
    title: "Money Transfer Comparison | Dayblip",
    description:
      "Compare the cheapest way to send money internationally including exchange rate markup.",
    url: "https://www.dayblip.com/tools/money-transfer-comparison",
    type: "website",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
