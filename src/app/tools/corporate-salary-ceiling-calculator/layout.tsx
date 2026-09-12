import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Corporate Salary Ceiling Calculator — What Is Your Career Actually Building?",
  description: "See the real math behind a corporate salary. Project your lifetime earnings, tax drag, and 401k growth to find the wealth gap hiding in plain sight.",
  keywords: "corporate salary ceiling calculator, lifetime salary projection, salary vs wealth calculator, 401k vs salary gap, financial independence calculator corporate",
  alternates: { canonical: "https://www.dayblip.com/tools/corporate-salary-ceiling-calculator" },
  openGraph: {
    title: "Corporate Salary Ceiling Calculator — What Is Your Career Actually Building?",
    description: "See the real math behind a corporate salary. Project your lifetime earnings, tax drag, and 401k growth to find the wealth gap hiding in plain sight.",
    url: "https://www.dayblip.com/tools/corporate-salary-ceiling-calculator",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Salary Ceiling Calculator — What Is Your Career Actually Building?",
    description: "See the real math behind a corporate salary. Project your lifetime earnings, tax drag, and 401k growth to find the wealth gap hiding in plain sight.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
