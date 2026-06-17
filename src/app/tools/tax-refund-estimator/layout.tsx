import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '2026 Tax Refund Estimator — How Big Will My Refund Be? | Dayblip',
  description: 'Estimate your 2026 federal tax refund or amount owed. Enter your income, filing status, withholding, and deductions for an instant estimate. Free — no signup required.',
  alternates: {
    canonical: 'https://www.dayblip.com/tools/tax-refund-estimator'
  },
  openGraph: {
    title: '2026 Tax Refund Estimator | Dayblip',
    description: 'How big will your 2026 tax refund be? Get an instant estimate based on your income, withholding, and deductions.',
    url: 'https://www.dayblip.com/tools/tax-refund-estimator',
    images: [{
      url: 'https://www.dayblip.com/api/og/tools',
      width: 1200,
      height: 630,
      alt: '2026 Tax Refund Estimator — Dayblip'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: '2026 Tax Refund Estimator | Dayblip',
    description: 'How big will your 2026 tax refund be? Free instant estimate.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
