import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lead Response Time Cost Calculator — Apex AI Pilot",
  description: "Find out how much revenue you lose every month from slow lead follow-up. Enter your leads, deal value, and response time. Free — no signup required.",
  keywords: "lead response time calculator, cost of slow lead follow-up, speed to lead revenue loss, lead conversion calculator",
  alternates: { canonical: "https://www.dayblip.com/tools/lead-response-cost-calculator" },
  openGraph: {
    title: "Lead Response Time Cost Calculator — Apex AI Pilot",
    description: "Find out how much revenue you lose every month from slow lead follow-up. Free calculator for small service businesses.",
    url: "https://www.dayblip.com/tools/lead-response-cost-calculator",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lead Response Time Cost Calculator — Apex AI Pilot",
    description: "Find out how much revenue you lose every month from slow lead follow-up. Free calculator for small service businesses.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
