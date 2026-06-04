import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Early vs Late Saver Calculator — Who Wins? | Dayblip",
  description: "See why starting to save earlier with less money beats starting later with more. The power of compound interest visualized. Free calculator.",
  keywords: ["early vs late saver calculator", "power of compound interest", "when to start saving calculator", "compound interest time calculator"],
  alternates: { canonical: "https://www.dayblip.com/tools/early-vs-late" },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
