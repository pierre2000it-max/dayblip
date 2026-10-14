import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "When to Claim Social Security: Age 62, 67 or 70?",
  description:
    "Claiming at 62 pays 70% of your full benefit and 70 pays 124%. See the break-even ages and what the math leaves out. Free Social Security guide.",
  alternates: { canonical: "https://www.dayblip.com/blog/when-to-claim-social-security" },
  openGraph: {
    title: "When to Claim Social Security: Age 62, 67 or 70?",
    description: "At 70 the monthly check is 77% larger than at 62. The SSA rules, break-even ages and what break-even leaves out.",
    url: "https://www.dayblip.com/blog/when-to-claim-social-security",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
