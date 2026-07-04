import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Average Salary by Job and State 2024',
  description: 'Find the average salary for any job in any US state. BLS OES May 2024 data covering 20 occupations across all 50 states. Free salary research tool.',
  alternates: { canonical: 'https://www.dayblip.com/salary' },
  openGraph: {
    title: 'Average Salary by Job and State 2024',
    description: 'Find the average salary for any job in any US state. BLS OES May 2024 data covering 20 occupations across all 50 states.',
    url: 'https://www.dayblip.com/salary',
    images: [{ url: 'https://www.dayblip.com/api/og?title=Salary+Data&emoji=%F0%9F%92%B0&subtitle=Average+salary+by+job+and+state+%E2%80%94+BLS+2024', width: 1200, height: 630, alt: 'Average Salary by Job and State — Dayblip' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Average Salary by Job and State 2024',
    images: ['https://www.dayblip.com/api/og?title=Salary+Data&emoji=%F0%9F%92%B0&subtitle=Average+salary+by+job+and+state+%E2%80%94+BLS+2024']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
