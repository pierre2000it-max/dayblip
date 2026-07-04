import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chinese Zodiac Calculator — Your Animal Sign and Meaning",
  description: "Find your Chinese zodiac animal sign based on your birth year. Discover your personality traits compatibility and lucky numbers. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/curiosity/chinese-zodiac" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
