import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The True Financial Value of Working From Home",
  description:
    "Remote work can save a car commuter about $12,700 a year on stated assumptions. See the commute, meals, clothing and hybrid math. Free WFH calculator.",
  alternates: { canonical: "https://www.dayblip.com/blog/wfh-financial-value" },
  openGraph: {
    title: "The True Financial Value of Working From Home",
    description: "A car commuter can save about $12,700 a year working remotely. See the commute, meals, clothing and hybrid math, with every assumption stated.",
    url: "https://www.dayblip.com/blog/wfh-financial-value",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
