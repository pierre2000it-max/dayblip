import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Entrepreneur vs Employee Wealth Gap Extended — The Full Financial Picture",
  description: "The advanced model. Compare lifetime wealth across the employee and entrepreneur paths including tax drag, reinvestment, and business equity growth.",
  keywords: "entrepreneur vs employee wealth gap extended, business owner vs employee wealth calculator, entrepreneur tax advantage calculator, business equity vs 401k, financial independence entrepreneur",
  alternates: { canonical: "https://www.dayblip.com/tools/entrepreneur-vs-employee-wealth-gap-extended" },
  openGraph: {
    title: "Entrepreneur vs Employee Wealth Gap Extended — The Full Financial Picture",
    description: "The advanced model. Compare lifetime wealth across the employee and entrepreneur paths including tax drag, reinvestment, and business equity growth.",
    url: "https://www.dayblip.com/tools/entrepreneur-vs-employee-wealth-gap-extended",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Entrepreneur vs Employee Wealth Gap Extended — The Full Financial Picture",
    description: "The advanced model. Compare lifetime wealth across the employee and entrepreneur paths including tax drag, reinvestment, and business equity growth.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
