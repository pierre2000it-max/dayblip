import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "True Cost of Credit Card Minimum Payments",
  description:
    "Paying minimums on $8,000 at 19.99% takes 27 years and costs $16,247 in interest. Adding $100 per month saves $13,400 and 23 years.",
  alternates: { canonical: "https://www.dayblip.com/blog/minimum-payment-true-cost" },
  openGraph: {
    title: "True Cost of Credit Card Minimum Payments",
    description: "$8,000 at minimum payments = 27 years and $16,247 in interest.",
    url: "https://www.dayblip.com/blog/minimum-payment-true-cost",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
