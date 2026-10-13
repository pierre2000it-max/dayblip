import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What Is the 4% Rule and Does It Still Work in 2026? | Dayblip",
  description:
    "The 4% rule: multiply annual retirement spending by 25 to find your number. At $50,000 a year you need $1,250,000. Bengen's 1994 study explained.",
  alternates: {
    canonical: "https://www.dayblip.com/blog/what-is-the-4-percent-rule",
  },
  openGraph: {
    title: "What Is the 4% Rule and Does It Still Work in 2026?",
    description:
      "Multiply annual spending by 25. At $50K/year you need $1.25M. At $80K/year you need $2M. Social Security reduces the number you need.",
    url: "https://www.dayblip.com/blog/what-is-the-4-percent-rule",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
