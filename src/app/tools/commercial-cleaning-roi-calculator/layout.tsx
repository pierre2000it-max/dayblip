import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Commercial Cleaning ROI Calculator — What Is a Dirty Workspace Actually Costing You?",
  description: "Calculate the real cost of a dirty workspace. Enter your team size, wages, and space to see what professional cleaning returns in recovered productivity.",
  keywords: "commercial cleaning ROI calculator, office cleaning cost calculator, workplace productivity cleaning, cleaning service ROI business, commercial cleaning cost per square foot",
  alternates: { canonical: "https://www.dayblip.com/tools/commercial-cleaning-roi-calculator" },
  openGraph: {
    title: "Commercial Cleaning ROI Calculator — What Is a Dirty Workspace Actually Costing You?",
    description: "Calculate the real cost of a dirty workspace. Enter your team size, wages, and space to see what professional cleaning returns in recovered productivity.",
    url: "https://www.dayblip.com/tools/commercial-cleaning-roi-calculator",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Commercial Cleaning ROI Calculator — What Is a Dirty Workspace Actually Costing You?",
    description: "Calculate the real cost of a dirty workspace. Enter your team size, wages, and space to see what professional cleaning returns in recovered productivity.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
