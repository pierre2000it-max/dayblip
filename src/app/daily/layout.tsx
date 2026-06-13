import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dayblip Daily — Financial Puzzle of the Day | Free Daily Money Quiz",
  description:
    "One financial puzzle every day. Test your money knowledge in under 2 minutes. Free daily financial trivia challenge. No signup ever. Share your score.",
  alternates: { canonical: "https://www.dayblip.com/daily" },
  openGraph: {
    title: "Dayblip Daily — Today's Financial Puzzle",
    description:
      "One financial puzzle every day. Test your money knowledge in under 2 minutes. Free. No signup.",
    url: "https://www.dayblip.com/daily",
    type: "website",
    images: [{ url: "https://www.dayblip.com/api/og/daily?day=1&correct=true&streak=1", width: 1200, height: 630, alt: "Dayblip Daily Financial Challenge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.dayblip.com/api/og/daily?day=1&correct=true&streak=1"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
