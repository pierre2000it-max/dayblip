import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Side Hustle Income Calculator — What Could You Earn?",
  description: "Find your ideal side hustle based on your skills and available time, and estimate realistic monthly income. Free side hustle finder — no signup required.",
  alternates: { canonical: "https://www.dayblip.com/tools/side-hustle" },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
