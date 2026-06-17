import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Is a Degree Worth It vs Coding Bootcamp? Calculator | Dayblip',
  description: 'Compare the ROI of a 4-year college degree vs a coding bootcamp. Total cost, starting salary, years to break even, and 10-year earnings difference. Free.',
  alternates: { canonical: 'https://www.dayblip.com/tools/is-it-worth-it/degree-vs-bootcamp' },
  openGraph: {
    title: 'Degree vs Bootcamp ROI Calculator | Dayblip',
    description: 'Is a college degree worth it compared to a coding bootcamp? Get the exact ROI comparison.',
    url: 'https://www.dayblip.com/tools/is-it-worth-it/degree-vs-bootcamp',
    images: [{ url: 'https://www.dayblip.com/api/og/tools', width: 1200, height: 630, alt: 'Degree vs Bootcamp Calculator' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Degree vs Bootcamp ROI Calculator | Dayblip',
    description: 'Is a college degree worth it compared to a coding bootcamp? Get the exact ROI comparison.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
