import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Black Friday Deal Analyzer — Is It a Real Deal?',
  description: 'Is that Black Friday deal actually worth it? Enter the original price and sale price to find out if the discount is real or inflated. Includes opportunity cost and financing true cost. Free.',
  alternates: {
    canonical: 'https://www.dayblip.com/tools/is-it-worth-it/black-friday-deal'
  },
  openGraph: {
    title: 'Black Friday Deal Analyzer — Real Deal or Fake?',
    description: 'Is that Black Friday deal actually worth it? Find out if the discount is real or inflated. Free — no signup required.',
    url: 'https://www.dayblip.com/tools/is-it-worth-it/black-friday-deal',
    images: [{
      url: 'https://www.dayblip.com/api/og/tools',
      width: 1200,
      height: 630,
      alt: 'Black Friday Deal Analyzer — Dayblip'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Black Friday Deal Analyzer',
    description: 'Is that Black Friday deal actually real? Find out in seconds. Free.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
