import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Energy Level Task Matcher — Match Your Work to How You Actually Feel Right Now",
  description: "Pick your energy level and get a matched task list instantly. Stop forcing deep work when your brain is not there yet. Free — no signup required.",
  keywords: "energy level productivity, task matching energy, deep work when to do it, low energy productivity, energy aware work",
  alternates: { canonical: "https://www.dayblip.com/tools/energy-level-task-matcher" },
  openGraph: {
    title: "Energy Level Task Matcher — Match Your Work to How You Actually Feel Right Now",
    description: "Pick your energy level and get a matched task list instantly. Stop forcing deep work when your brain is not there yet.",
    url: "https://www.dayblip.com/tools/energy-level-task-matcher",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Energy Level Task Matcher — Match Your Work to How You Actually Feel Right Now",
    description: "Pick your energy level and get a matched task list instantly. Stop forcing deep work when your brain is not there yet.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
