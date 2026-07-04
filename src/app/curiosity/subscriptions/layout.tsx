import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Subscription Opportunity Cost Calculator",
  description: "See what your Netflix, Spotify, and streaming subscriptions could be worth if invested instead. Free subscription cost calculator.",
  alternates: { canonical: "https://www.dayblip.com/curiosity/subscriptions" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
