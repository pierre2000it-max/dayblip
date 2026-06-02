import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Generational Wealth Gap Calculator | Dayblip",
  description: "Compare your financial situation to where your parents were at your age. See the generational wealth gap in real numbers.",
  keywords: "generational wealth gap calculator, am I doing better than my parents, millennial wealth comparison",
  alternates: { canonical: "https://www.dayblip.com/tools/generational-wealth" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
