import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rent vs Buy — Is Buying Always Better? Here Is the Math",
  description:
    "Buying is not always better than renting. The break-even point is typically 5 to 7 years. Learn how to work out which one fits your situation.",
  alternates: {
    canonical: "https://www.dayblip.com/blog/rent-vs-buy-calculator",
  },
  openGraph: {
    title: "Rent vs Buy — Is Buying Always Better? Here Is the Math",
    description:
      "The break-even point where buying beats renting is typically 5-7 years. Here is how to calculate which is right for your situation.",
    url: "https://www.dayblip.com/blog/rent-vs-buy-calculator",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
