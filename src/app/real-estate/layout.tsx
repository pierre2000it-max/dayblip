import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Real Estate Calculators — Mortgage, Rent vs Buy",
  description: "Free real estate calculators for mortgage payments, rent vs buy comparison and home affordability. Make smarter property decisions.",
  alternates: { canonical: "https://www.dayblip.com/real-estate" },
}

export default function RealEstateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
