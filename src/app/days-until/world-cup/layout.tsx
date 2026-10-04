import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Days Until the 2030 World Cup — Live Countdown',
  description: 'How many days until the next FIFA World Cup? Live countdown to the June 2030 opening matches in Spain, Portugal and Morocco. Free — no signup required.',
  alternates: { canonical: 'https://www.dayblip.com/days-until/world-cup' },
  openGraph: {
    title: 'Days Until the 2030 World Cup — Live Countdown',
    description: 'Live countdown to the next FIFA World Cup, opening June 13 2030 in Spain, Portugal and Morocco. Days, hours, minutes and seconds. Free.',
    url: 'https://www.dayblip.com/days-until/world-cup',
    images: [{ url: 'https://www.dayblip.com/api/og/tools', width: 1200, height: 630, alt: 'Days Until the 2030 FIFA World Cup' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Days Until the 2030 World Cup — Live Countdown',
    description: 'Live countdown to the next FIFA World Cup, opening June 13 2030. Free.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
