import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Moving Stress Calculator — How Much Is Your Move Actually Weighing on You?",
  description: "8 questions. Find out how much stress your move is carrying and what getting it out of your head and onto a list could change.",
  keywords: "moving stress calculator, moving stress score, how stressful is moving, moving checklist stress, moving anxiety quiz",
  alternates: { canonical: "https://www.dayblip.com/tools/moving-stress-calculator" },
  openGraph: {
    title: "Moving Stress Calculator — How Much Is Your Move Actually Weighing on You?",
    description: "8 questions. Find out how much stress your move is carrying and what getting it out of your head and onto a list could change.",
    url: "https://www.dayblip.com/tools/moving-stress-calculator",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moving Stress Calculator — How Much Is Your Move Actually Weighing on You?",
    description: "8 questions. Find out how much stress your move is carrying and what getting it out of your head and onto a list could change.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
