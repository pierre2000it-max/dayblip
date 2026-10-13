import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reading Time Calculator — How Long to Read Any Text",
  description: "Calculate how long it takes to read any article, book, or document. Paste text for instant reading time and word count. Free — no signup required.",
  alternates: { canonical: "https://www.dayblip.com/tools/reading-time" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
