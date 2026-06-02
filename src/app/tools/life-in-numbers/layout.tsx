import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your Life in Numbers — Live Life Statistics | Dayblip",
  description: "See your life in live statistics — heartbeats, breaths, steps and more all updating every second.",
  keywords: "life in numbers, heartbeats calculator, how many heartbeats in a lifetime, life statistics",
  alternates: { canonical: "https://www.dayblip.com/tools/life-in-numbers" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
