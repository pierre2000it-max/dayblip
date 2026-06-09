import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Numerology Calculator — Your Life Path Number and Meaning | Dayblip",
  description: "Calculate your numerology life path number expression number and soul urge number from your birth date and name. Discover what your numbers mean. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/curiosity/numerology" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
