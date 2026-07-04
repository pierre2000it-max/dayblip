import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Time Zone Converter — Convert Any Time Zone Instantly",
  description: "Convert time between any two time zones instantly. Best meeting times for remote teams across New York, London, Tokyo and 400+ cities. Free — no signup ever.",
  alternates: { canonical: "https://www.dayblip.com/tools/timezone-converter" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
