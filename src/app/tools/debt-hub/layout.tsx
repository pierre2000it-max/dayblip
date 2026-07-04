import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Debt Payoff Calculators — Hub',
  description: 'All the debt calculators you need in one place. Debt payoff date, minimum payment true cost, debt freedom tracker, and budget planner. Free — no signup required.',
  alternates: { canonical: 'https://www.dayblip.com/tools/debt-hub' },
  openGraph: {
    title: 'Debt Payoff Calculators — Hub',
    description: 'All the debt calculators you need in one place. Debt payoff date, minimum payment true cost, debt freedom tracker, and budget planner. Free — no signup required.',
    url: 'https://www.dayblip.com/tools/debt-hub',
    images: [{ url: 'https://www.dayblip.com/api/og?title=Debt+Hub&emoji=%F0%9F%92%B3&subtitle=Find+your+debt-free+date', width: 1200, height: 630, alt: 'Debt Payoff Calculators Hub — Dayblip' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Debt Payoff Calculators — Hub',
    description: 'All the debt calculators you need in one place. Free — no signup.',
    images: ['https://www.dayblip.com/api/og?title=Debt+Hub&emoji=%F0%9F%92%B3&subtitle=Find+your+debt-free+date']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
