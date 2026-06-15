import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The True Financial Value of Working From Home — What the Numbers Actually Show | Dayblip",
  description:
    "Working from home saves the average commuter $12,317 per year. Here is the full calculation including time, gas, food, and clothing.",
  alternates: { canonical: "https://www.dayblip.com/blog/wfh-financial-value" },
  openGraph: {
    title: "The True Financial Value of Working From Home",
    description: "The average car commuter saves $12,317 per year working remotely. Here is the full breakdown of commute, meals, clothing, and what that money becomes when invested.",
    url: "https://www.dayblip.com/blog/wfh-financial-value",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
