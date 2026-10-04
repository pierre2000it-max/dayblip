import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "World Population Live Counter 2026",
  description: "Watch the world population counter tick live. About 8.2 billion people, with births and deaths updating each second from UN data. Free, no signup required.",
  alternates: { canonical: "https://www.dayblip.com/world-counters/population" },
  openGraph: {
    title: "World Population Live Counter 2026",
    description: "Watch the world population counter tick live. About 8.2 billion people, with births and deaths updating each second from UN data. Free, no signup required.",
    url: "https://www.dayblip.com/world-counters/population",
  },
  twitter: { card: "summary_large_image" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
