import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Salary Ceiling Calculator — What Is Your Salary Really Costing You?",
  description: "Calculate the true cost of staying employed. See the gap between your lifetime salary and what that same money could build as invested wealth. Free tool.",
  keywords: "salary ceiling calculator, cost of staying employed, salary vs investing, wealth gap calculator, retire by 50 calculator",
  alternates: { canonical: "https://www.dayblip.com/tools/salary-ceiling-calculator" },
  openGraph: {
    title: "Salary Ceiling Calculator — What Is Your Salary Really Costing You?",
    description: "Calculate the true cost of staying employed. See the gap between your lifetime salary and what that same money could build as invested wealth.",
    url: "https://www.dayblip.com/tools/salary-ceiling-calculator",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary Ceiling Calculator — What Is Your Salary Really Costing You?",
    description: "Calculate the true cost of staying employed. See the gap between your lifetime salary and what that same money could build as invested wealth.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
