import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Side Hustle Income Calculator — What Could You Earn? | Dayblip",
  description: "Find your ideal side hustle based on your skills and time. Calculate realistic monthly income potential. Free.",
  alternates: { canonical: "https://www.dayblip.com/tools/side-hustle" },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
