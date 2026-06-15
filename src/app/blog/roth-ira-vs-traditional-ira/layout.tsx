import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Roth IRA vs Traditional IRA: The Decision That Comes Down to One Question | Dayblip",
  description:
    "Roth vs traditional IRA comes down to one question: will your tax rate be higher now or in retirement? Here is how to decide.",
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
