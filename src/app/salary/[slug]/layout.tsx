import type { Metadata } from 'next'
import { getSalaryBySlug } from '@/data/salary-data'
import { salaryDescription } from '@/lib/metaDescriptions'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = getSalaryBySlug(slug)
  if (!data) return { title: 'Salary Data' }
  const { entry, state, stateSalary } = data
  const formatted = '$' + stateSalary.toLocaleString()
  return {
    title: `${entry.job} Salary in ${state.name} 2026`,
    description: salaryDescription(entry.job, state.name, formatted, entry.national),
    alternates: { canonical: `https://www.dayblip.com/salary/${slug}` },
    openGraph: {
      title: `${entry.job} Salary in ${state.name} 2026`,
      description: `Average ${entry.job.toLowerCase()} salary in ${state.name}: ${formatted}/year. National median: $${entry.national.toLocaleString()}. Estimate.`,
      url: `https://www.dayblip.com/salary/${slug}`,
      images: [{ url: 'https://www.dayblip.com/api/og?title=Salary+Data&emoji=%F0%9F%92%B0&subtitle=Estimated+salary+data', width: 1200, height: 630, alt: `${entry.job} Salary in ${state.name} — Dayblip` }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${entry.job} Salary in ${state.name} 2026`,
      images: ['https://www.dayblip.com/api/og?title=Salary+Data&emoji=%F0%9F%92%B0&subtitle=Estimated+salary+data']
    }
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
