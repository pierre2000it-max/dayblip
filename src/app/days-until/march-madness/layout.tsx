import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Days Until March Madness 2027 — Live Countdown',
  description: 'How many days until March Madness 2027? Live countdown to the NCAA college basketball tournament. 68 teams compete for the national championship. Free.',
  alternates: { canonical: 'https://www.dayblip.com/days-until/march-madness' },
  openGraph: {
    title: 'Days Until March Madness 2027 — Live Countdown',
    description: 'Live countdown to NCAA March Madness 2027. Days, hours, minutes and seconds. Free — no signup required.',
    url: 'https://www.dayblip.com/days-until/march-madness',
    images: [{ url: 'https://www.dayblip.com/api/og/tools', width: 1200, height: 630, alt: 'Days Until March Madness 2027' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Days Until March Madness 2027 — Live Countdown',
    description: 'Live countdown to NCAA March Madness 2027. Free — no signup required.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
