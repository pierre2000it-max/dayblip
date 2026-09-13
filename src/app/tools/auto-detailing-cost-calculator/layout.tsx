import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Auto Detailing Cost Calculator — What Should You Pay to Detail Your Car?",
  description: "Estimate your auto detailing cost instantly. Enter your vehicle type, service, and condition for a realistic price range — basic wash to ceramic coating.",
  keywords: "auto detailing cost calculator, how much does car detailing cost, ceramic coating price estimate, paint correction cost, full detail price, car wash vs detailing cost",
  alternates: { canonical: "https://www.dayblip.com/tools/auto-detailing-cost-calculator" },
  openGraph: {
    title: "Auto Detailing Cost Calculator — What Should You Pay to Detail Your Car?",
    description: "Estimate your auto detailing cost instantly. Enter your vehicle type, service, and condition for a realistic price range — basic wash to ceramic coating.",
    url: "https://www.dayblip.com/tools/auto-detailing-cost-calculator",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auto Detailing Cost Calculator — What Should You Pay to Detail Your Car?",
    description: "Estimate your auto detailing cost instantly. Enter your vehicle type, service, and condition for a realistic price range — basic wash to ceramic coating.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
