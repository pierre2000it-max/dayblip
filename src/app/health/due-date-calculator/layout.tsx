import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pregnancy Due Date Calculator — When Is My Baby Due? | Dayblip",
  description: "Calculate your pregnancy due date from your last menstrual period or conception date. See your trimester timeline and weekly milestones. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/health/due-date-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
