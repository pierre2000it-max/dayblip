import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Finance Calculators — Free Financial Planning Tools",
  description: "Free financial calculators for compound interest, mortgage payments, retirement savings, debt payoff and more. No signup required.",
  alternates: { canonical: "https://www.dayblip.com/finance" },
  openGraph: {
    title: "Finance Calculators — Free Financial Planning Tools",
    description: "Free financial calculators for compound interest, mortgage payments, retirement savings, debt payoff and more. No signup required.",
    type: "website",
    url: "https://www.dayblip.com/finance",
    images: [{ url: "/api/og?title=Finance+Calculators&emoji=💰&subtitle=Free+tools+to+grow+and+protect+your+money", width: 1200, height: 630, alt: "Finance Calculators" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance Calculators — Free Financial Planning Tools",
    description: "Free financial calculators for compound interest, mortgage payments, retirement savings, debt payoff and more. No signup required.",
    images: ["/api/og?title=Finance+Calculators&emoji=💰&subtitle=Free+tools+to+grow+and+protect+your+money"],
  },
}

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
