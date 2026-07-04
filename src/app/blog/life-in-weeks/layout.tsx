import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your Life as a Grid of Squares — The Life in Weeks Visualization",
  description:
    "Each square is one week. The filled ones are gone. Seeing a finite number of empty squares does something that knowing the number does not.",
  alternates: { canonical: "https://www.dayblip.com/blog/life-in-weeks" },
  openGraph: {
    title: "Your Life as a Grid of Squares",
    description: "A 90-year life is 4,680 weeks. At 35, about 1,820 are already filled.",
    url: "https://www.dayblip.com/blog/life-in-weeks",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
