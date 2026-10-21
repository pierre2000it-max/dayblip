import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The True Annual Cost of Owning a Dog or Cat in 2026",
  description:
    "An adult dog costs $1,930 to $5,305 a year per Rover 2026. Lifetime cost is about $34,550 for a dog. See the costs new owners miss.",
  alternates: {
    canonical: "https://www.dayblip.com/blog/true-cost-of-owning-a-pet",
  },
  openGraph: {
    title: "The True Annual Cost of Owning a Dog or Cat in 2026",
    description:
      "Adult dog: $1,930-$5,305/year per Rover 2026. Lifetime: $34,550 dog, $32,170 cat. Vet fees up 11% in 2025. Costs new owners never budget for.",
    url: "https://www.dayblip.com/blog/true-cost-of-owning-a-pet",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
