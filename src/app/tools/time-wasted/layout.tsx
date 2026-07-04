import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Screen Time Calculator — What Could You Learn?",
  description: "Calculate how much time you spend on screens and discover what skills you could have learned instead.",
  keywords: "screen time calculator, what could I learn with my screen time, time wasted calculator",
  alternates: { canonical: "https://www.dayblip.com/tools/time-wasted" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
