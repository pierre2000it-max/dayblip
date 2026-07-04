import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The True Cost of Making Only Minimum Credit Card Payments — The Numbers Most People Never See",
  description:
    "A $5,000 credit card balance at 19.99% APR takes 15 years to pay off on minimum payments and costs $6,270 in interest. Paying $200/month instead gets it done in 2.5 years and saves $5,108. The math that changes how people think about debt.",
  alternates: { canonical: "https://www.dayblip.com/blog/true-cost-of-minimum-payments" },
  openGraph: {
    title: "The True Cost of Making Only Minimum Credit Card Payments",
    description: "A $5,000 balance at 19.99% APR costs $6,270 in interest on minimums. Paying $200/month saves $5,108 and 12.5 years.",
    url: "https://www.dayblip.com/blog/true-cost-of-minimum-payments",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
