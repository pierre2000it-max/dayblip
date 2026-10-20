import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The True Cost of Paying Only the Minimum on Credit Cards",
  description:
    "A $5,000 card balance at 19.99% APR takes 18 years 10 months on minimum payments and costs $7,313 in interest. Paying $200 a month saves $5,792. Free math.",
  alternates: { canonical: "https://www.dayblip.com/blog/true-cost-of-minimum-payments" },
  openGraph: {
    title: "The True Cost of Making Only Minimum Credit Card Payments",
    description: "A $5,000 balance at 19.99% APR costs $7,313 in interest on minimums. Paying $200/month saves $5,792 and 16 years.",
    url: "https://www.dayblip.com/blog/true-cost-of-minimum-payments",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
