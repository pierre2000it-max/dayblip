import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Subscription Opportunity Cost Calculator | Dayblip",
  description: "See what your Netflix, Spotify and streaming subscriptions could be worth if invested in the S&P 500 instead. Educational calculator. Not investment advice.",
  alternates: { canonical: "https://www.dayblip.com/curiosity/subscriptions" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
