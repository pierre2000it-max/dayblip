import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Financial Independence Date — When Can You Stop Working? | Dayblip",
  description: "Find the exact date you could achieve financial independence. Includes live countdown to your FI date and FIRE calculator.",
  alternates: { canonical: "https://www.dayblip.com/tools/fi-date" },
  openGraph: {
    title: "Financial Independence Date — When Can You Stop Working? | Dayblip",
    description: "Find the exact date you could achieve financial independence. Includes live countdown to your FI date.",
    url: "https://www.dayblip.com/tools/fi-date",
    images: [{ url: "/api/og?title=Financial+Independence+Date&emoji=%F0%9F%8F%84&subtitle=Find+the+exact+date+you+can+stop+working+%E2%80%94+Free", width: 1200, height: 630, alt: "Financial Independence Date — Dayblip" }],
  },
  twitter: { card: "summary_large_image" },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
