import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Entrepreneur vs Employee Wealth Gap — What Is the Real Cost of Staying Employed?",
  description: "Compare your lifetime earnings as an employee versus building your own business. See the wealth gap the math reveals over your working years. Free tool.",
  keywords: "entrepreneur vs employee calculator, wealth gap calculator, cost of staying employed, business owner vs salary, entrepreneurship wealth comparison",
  alternates: { canonical: "https://www.dayblip.com/tools/entrepreneur-vs-employee-wealth-gap" },
  openGraph: {
    title: "Entrepreneur vs Employee Wealth Gap — What Is the Real Cost of Staying Employed?",
    description: "Compare your lifetime earnings as an employee versus building your own business. See the wealth gap the math reveals over your working years.",
    url: "https://www.dayblip.com/tools/entrepreneur-vs-employee-wealth-gap",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Entrepreneur vs Employee Wealth Gap — What Is the Real Cost of Staying Employed?",
    description: "Compare your lifetime earnings as an employee versus building your own business. See the wealth gap the math reveals over your working years.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
