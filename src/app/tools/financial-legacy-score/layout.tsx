import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Financial Legacy Score — How Ready Is Your Family for What You Leave Behind?",
  description: "9 questions. Find out how prepared you are to build and transfer wealth to the next generation. Free educational tool from GW360.",
  keywords: "financial legacy score quiz, generational wealth quiz, estate planning readiness, legacy wealth assessment, financial preparedness quiz",
  alternates: { canonical: "https://www.dayblip.com/tools/financial-legacy-score" },
  openGraph: {
    title: "Financial Legacy Score — How Ready Is Your Family for What You Leave Behind?",
    description: "9 questions. Find out how prepared you are to build and transfer wealth to the next generation. Free educational tool from GW360.",
    url: "https://www.dayblip.com/tools/financial-legacy-score",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Financial Legacy Score — How Ready Is Your Family for What You Leave Behind?",
    description: "9 questions. Find out how prepared you are to build and transfer wealth to the next generation. Free educational tool from GW360.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
