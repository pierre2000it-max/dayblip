import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Cities and Jobs Side by Side',
  description: 'Compare cost of living between any two cities or salaries between any two jobs. Side by side data from BLS and C2ER. Free — no signup required.',
  alternates: {
    canonical: 'https://www.dayblip.com/compare'
  },
  openGraph: {
    title: 'Compare Cities and Jobs Side by Side',
    description: 'Compare cost of living between any two cities or salaries between any two jobs. Free — no signup required.',
    url: 'https://www.dayblip.com/compare',
    images: [{
      url: 'https://www.dayblip.com/api/og/tools',
      width: 1200,
      height: 630,
      alt: 'Compare Cities and Jobs — Dayblip'
    }]
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
