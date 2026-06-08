import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "True Cost of Car Ownership — The Number Nobody Calculates | Dayblip",
  description:
    "The sticker price is the least important number when buying a car. A $25,000 car costs $1,211 per month when you include insurance, fuel, maintenance and depreciation.",
  alternates: {
    canonical: "https://www.dayblip.com/blog/true-cost-of-car-ownership",
  },
  openGraph: {
    title: "True Cost of Car Ownership — The Number Nobody Calculates",
    description:
      "A $25,000 car costs $1,211 per month when you include insurance, fuel, maintenance and depreciation.",
    url: "https://www.dayblip.com/blog/true-cost-of-car-ownership",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
