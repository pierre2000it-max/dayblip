import type { Metadata } from "next"

const URL = "https://www.dayblip.com/world-counters/deaths-today"
const TITLE = "Deaths Today: Live Global Death Counter"
const DESCRIPTION = "See how many people have died worldwide today, live. About 2 deaths every second, from UN data on 63.1 million yearly deaths. Free, no signup required."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL },
  twitter: { card: "summary_large_image" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
