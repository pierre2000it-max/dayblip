import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Financial Independence Date — When Can You Stop Working? | Dayblip",
  description: "Find the exact date you could achieve financial independence. Includes live countdown to your FI date and FIRE calculator.",
  alternates: { canonical: "https://www.dayblip.com/tools/fi-date" },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
