import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How to Negotiate Your Salary — And Why Most People Never Do | Dayblip",
  description:
    "55–60% of workers never negotiate their starting salary. Starting $8,000 below market rate compounds to a $300,000 career earnings gap.",
  alternates: { canonical: "https://www.dayblip.com/blog/salary-negotiation-guide" },
  openGraph: {
    title: "How to Negotiate Your Salary — And Why Most People Never Do",
    description: "Starting $8,000 below market rate = $300,000 career earnings gap over 30 years.",
    url: "https://www.dayblip.com/blog/salary-negotiation-guide",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
