import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Holiday Budget Planner 2026 — How Much Should I Spend on Gifts? | Dayblip',
  description: 'Plan your holiday gift budget by recipient. See your total vs budget, cost per person, and the true cost if you put it on a credit card. Free — no signup required.',
  alternates: {
    canonical: 'https://www.dayblip.com/finance/holiday-budget'
  },
  openGraph: {
    title: 'Holiday Budget Planner 2026 | Dayblip',
    description: 'Plan your holiday gift spending by recipient. See your total, cost per person, and credit card true cost.',
    url: 'https://www.dayblip.com/finance/holiday-budget',
    images: [{
      url: 'https://www.dayblip.com/api/og/tools',
      width: 1200,
      height: 630,
      alt: 'Holiday Budget Planner — Dayblip'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Holiday Budget Planner 2026 | Dayblip',
    description: 'Plan your holiday gift budget and avoid January credit card shock. Free.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
