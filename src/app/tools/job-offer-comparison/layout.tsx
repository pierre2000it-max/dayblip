import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Job Offer Comparison Calculator — Which Offer Is Really Worth More? | Dayblip",
  description:
    "Compare two job offers side by side. See true annual value after taxes commute costs benefits and time. Find which offer actually pays more. Free. No signup ever.",
  alternates: { canonical: "https://www.dayblip.com/tools/job-offer-comparison" },
  openGraph: {
    title: "Job Offer Comparison Calculator — Which Offer Is Really Worth More? | Dayblip",
    description:
      "Compare two job offers side by side. See true annual value after taxes commute costs benefits and time.",
    url: "https://www.dayblip.com/tools/job-offer-comparison",
    type: "website",
    images: [{ url: "/api/og?title=Job+Offer+Comparison+Calculator&emoji=%F0%9F%92%BC&subtitle=Which+offer+actually+pays+more%3F+%E2%80%94+Free", width: 1200, height: 630, alt: "Job Offer Comparison Calculator — Dayblip" }],
  },
  twitter: { card: "summary_large_image" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
