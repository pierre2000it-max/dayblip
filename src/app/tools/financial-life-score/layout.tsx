import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Financial Life Score",
  description: "Get your Financial Life Score from 0 to 100. Answer 10 questions about savings, debt, retirement and income. See where to improve. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/tools/financial-life-score" },
  openGraph: {
    title: "Financial Life Score",
    description: "Get your personal Financial Life Score from 0 to 100 in 2 minutes.",
    url: "https://www.dayblip.com/tools/financial-life-score",
    images: [{ url: "https://www.dayblip.com/api/og/life-score?score=73&zone=Financial+Strong+Zone&v=2", width: 1200, height: 630, alt: "Financial Life Score — Dayblip" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.dayblip.com/api/og/life-score?score=73&zone=Financial+Strong+Zone&v=2"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
