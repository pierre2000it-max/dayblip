import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Is It Worth It to Lease vs Buy a Car? Calculator | Dayblip',
  description: 'Should you lease or buy your next car? Compare total costs including payments, insurance, maintenance, and resale value. Get a clear verdict. Free.',
  alternates: { canonical: 'https://www.dayblip.com/tools/is-it-worth-it/lease-vs-buy-car' },
  openGraph: {
    title: 'Lease vs Buy Car Calculator | Dayblip',
    description: 'Should you lease or buy? Get the exact cost comparison for your car decision.',
    url: 'https://www.dayblip.com/tools/is-it-worth-it/lease-vs-buy-car',
    images: [{ url: 'https://www.dayblip.com/api/og/tools', width: 1200, height: 630, alt: 'Lease vs Buy Car Calculator' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lease vs Buy Car Calculator | Dayblip',
    description: 'Should you lease or buy? Get the exact cost comparison for your car decision.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
