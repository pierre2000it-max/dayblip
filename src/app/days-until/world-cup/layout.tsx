import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Days Until FIFA World Cup Final 2026 — Live Countdown',
  description: 'How many days until the FIFA World Cup 2026 Final? Live countdown to July 19 2026 at MetLife Stadium in New Jersey. The biggest sporting event on the planet. Free.',
  alternates: { canonical: 'https://www.dayblip.com/days-until/world-cup' },
  openGraph: {
    title: 'Days Until FIFA World Cup Final 2026 — Live Countdown',
    description: 'Live countdown to the FIFA World Cup 2026 Final on July 19 2026. Days, hours, minutes and seconds. Free.',
    url: 'https://www.dayblip.com/days-until/world-cup',
    images: [{ url: 'https://www.dayblip.com/api/og/tools', width: 1200, height: 630, alt: 'Days Until FIFA World Cup Final 2026' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Days Until FIFA World Cup Final 2026 — Live Countdown',
    description: 'Live countdown to the FIFA World Cup 2026 Final on July 19 2026. Free.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
