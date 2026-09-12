import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home Cleaning Cost Calculator — What Should You Pay for House Cleaning?",
  description: "Estimate your home cleaning cost in seconds. Enter your home size, cleaning type, and location to get a realistic price range for any budget.",
  keywords: "home cleaning cost calculator, house cleaning price estimate, how much does house cleaning cost, cleaning service cost calculator, deep clean cost estimate",
  alternates: { canonical: "https://www.dayblip.com/tools/home-cleaning-cost-calculator" },
  openGraph: {
    title: "Home Cleaning Cost Calculator — What Should You Pay for House Cleaning?",
    description: "Estimate your home cleaning cost in seconds. Enter your home size, cleaning type, and location to get a realistic price range for any budget.",
    url: "https://www.dayblip.com/tools/home-cleaning-cost-calculator",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Cleaning Cost Calculator — What Should You Pay for House Cleaning?",
    description: "Estimate your home cleaning cost in seconds. Enter your home size, cleaning type, and location to get a realistic price range for any budget.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
