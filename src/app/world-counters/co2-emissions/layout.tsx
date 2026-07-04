import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'US CO2 Emissions Today — Live Counter',
  description: 'Watch US CO2 emissions update in real time. Live counter based on EIA data showing tons of carbon dioxide emitted today by the United States. Free — no signup.',
  alternates: {
    canonical: 'https://www.dayblip.com/world-counters/co2-emissions'
  },
  openGraph: {
    title: 'US CO2 Emissions Today — Live Counter',
    description: 'Watch US CO2 emissions update in real time. Live counter based on EIA data showing tons of carbon dioxide emitted today by the United States. Free — no signup.',
    url: 'https://www.dayblip.com/world-counters/co2-emissions',
    images: [{
      url: 'https://www.dayblip.com/api/og/world-counters',
      width: 1200,
      height: 630,
      alt: 'US CO2 Emissions Today — Dayblip'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'US CO2 Emissions Today — Live Counter',
    description: 'Watch US CO2 emissions update in real time. Live counter based on EIA data. Free — no signup.',
    images: ['https://www.dayblip.com/api/og/world-counters']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
