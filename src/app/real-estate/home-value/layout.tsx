import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Historical Home Value Calculator — What Is My Home Worth?",
  description: "Estimate your home's current value from purchase price, year bought, and historical appreciation. Free home value calculator — no signup required.",
  alternates: { canonical: "https://www.dayblip.com/real-estate/home-value" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
