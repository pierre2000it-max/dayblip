import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Phone Upgrade Calculator — True Cost of Upgrading Every Year",
  description: "Calculate the true cost of upgrading your phone every year vs every 3 years. See the investment opportunity cost. Free phone upgrade calculator.",
  alternates: { canonical: "https://www.dayblip.com/curiosity/phone-upgrade" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
