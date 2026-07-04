import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Birthday Personality — Everything About Your Birthday",
  description: "Discover your star sign, Chinese zodiac, moon phase, birth flower, birthstone, life path number and more.",
  keywords: "birthday personality calculator, what does my birthday mean, birthday astrology calculator, birth date meaning",
  alternates: { canonical: "https://www.dayblip.com/tools/birthday-personality" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
