import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Emergency Fund Calculator — How Much Do You Need? | Dayblip",
  description: "Calculate your recommended emergency fund size based on expenses and job security. See a savings timeline to reach your goal. Free calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/emergency-fund" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
