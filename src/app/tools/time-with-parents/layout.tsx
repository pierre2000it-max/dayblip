import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Time Left With Your Parents Calculator | Dayblip',
  description: 'Calculate how many visits you have left with your parents based on how often you see them. The result will surprise you. Free — no signup required.',
  alternates: {
    canonical: 'https://www.dayblip.com/tools/time-with-parents'
  },
  openGraph: {
    title: 'Time Left With Your Parents Calculator | Dayblip',
    description: 'Calculate how many visits you have left with your parents based on how often you see them. The result will surprise you.',
    url: 'https://www.dayblip.com/tools/time-with-parents',
    images: [{
      url: 'https://www.dayblip.com/api/og/tools',
      width: 1200,
      height: 630,
      alt: 'Time Left With Your Parents — Dayblip'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time Left With Your Parents Calculator | Dayblip',
    description: 'How many visits do you have left with your parents? The answer will change how you think about time.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
