import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Days Until World Series 2026 — Live Countdown',
  description: 'How many days until the 2026 World Series? Live countdown to Game 1 on October 23 2026, AL vs NL champions. Free — no signup required.',
  alternates: { canonical: 'https://www.dayblip.com/days-until/world-series' },
  openGraph: {
    title: 'Days Until World Series 2026 — Live Countdown',
    description: 'Live countdown to Game 1 of the 2026 MLB World Series on October 23. Days, hours, minutes and seconds. Free.',
    url: 'https://www.dayblip.com/days-until/world-series',
    images: [{ url: 'https://www.dayblip.com/api/og/tools', width: 1200, height: 630, alt: 'Days Until World Series 2026' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Days Until World Series 2026 — Live Countdown',
    description: 'Live countdown to Game 1 of the 2026 MLB World Series on October 23. Free.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
