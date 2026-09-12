import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Wealth Transfer Timeline — What Will You Leave Behind at 65 and 75?",
  description: "See your projected wealth at 65 and 75 based on what you are building today. Free educational tool from Generational Wealth 360.",
  keywords: "wealth transfer timeline calculator, generational wealth projection, wealth at 65 calculator, legacy wealth calculator, compound interest wealth projection",
  alternates: { canonical: "https://www.dayblip.com/tools/wealth-transfer-timeline" },
  openGraph: {
    title: "Wealth Transfer Timeline — What Will You Leave Behind at 65 and 75?",
    description: "See your projected wealth at 65 and 75 based on what you are building today. Free educational tool from Generational Wealth 360.",
    url: "https://www.dayblip.com/tools/wealth-transfer-timeline",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wealth Transfer Timeline — What Will You Leave Behind at 65 and 75?",
    description: "See your projected wealth at 65 and 75 based on what you are building today. Free educational tool from Generational Wealth 360.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
