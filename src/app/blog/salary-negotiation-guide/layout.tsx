import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How to Negotiate Your Salary — And Why Most People Never Do",
  description:
    "Starting $8,000 below market rate compounds to a $380,000 pre-tax career earnings gap over 30 years at 3% raises. Free negotiation guide and scripts.",
  alternates: { canonical: "https://www.dayblip.com/blog/salary-negotiation-guide" },
  openGraph: {
    title: "How to Negotiate Your Salary — And Why Most People Never Do",
    description: "Starting $8,000 below market rate = $380,000 pre-tax career earnings gap over 30 years.",
    url: "https://www.dayblip.com/blog/salary-negotiation-guide",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
