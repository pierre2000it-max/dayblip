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
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
