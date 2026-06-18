import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'First Paycheck Calculator 2026 — What Will I Actually Take Home? | Dayblip',
  description: 'Calculate exactly what your first paycheck will look like after federal tax, state tax, Social Security, Medicare, and deductions. No more paycheck shock. Free — no signup.',
  alternates: {
    canonical: 'https://www.dayblip.com/finance/first-paycheck'
  },
  openGraph: {
    title: 'First Paycheck Calculator 2026 | Dayblip',
    description: 'What will your first real paycheck actually be? See the full breakdown after every deduction. Free — no signup required.',
    url: 'https://www.dayblip.com/finance/first-paycheck',
    images: [{
      url: 'https://www.dayblip.com/api/og/tools',
      width: 1200,
      height: 630,
      alt: 'First Paycheck Calculator — Dayblip'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'First Paycheck Calculator 2026 | Dayblip',
    description: 'What will your first real paycheck actually be? See the full breakdown.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
