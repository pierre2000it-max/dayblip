import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Will AI Replace My Job? What the Data Actually Shows",
  description:
    "AI replacement risk correlates with task type, not salary or education. Data entry scores 95/100. Plumbers score 10/100. Here is why.",
  alternates: { canonical: "https://www.dayblip.com/blog/will-ai-replace-my-job" },
  openGraph: {
    title: "Will AI Replace My Job? What the Data Actually Shows",
    description: "AI replacement risk is about task type — not your salary or education level.",
    url: "https://www.dayblip.com/blog/will-ai-replace-my-job",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
