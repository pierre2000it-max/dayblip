import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Financial Life Score | Dayblip",
  description: "Get your Financial Life Score from 0 to 100. Answer 10 questions about savings, debt, retirement and income. See where to improve. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/tools/financial-life-score" },
  openGraph: {
    title: "Financial Life Score | Dayblip",
    description: "Get your personal Financial Life Score from 0 to 100 in 2 minutes.",
    url: "https://www.dayblip.com/tools/financial-life-score",
    images: [{ url: "/api/og/life-score?score=73&zone=Financial+Strong+Zone", width: 1200, height: 630, alt: "Financial Life Score — Dayblip" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/api/og/life-score?score=73&zone=Financial+Strong+Zone"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
