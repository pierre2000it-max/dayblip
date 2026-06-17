import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Days Until Super Bowl 2027 — Live Countdown | Dayblip',
  description: "How many days until Super Bowl LXI? Live countdown to February 14 2027 at SoFi Stadium in Inglewood California. The first Super Bowl on Valentine's Day. Free.",
  alternates: { canonical: 'https://www.dayblip.com/days-until/super-bowl' },
  openGraph: {
    title: 'Days Until Super Bowl 2027 — Live Countdown | Dayblip',
    description: 'Live countdown to Super Bowl LXI on February 14 2027 at SoFi Stadium. Days, hours, minutes and seconds. Free.',
    url: 'https://www.dayblip.com/days-until/super-bowl',
    images: [{ url: 'https://www.dayblip.com/api/og/tools', width: 1200, height: 630, alt: 'Days Until Super Bowl 2027' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Days Until Super Bowl 2027 — Live Countdown | Dayblip',
    description: 'Live countdown to Super Bowl LXI on February 14 2027 at SoFi Stadium. Free.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
