import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How Much House Can You Actually Afford?",
  description:
    "Lenders approve based on what you can technically repay. That is not the same as what you can comfortably afford. Here is how to find your real number.",
  alternates: { canonical: "https://www.dayblip.com/blog/how-much-house-can-you-afford" },
  openGraph: {
    title: "How Much House Can You Actually Afford?",
    description: "The number banks give you and your comfortable budget are two different numbers. Most buyers confuse them and spend 30 years feeling it.",
    url: "https://www.dayblip.com/blog/how-much-house-can-you-afford",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
