import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Music of Your Birth Year",
  description: "Discover the number one song and the music era from the year you were born, with Spotify and YouTube links. Free — no signup required.",
  keywords: "music of my birth year, number one song when I was born, music era calculator",
  alternates: { canonical: "https://www.dayblip.com/tools/music-of-your-year" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
