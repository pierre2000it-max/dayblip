import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "New Baby Overwhelm Index — How Much Are You Actually Carrying Right Now?",
  description: "9 questions. Find out how much of the new baby load you are carrying alone and what a shared household system could take off your plate.",
  keywords: "new baby overwhelm quiz, new parent stress score, postpartum mental load, new baby stress calculator, new parent overwhelm index",
  alternates: { canonical: "https://www.dayblip.com/tools/new-baby-overwhelm-index" },
  openGraph: {
    title: "New Baby Overwhelm Index — How Much Are You Actually Carrying Right Now?",
    description: "9 questions. Find out how much of the new baby load you are carrying alone and what a shared household system could take off your plate.",
    url: "https://www.dayblip.com/tools/new-baby-overwhelm-index",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Baby Overwhelm Index — How Much Are You Actually Carrying Right Now?",
    description: "9 questions. Find out how much of the new baby load you are carrying alone and what a shared household system could take off your plate.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
