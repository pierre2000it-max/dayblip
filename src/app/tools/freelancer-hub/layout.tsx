import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Freelancer Financial Tools — Calculator Hub | Dayblip',
  description: 'All the financial calculators freelancers need in one place. True hourly wage, freelancer rate, self-employment tax, WFH savings, and side hustle potential. Free.',
  alternates: { canonical: 'https://www.dayblip.com/tools/freelancer-hub' },
  openGraph: {
    title: 'Freelancer Financial Tools — Calculator Hub | Dayblip',
    description: 'All the financial calculators freelancers need in one place. True hourly wage, freelancer rate, self-employment tax, WFH savings, and side hustle potential. Free.',
    url: 'https://www.dayblip.com/tools/freelancer-hub',
    images: [{ url: 'https://www.dayblip.com/api/og?title=Freelancer+Hub&emoji=%F0%9F%92%BC&subtitle=All+freelancer+calculators+in+one+place', width: 1200, height: 630, alt: 'Freelancer Financial Tools Hub — Dayblip' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freelancer Financial Tools — Calculator Hub | Dayblip',
    description: 'All the financial calculators freelancers need in one place. Free.',
    images: ['https://www.dayblip.com/api/og?title=Freelancer+Hub&emoji=%F0%9F%92%BC&subtitle=All+freelancer+calculators+in+one+place']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
