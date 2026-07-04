import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Latte Factor Calculator — What Is Your Coffee Really Costing?",
  description: "Calculate the latte factor — what your daily coffee could be worth if invested over 30 years. Includes balanced perspective. Educational only.",
  alternates: { canonical: "https://www.dayblip.com/curiosity/latte-factor" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
