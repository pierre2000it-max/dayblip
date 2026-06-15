import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Trees Cut Down Today — Live Counter | Dayblip",
  description: "Watch the live count of trees cut down today worldwide. Based on 15 billion trees felled per year. See how many are planted vs cut. Free real-time counter.",
  alternates: { canonical: "https://www.dayblip.com/world-counters/trees-cut-today" },
  openGraph: {
    title: "Trees Cut Down Today — Live Counter | Dayblip",
    description: "Live counter of trees cut down today. 15 billion per year — ~475 every second. See the net loss in real time.",
    url: "https://www.dayblip.com/world-counters/trees-cut-today",
  },
  twitter: { card: "summary_large_image" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
