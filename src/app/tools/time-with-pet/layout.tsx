import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Time Left With Your Pet Calculator | Dayblip',
  description: 'Calculate how many years, walks, and cuddles you have left with your dog or cat based on their age and breed. Cherish every moment. Free — no signup required.',
  alternates: {
    canonical: 'https://www.dayblip.com/tools/time-with-pet'
  },
  openGraph: {
    title: 'Time Left With Your Pet Calculator | Dayblip',
    description: 'Calculate how many years, walks, and cuddles you have left with your dog or cat. Every moment counts.',
    url: 'https://www.dayblip.com/tools/time-with-pet',
    images: [{
      url: 'https://www.dayblip.com/api/og/tools',
      width: 1200,
      height: 630,
      alt: 'Time Left With Your Pet — Dayblip'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time Left With Your Pet Calculator | Dayblip',
    description: 'How many walks do you have left with your dog? Calculate now.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
