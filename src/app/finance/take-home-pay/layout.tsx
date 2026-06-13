import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Take Home Pay Calculator — Paycheck After Tax | Dayblip",
  description: "Calculate your actual take-home pay after federal tax, state tax, Social Security, Medicare and 401k deductions. All 50 states. Free paycheck calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/take-home-pay" },
  openGraph: {
    title: "Take Home Pay Calculator — Paycheck After Tax | Dayblip",
    description: "Calculate your actual take-home pay after federal tax, state tax, Social Security, Medicare and 401k deductions. All 50 states.",
    url: "https://www.dayblip.com/finance/take-home-pay",
    images: [{ url: "https://www.dayblip.com/api/og?title=Take+Home+Pay+Calculator&emoji=%F0%9F%92%B5&subtitle=Your+exact+net+pay+after+all+taxes+%E2%80%94+All+50+states", width: 1200, height: 630, alt: "Take Home Pay Calculator — Dayblip" }],
  },
  twitter: { card: "summary_large_image", images: ["https://www.dayblip.com/api/og?title=Take+Home+Pay+Calculator&emoji=%F0%9F%92%B5&subtitle=Your+exact+net+pay+after+all+taxes+%E2%80%94+All+50+states"] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
