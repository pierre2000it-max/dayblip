import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Car Upgrade Opportunity Cost Calculator | Dayblip",
  description: "Calculate the true long-term cost of buying a nicer car. See what the upgrade difference could be worth if invested instead. Educational calculator.",
  alternates: { canonical: "https://www.dayblip.com/curiosity/car-upgrade" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
