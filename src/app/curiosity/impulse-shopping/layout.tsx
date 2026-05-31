import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Impulse Shopping Calculator — What Is It Costing Your Future? | Dayblip",
  description: "Calculate the true cost of impulse shopping. See what investing instead could be worth over 25 years. Toggle categories to customize. Educational only.",
  alternates: { canonical: "https://www.dayblip.com/curiosity/impulse-shopping" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
