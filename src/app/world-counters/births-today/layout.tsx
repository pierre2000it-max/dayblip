import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Births Today: Live Global Birth Counter",
  description: "See how many babies are born worldwide today. The counter updates every 0.24 seconds from UN data on 132.4 million yearly births. Free, no signup required.",
  alternates: { canonical: "https://www.dayblip.com/world-counters/births-today" },
  openGraph: {
    title: "Births Today: Live Global Birth Counter",
    description: "See how many babies are born worldwide today. The counter updates every 0.24 seconds from UN data on 132.4 million yearly births. Free, no signup required.",
    url: "https://www.dayblip.com/world-counters/births-today",
  },
  twitter: { card: "summary_large_image" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
