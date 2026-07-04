import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How Popular Was Your Name the Year You Were Born?",
  description:
    "The year you were born, how many other babies shared your name? Using 144 years of SSA data, here is what your birth year number actually tells you.",
  alternates: { canonical: "https://www.dayblip.com/blog/name-popularity" },
  openGraph: {
    title: "How Popular Was Your Name the Year You Were Born?",
    description: "Your 1-in-X number tells you your actual density among the people who grew up alongside you — not just your name's rank.",
    url: "https://www.dayblip.com/blog/name-popularity",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
