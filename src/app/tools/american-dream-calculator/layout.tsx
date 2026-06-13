import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "American Dream Calculator — How Long Until You Can Afford It? | Dayblip",
  description: "Calculate how long it will take you to achieve the American Dream based on your income and state. House cars kids retirement — see the real timeline. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/tools/american-dream-calculator" },
  openGraph: {
    title: "American Dream Calculator | Dayblip",
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
