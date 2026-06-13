import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mortgage Payment Calculator — Monthly Payments & Amortization | Dayblip",
  description: "Calculate monthly mortgage payments with principal, interest, taxes and insurance. Includes 30/20/15yr comparison and amortization table. Free calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/mortgage-calculator" },
  openGraph: {
    title: "Mortgage Payment Calculator — Monthly Payments & Amortization | Dayblip",
    description: "Calculate monthly mortgage payments with principal, interest, taxes and insurance. Includes 30/20/15yr comparison and amortization table.",
    url: "https://www.dayblip.com/finance/mortgage-calculator",
    images: [{ url: "https://www.dayblip.com/api/og?title=Mortgage+Calculator&emoji=%F0%9F%8F%A0&subtitle=Monthly+payments+%26+amortization+%E2%80%94+Free+calculator", width: 1200, height: 630, alt: "Mortgage Calculator — Dayblip" }],
  },
  twitter: { card: "summary_large_image", images: ["https://www.dayblip.com/api/og?title=Mortgage+Calculator&emoji=%F0%9F%8F%A0&subtitle=Monthly+payments+%26+amortization+%E2%80%94+Free+calculator"] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
