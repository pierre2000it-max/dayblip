import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Days Until World Series 2026 — Live Countdown | Dayblip',
  description: 'How many days until the 2026 MLB World Series? Live countdown to October 2026. The MLB championship — best of 7 games between the AL and NL champions. Free.',
  alternates: { canonical: 'https://www.dayblip.com/days-until/world-series' },
  openGraph: {
    title: 'Days Until World Series 2026 — Live Countdown | Dayblip',
    description: 'Live countdown to the 2026 MLB World Series in October 2026. Days, hours, minutes and seconds. Free.',
    url: 'https://www.dayblip.com/days-until/world-series',
    images: [{ url: 'https://www.dayblip.com/api/og/tools', width: 1200, height: 630, alt: 'Days Until World Series 2026' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Days Until World Series 2026 — Live Countdown | Dayblip',
    description: 'Live countdown to the 2026 MLB World Series in October 2026. Free.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
