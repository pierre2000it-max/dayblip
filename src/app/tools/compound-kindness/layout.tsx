import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compound Kindness Calculator — What Is Your Ripple Effect? | Dayblip",
  description: "Calculate the ripple effect of daily acts of kindness. See how your small actions could impact thousands.",
  keywords: "kindness ripple effect calculator, compound kindness, acts of kindness calculator",
  alternates: { canonical: "https://www.dayblip.com/tools/compound-kindness" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
