import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Time Left With Your Kids at Home Calculator',
  description: 'Calculate how many summers, weekends, and years you have left with your kids before they leave home. Every year counts. Free — no signup required.',
  alternates: {
    canonical: 'https://www.dayblip.com/tools/time-with-kids'
  },
  openGraph: {
    title: 'Time Left With Your Kids at Home Calculator',
    description: 'Calculate how many summers, weekends, and years you have left with your kids before they leave home.',
    url: 'https://www.dayblip.com/tools/time-with-kids',
    images: [{
      url: 'https://www.dayblip.com/api/og/tools',
      width: 1200,
      height: 630,
      alt: 'Time Left With Your Kids — Dayblip'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time Left With Your Kids at Home Calculator',
    description: 'How many summers do you have left with your kids? Calculate now.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
