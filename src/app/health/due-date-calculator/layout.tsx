import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pregnancy Due Date Calculator — When Is My Baby Due? | Dayblip",
  description: "Calculate your pregnancy due date from your last menstrual period or conception date. See your trimester timeline and weekly milestones. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/health/due-date-calculator" },
  openGraph: {
    title: "Pregnancy Due Date Calculator — When Is My Baby Due? | Dayblip",
    description: "Calculate your pregnancy due date from your last menstrual period or conception date.",
    url: "https://www.dayblip.com/health/due-date-calculator",
    images: [{ url: "https://www.dayblip.com/api/og?title=Pregnancy+Due+Date+Calculator&emoji=%F0%9F%91%B6&subtitle=Calculate+your+due+date+and+trimester+timeline+%E2%80%94+Free", width: 1200, height: 630, alt: "Pregnancy Due Date Calculator — Dayblip" }],
  },
  twitter: { card: "summary_large_image", images: ["https://www.dayblip.com/api/og?title=Pregnancy+Due+Date+Calculator&emoji=%F0%9F%91%B6&subtitle=Calculate+your+due+date+and+trimester+timeline+%E2%80%94+Free"] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
