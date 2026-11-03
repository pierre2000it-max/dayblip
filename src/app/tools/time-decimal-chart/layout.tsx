import type { Metadata } from "next"

const URL = "https://www.dayblip.com/tools/time-decimal-chart"
const TITLE = "Time Decimal Chart: Minutes to Decimal Hours"
const DESCRIPTION = "Convert minutes to decimal hours with a full 1 to 59 minute chart and a calculator. 15 minutes is 0.25 hours. Free, no signup required."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL },
  twitter: { card: "summary_large_image" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
