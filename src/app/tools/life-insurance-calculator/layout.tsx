import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Life Insurance Calculator — How Much Life Insurance Do I Need? | Dayblip",
  description:
    "Calculate exactly how much life insurance coverage you need based on income dependents debts and future expenses. Free life insurance need calculator. No signup ever.",
  alternates: { canonical: "https://www.dayblip.com/tools/life-insurance-calculator" },
  openGraph: {
    title: "Life Insurance Calculator | Dayblip",
    description:
      "Calculate how much life insurance you need using the DIME method. Free. No signup.",
    url: "https://www.dayblip.com/tools/life-insurance-calculator",
    type: "website",
    images: [{ url: "/api/og?title=Life+Insurance+Calculator&emoji=%F0%9F%9B%A1%EF%B8%8F&subtitle=How+much+life+insurance+do+you+need%3F+%E2%80%94+Free", width: 1200, height: 630, alt: "Life Insurance Calculator — Dayblip" }],
  },
  twitter: { card: "summary_large_image" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
