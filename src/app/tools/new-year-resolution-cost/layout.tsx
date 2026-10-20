import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Year Resolution Cost Calculator: What Goals Cost',
  description: "Calculate the yearly cost of your New Year resolutions: gym, meal prep, courses, apps, and more. See total cost and ROI first. Free — no signup required.",
  alternates: {
    canonical: 'https://www.dayblip.com/tools/new-year-resolution-cost'
  },
  openGraph: {
    title: 'New Year Resolution Cost Calculator',
    description: 'What will your New Year\'s resolutions actually cost? See the total annual price tag before you commit.',
    url: 'https://www.dayblip.com/tools/new-year-resolution-cost',
    images: [{
      url: 'https://www.dayblip.com/api/og/tools',
      width: 1200,
      height: 630,
      alt: 'New Year Resolution Cost Calculator — Dayblip'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Year Resolution Cost Calculator',
    description: 'What will your New Year\'s resolutions actually cost? Calculate before you commit.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
