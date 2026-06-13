import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Money Transfer Comparison — Find the Cheapest Way to Send Money | Dayblip",
  description:
    "Compare Wise Western Union Remitly PayPal and MoneyGram for any amount to 60 countries. See true total cost including exchange rate markup. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/tools/money-transfer-comparison" },
  openGraph: {
    title: "Money Transfer Comparison | Dayblip",
    description:
      "Compare the cheapest way to send money internationally including exchange rate markup.",
    url: "https://www.dayblip.com/tools/money-transfer-comparison",
    type: "website",
    images: [{ url: "https://www.dayblip.com/api/og?title=Money+Transfer+Comparison&emoji=%F0%9F%92%B8&subtitle=Find+the+cheapest+way+to+send+money+%E2%80%94+Free", width: 1200, height: 630, alt: "Money Transfer Comparison — Dayblip" }],
  },
  twitter: { card: "summary_large_image", images: ["https://www.dayblip.com/api/og?title=Money+Transfer+Comparison&emoji=%F0%9F%92%B8&subtitle=Find+the+cheapest+way+to+send+money+%E2%80%94+Free"] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
