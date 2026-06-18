import type { Metadata } from 'next'
import { getSalaryBySlug } from '@/data/salary-data'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = getSalaryBySlug(slug)
  if (!data) return { title: 'Salary Data | Dayblip' }
  const { entry, state, stateSalary } = data
  const formatted = '$' + stateSalary.toLocaleString()
  return {
    title: `${entry.job} Salary in ${state.name} 2026 | Dayblip`,
    description: `The average ${entry.job.toLowerCase()} salary in ${state.name} is ${formatted} per year (BLS OES 2024-2025). See how ${state.name} compares to the national median of $${entry.national.toLocaleString()}.`,
    robots: { index: false, follow: false },
    alternates: { canonical: `https://www.dayblip.com/salary/${slug}` },
    openGraph: {
      title: `${entry.job} Salary in ${state.name} 2026 | Dayblip`,
      description: `Average ${entry.job.toLowerCase()} salary in ${state.name}: ${formatted}/year. National median: $${entry.national.toLocaleString()}. BLS OES 2024-2025.`,
      url: `https://www.dayblip.com/salary/${slug}`,
      images: [{ url: 'https://www.dayblip.com/api/og?title=Salary+Data&emoji=%F0%9F%92%B0&subtitle=BLS+OES+2024-2025', width: 1200, height: 630, alt: `${entry.job} Salary in ${state.name} — Dayblip` }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${entry.job} Salary in ${state.name} 2026 | Dayblip`,
      images: ['https://www.dayblip.com/api/og?title=Salary+Data&emoji=%F0%9F%92%B0&subtitle=BLS+OES+2024-2025']
    }
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
