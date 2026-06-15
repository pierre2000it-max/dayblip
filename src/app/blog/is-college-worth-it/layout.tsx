import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Is College Worth It in 2026? The ROI Calculation Most People Never Run | Dayblip",
  description:
    "Is a college degree worth the cost? We ran the numbers on ROI by major, debt load, and career path. The answer depends on what you study.",
  alternates: { canonical: "https://www.dayblip.com/blog/is-college-worth-it" },
  openGraph: {
    title: "Is College Worth It in 2026? The ROI Calculation Most People Never Run",
    description: "Computer science majors start at $75K–$100K+. Bootcamp grads at $55K–$70K. Average debt $29,400. The math on college ROI is more nuanced than both sides admit.",
    url: "https://www.dayblip.com/blog/is-college-worth-it",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
