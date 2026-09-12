import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ADHD Productivity Score — Find Out How Your Brain Handles Tasks",
  description: "8 questions. Instant results. Find out where your brain loses momentum and what kind of system actually works for how you think. Free — no signup.",
  keywords: "ADHD productivity quiz, focus score, brain productivity test, task friction quiz, neurodivergent productivity",
  alternates: { canonical: "https://www.dayblip.com/tools/adhd-productivity-score" },
  openGraph: {
    title: "ADHD Productivity Score — Find Out How Your Brain Handles Tasks",
    description: "8 questions. Instant results. Find out where your brain loses momentum and what kind of system actually works for how you think.",
    url: "https://www.dayblip.com/tools/adhd-productivity-score",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADHD Productivity Score — Find Out How Your Brain Handles Tasks",
    description: "8 questions. Instant results. Find out where your brain loses momentum and what kind of system actually works for how you think.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
