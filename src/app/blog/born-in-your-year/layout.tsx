import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What the World Looked Like the Year You Were Born",
  description:
    "Birth year facts hit differently when connected to your own existence. Gas prices, the number one song, world population — all from the year you arrived.",
  alternates: { canonical: "https://www.dayblip.com/blog/born-in-your-year" },
  openGraph: {
    title: "What the World Looked Like the Year You Were Born",
    description: "Birth year data becomes personal history rather than trivia when connected to your existence.",
    url: "https://www.dayblip.com/blog/born-in-your-year",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
