import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Generation Salary Comparison — Compare Your Salary to Your Parents at the Same Age | Dayblip",
  description:
    "Compare your salary and financial situation to your parents at the same age. See if your generation is doing better or worse adjusted for inflation and cost of living. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/tools/generation-compare" },
  openGraph: {
    title: "Generation Salary Comparison | Dayblip",
    description:
      "Are you doing better or worse than your parents at the same age? Compare salaries and home affordability across generations.",
    url: "https://www.dayblip.com/tools/generation-compare",
    type: "website",
    images: [{ url: "/api/og/generation?diff=18&direction=less&homeRatio=7.6&parentRatio=2.8", width: 1200, height: 630, alt: "Generation Salary Comparison — Dayblip" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/api/og/generation?diff=18&direction=less&homeRatio=7.6&parentRatio=2.8"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
