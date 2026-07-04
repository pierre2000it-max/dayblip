import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Retirement Planning Calculators — Hub',
  description: 'All the retirement calculators you need in one place. FI date, compound interest, Social Security, retirement savings, and early vs late investing. Free — no signup.',
  alternates: { canonical: 'https://www.dayblip.com/tools/retirement-hub' },
  openGraph: {
    title: 'Retirement Planning Calculators — Hub',
    description: 'All the retirement calculators you need in one place. FI date, compound interest, Social Security, retirement savings, and early vs late investing. Free — no signup.',
    url: 'https://www.dayblip.com/tools/retirement-hub',
    images: [{ url: 'https://www.dayblip.com/api/og?title=Retirement+Hub&emoji=%F0%9F%8F%9B%EF%B8%8F&subtitle=All+retirement+calculators+in+one+place', width: 1200, height: 630, alt: 'Retirement Planning Calculators Hub — Dayblip' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retirement Planning Calculators — Hub',
    description: 'All the retirement calculators you need in one place. Free — no signup.',
    images: ['https://www.dayblip.com/api/og?title=Retirement+Hub&emoji=%F0%9F%8F%9B%EF%B8%8F&subtitle=All+retirement+calculators+in+one+place']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
