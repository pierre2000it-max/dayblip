import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "True Cost of Smoking Calculator — Financial and Health Cost",
  description: "Calculate the true financial cost of smoking including what your cigarette money could have been worth if invested. Free smoking cost calculator.",
  keywords: ["true cost of smoking calculator", "smoking financial cost calculator", "cigarette cost calculator", "how much have I spent on cigarettes"],
  alternates: { canonical: "https://www.dayblip.com/tools/smoking-cost" },
  openGraph: {
    title: "True Cost of Smoking Calculator — Financial and Health Cost",
    description: "Calculate the true financial cost of smoking including what your cigarette money could have been worth if invested. Free smoking cost calculator.",
    type: "website",
    url: "https://www.dayblip.com/tools/smoking-cost",
    images: [{ url: "/api/og?title=True+Cost+of+Smoking&emoji=🚬&subtitle=Full+financial+%26+lifetime+cost+revealed", width: 1200, height: 630, alt: "True Cost of Smoking" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "True Cost of Smoking Calculator — Financial and Health Cost",
    description: "Calculate the true financial cost of smoking including what your cigarette money could have been worth if invested. Free smoking cost calculator.",
    images: ["/api/og?title=True+Cost+of+Smoking&emoji=🚬&subtitle=Full+financial+%26+lifetime+cost+revealed"],
  },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
