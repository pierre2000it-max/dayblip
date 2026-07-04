import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Salary Checker — Am I Being Paid Fairly?",
  description: "Check if your salary matches market rates for your role, experience and location. Free salary transparency tool.",
  keywords: "am I underpaid, salary checker, market rate salary, fair salary calculator",
  alternates: { canonical: "https://www.dayblip.com/tools/salary-checker" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
