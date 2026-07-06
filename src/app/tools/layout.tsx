import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Online Tools — 200+ Calculators and Utilities | Dayblip',
  description: 'Browse 200+ free online tools — financial calculators, life tools, career utilities, and more. No email required. No paywall. Free forever.',
  alternates: {
    canonical: 'https://www.dayblip.com/tools'
  },
  openGraph: {
    title: 'Free Online Tools — 200+ Calculators | Dayblip',
    description: 'Browse 200+ free online tools. No email. No paywall.',
    url: 'https://www.dayblip.com/tools',
    images: [{
      url: 'https://www.dayblip.com/api/og/tools',
      width: 1200,
      height: 630,
      alt: 'Free Online Tools — Dayblip'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Tools | Dayblip',
    description: 'Browse 200+ free online tools. No email. No paywall.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
