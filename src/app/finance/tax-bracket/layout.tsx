import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tax Bracket Calculator 2026 — What Is My Tax Bracket? | Dayblip",
  description: "Find your 2026 federal tax bracket and calculate your estimated tax bill. See exactly how each bracket applies to your income. Free tax calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/tax-bracket" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
