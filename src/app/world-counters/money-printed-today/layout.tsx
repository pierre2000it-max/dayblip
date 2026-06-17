import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Money Printed Today — Live US Dollar Counter | Dayblip',
  description: 'Watch how much money the US Federal Reserve has printed today. Live counter based on M2 money supply growth data. See dollars created this year in real time. Free.',
  alternates: {
    canonical: 'https://www.dayblip.com/world-counters/money-printed-today'
  },
  openGraph: {
    title: 'Money Printed Today — Live US Dollar Counter | Dayblip',
    description: 'Watch how much money the US Federal Reserve has printed today. Live counter based on M2 money supply growth data. See dollars created this year in real time. Free.',
    url: 'https://www.dayblip.com/world-counters/money-printed-today',
    images: [{
      url: 'https://www.dayblip.com/api/og/world-counters',
      width: 1200,
      height: 630,
      alt: 'Money Printed Today — Dayblip'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Money Printed Today — Live US Dollar Counter | Dayblip',
    description: 'Watch how much money the US has printed today. Live M2 money supply counter. Free — no signup.',
    images: ['https://www.dayblip.com/api/og/world-counters']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
