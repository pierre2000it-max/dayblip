import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Roth IRA vs Traditional IRA: The Decision That Comes Down to One Question | Dayblip",
  description:
    "The Roth vs traditional IRA decision reduces to a single factor: whether your tax rate will be higher now or in retirement. Here is how to figure out which applies to you.",
  alternates: { canonical: "https://www.dayblip.com/blog/roth-ira-vs-traditional-ira" },
  openGraph: {
    title: "Roth IRA vs Traditional IRA: The Decision That Comes Down to One Question",
    description: "Both accounts grow tax-advantaged. The difference is when you pay taxes. Getting that timing decision right can be worth tens of thousands.",
    url: "https://www.dayblip.com/blog/roth-ira-vs-traditional-ira",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
