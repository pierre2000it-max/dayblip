import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Family Mental Load Score — How Much of Your Household Lives in Your Head?",
  description: "10 questions. Find out how much of your household you are carrying alone and what a shared system could change. Free — no signup required.",
  keywords: "family mental load quiz, household mental load, invisible labor quiz, household management score, mental load of motherhood",
  alternates: { canonical: "https://www.dayblip.com/tools/family-mental-load-score" },
  openGraph: {
    title: "Family Mental Load Score — How Much of Your Household Lives in Your Head?",
    description: "10 questions. Find out how much of your household you are carrying alone and what a shared system could change.",
    url: "https://www.dayblip.com/tools/family-mental-load-score",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Family Mental Load Score — How Much of Your Household Lives in Your Head?",
    description: "10 questions. Find out how much of your household you are carrying alone and what a shared system could change.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
