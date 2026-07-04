import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Days Until NBA Finals 2027 — Live Countdown',
  description: "How many days until the 2027 NBA Finals? Live countdown to the NBA championship series in June 2027. Best of 7 games for the Larry O'Brien trophy. Free.",
  alternates: { canonical: 'https://www.dayblip.com/days-until/nba-finals' },
  openGraph: {
    title: 'Days Until NBA Finals 2027 — Live Countdown',
    description: 'Live countdown to the 2027 NBA Finals in June 2027. Days, hours, minutes and seconds. Free — no signup required.',
    url: 'https://www.dayblip.com/days-until/nba-finals',
    images: [{ url: 'https://www.dayblip.com/api/og/tools', width: 1200, height: 630, alt: 'Days Until NBA Finals 2027' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Days Until NBA Finals 2027 — Live Countdown',
    description: 'Live countdown to the 2027 NBA Finals in June 2027. Free — no signup required.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
