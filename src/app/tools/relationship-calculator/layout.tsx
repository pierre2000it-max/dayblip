import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Relationship Cost Calculator — True Cost of Wedding Divorce and Having a Baby",
  description:
    "Calculate the real financial cost of a wedding divorce having a child or getting married. See what each major relationship decision actually costs and the opportunity cost. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/tools/relationship-calculator" },
  openGraph: {
    title: "Relationship Cost Calculator",
    description:
      "Calculate the real financial cost of a wedding divorce having a child or getting married.",
    url: "https://www.dayblip.com/tools/relationship-calculator",
    type: "website",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
