import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Is It Worth It to Buy vs Rent a Home? Calculator',
  description: 'Should you buy or rent? Enter your home price, rent, and timeline to get a clear answer. Includes breakeven point, total costs, and opportunity cost. Free.',
  alternates: { canonical: 'https://www.dayblip.com/tools/is-it-worth-it/buy-vs-rent' },
  openGraph: {
    title: 'Buy vs Rent Calculator',
    description: 'Should you buy or rent? Get a clear answer with the exact breakeven point for your situation.',
    url: 'https://www.dayblip.com/tools/is-it-worth-it/buy-vs-rent',
    images: [{ url: 'https://www.dayblip.com/api/og/tools', width: 1200, height: 630, alt: 'Buy vs Rent Calculator' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy vs Rent Calculator',
    description: 'Should you buy or rent? Get a clear answer with the exact breakeven point for your situation.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
