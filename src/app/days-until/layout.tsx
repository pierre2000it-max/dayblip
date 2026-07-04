import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Countdown Timers — Days Until Holidays and Sports Events',
  description:
    'Free countdown timers to every major holiday and sports event. Days until Christmas, New Year, Super Bowl, World Cup, NBA Finals, and more. Updated live. Free.',
  alternates: { canonical: 'https://www.dayblip.com/days-until' },
  openGraph: {
    title: 'Countdown Timers — Days Until Holidays and Sports',
    description:
      'Free countdown timers to every major holiday and sports event. Live countdowns updated in real time.',
    url: 'https://www.dayblip.com/days-until',
    images: [
      {
        url: 'https://www.dayblip.com/api/og/tools',
        width: 1200,
        height: 630,
        alt: 'Countdown Timers — Dayblip',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Countdown Timers',
    description: 'Days until every major holiday and sports event. Free live countdowns.',
    images: ['https://www.dayblip.com/api/og/tools'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
