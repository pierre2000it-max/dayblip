import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Debt Freedom Date Calculator — When Will I Be Debt Free? | Dayblip",
  description: "Find the exact date you will be completely debt free. Includes live countdown timer to your debt freedom date.",
  keywords: "debt freedom date, when will I be debt free, debt payoff countdown",
  alternates: { canonical: "https://www.dayblip.com/tools/debt-freedom" },
  openGraph: {
    title: "Debt Freedom Date Calculator — When Will I Be Debt Free? | Dayblip",
    description: "Find the exact date you will be completely debt free. Includes live countdown timer to your debt freedom date.",
    url: "https://www.dayblip.com/tools/debt-freedom",
    images: [{ url: "https://www.dayblip.com/api/og?title=Debt+Freedom+Date+Calculator&emoji=%F0%9F%94%93&subtitle=The+exact+date+you+become+debt+free+%E2%80%94+Free", width: 1200, height: 630, alt: "Debt Freedom Date Calculator — Dayblip" }],
  },
  twitter: { card: "summary_large_image", images: ["https://www.dayblip.com/api/og?title=Debt+Freedom+Date+Calculator&emoji=%F0%9F%94%93&subtitle=The+exact+date+you+become+debt+free+%E2%80%94+Free"] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
