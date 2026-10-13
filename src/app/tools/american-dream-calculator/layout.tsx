import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "American Dream Calculator — How Long Until You Can Afford It?",
  description: "Find out how long the American Dream takes based on your income and state. See the timeline for a house, kids, and retirement. Free — no signup required.",
  alternates: { canonical: "https://www.dayblip.com/tools/american-dream-calculator" },
  openGraph: {
    title: "American Dream Calculator",
    description: "How long until you can afford the American Dream? Find out based on your income and state.",
    url: "https://www.dayblip.com/tools/american-dream-calculator",
    images: [{ url: "https://www.dayblip.com/api/og/american-dream?state=the+US&age=47&years=17&v=2", width: 1200, height: 630, alt: "American Dream Calculator — Dayblip" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.dayblip.com/api/og/american-dream?state=the+US&age=47&years=17&v=2"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
