import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compound Interest Calculator — Watch Your Money Grow | Dayblip",
  description: "Calculate how investments grow with compound interest. See year-by-year balance, total interest earned, and the power of starting early.",
  alternates: { canonical: "https://www.dayblip.com/finance/compound-interest" },
  openGraph: {
    title: "Compound Interest Calculator — Watch Your Money Grow | Dayblip",
    description: "Calculate how investments grow with compound interest. See year-by-year balance with monthly contributions. Includes Rule of 72.",
    url: "https://www.dayblip.com/finance/compound-interest",
    images: [{ url: "https://www.dayblip.com/api/og?title=Compound+Interest+Calculator&emoji=%F0%9F%93%88&subtitle=Watch+your+money+grow+year+by+year+%E2%80%94+Free&v=2", width: 1200, height: 630, alt: "Compound Interest Calculator — Dayblip" }],
  },
  twitter: { card: "summary_large_image", images: ["https://www.dayblip.com/api/og?title=Compound+Interest+Calculator&emoji=%F0%9F%93%88&subtitle=Watch+your+money+grow+year+by+year+%E2%80%94+Free&v=2"] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
