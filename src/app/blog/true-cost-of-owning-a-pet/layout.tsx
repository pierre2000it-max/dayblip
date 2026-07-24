import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The True Annual Cost of Owning a Dog or Cat in 2026 | Dayblip",
  description:
    "Dog ownership costs $1,390-$5,295 per year and $34,550 over a lifetime per Rover 2025 data. Cat ownership costs $760-$3,495 per year and $32,170 over a lifetime. The full breakdown including the costs most new owners miss.",
  alternates: {
    canonical: "https://www.dayblip.com/blog/true-cost-of-owning-a-pet",
  },
  openGraph: {
    title: "The True Annual Cost of Owning a Dog or Cat in 2026",
    description:
      "Dog: $1,390-$5,295/year and $34,550 lifetime. Cat: $760-$3,495/year and $32,170 lifetime. Vet fees up 11% in 2025. The costs most new owners never budget for.",
    url: "https://www.dayblip.com/blog/true-cost-of-owning-a-pet",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
