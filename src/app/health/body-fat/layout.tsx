import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Body Fat Calculator — Calculate Your Body Fat Percentage | Dayblip",
  description: "Calculate your body fat percentage using the US Navy method. No calipers needed — just height weight neck and waist measurements. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/health/body-fat" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
