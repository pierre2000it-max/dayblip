import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Music of Your Birth Year",
  description: "Discover the #1 song and music era from the year you were born. Includes Spotify and YouTube links.",
  keywords: "music of my birth year, number one song when I was born, music era calculator",
  alternates: { canonical: "https://www.dayblip.com/tools/music-of-your-year" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
