import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Move-In/Out Cleaning Cost Calculator — What Should You Pay for a Move Clean?",
  description: "Estimate your move-in or move-out cleaning cost instantly. Enter your property size, condition, and location for a realistic price range.",
  keywords: "move out cleaning cost calculator, move in cleaning cost, end of tenancy cleaning price, post renovation cleaning estimate, how much does a move out clean cost",
  alternates: { canonical: "https://www.dayblip.com/tools/move-in-out-cleaning-cost-calculator" },
  openGraph: {
    title: "Move-In/Out Cleaning Cost Calculator — What Should You Pay for a Move Clean?",
    description: "Estimate your move-in or move-out cleaning cost instantly. Enter your property size, condition, and location for a realistic price range.",
    url: "https://www.dayblip.com/tools/move-in-out-cleaning-cost-calculator",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Move-In/Out Cleaning Cost Calculator — What Should You Pay for a Move Clean?",
    description: "Estimate your move-in or move-out cleaning cost instantly. Enter your property size, condition, and location for a realistic price range.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
