import type { Metadata } from 'next'
import { cities } from '@/data/cost-of-living'
import { SALARY_DATA } from '@/data/salary-data'

function parseSlug(slug: string): {
  type: 'city' | 'job' | null
  aSlug: string
  bSlug: string
} {
  const vsIndex = slug.indexOf('-vs-')
  if (vsIndex === -1) return { type: null, aSlug: '', bSlug: '' }
  const aSlug = slug.substring(0, vsIndex)
  const bSlug = slug.substring(vsIndex + 4)
  const cityA = cities.find(c => c.slug === aSlug)
  const cityB = cities.find(c => c.slug === bSlug)
  if (cityA && cityB) return { type: 'city', aSlug, bSlug }
  const jobA = SALARY_DATA.find(j => j.slug === aSlug)
  const jobB = SALARY_DATA.find(j => j.slug === bSlug)
  if (jobA && jobB) return { type: 'job', aSlug, bSlug }
  return { type: null, aSlug, bSlug }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const { type, aSlug, bSlug } = parseSlug(slug)

  if (type === 'city') {
    const cityA = cities.find(c => c.slug === aSlug)!
    const cityB = cities.find(c => c.slug === bSlug)!
    const title = `${cityA.name} vs ${cityB.name} — Cost of Living Comparison | Dayblip`
    const description = `Compare cost of living between ${cityA.name} and ${cityB.name}. Housing, groceries, transport, healthcare side by side. COLI: ${cityA.name} ${cityA.coliIndex} vs ${cityB.name} ${cityB.coliIndex}. Free.`.slice(0, 155)
    return {
      title,
      description,
      alternates: { canonical: `https://www.dayblip.com/compare/${slug}` },
      openGraph: {
        title,
        description,
        url: `https://www.dayblip.com/compare/${slug}`,
        images: [{ url: 'https://www.dayblip.com/api/og/tools', width: 1200, height: 630, alt: title }]
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['https://www.dayblip.com/api/og/tools']
      }
    }
  }

  if (type === 'job') {
    const jobA = SALARY_DATA.find(j => j.slug === aSlug)!
    const jobB = SALARY_DATA.find(j => j.slug === bSlug)!
    const title = `${jobA.job} vs ${jobB.job} Salary Comparison | Dayblip`
    const description = `Compare ${jobA.job} and ${jobB.job} salaries nationwide. National median: ${jobA.job} $${jobA.national.toLocaleString()} vs ${jobB.job} $${jobB.national.toLocaleString()}. BLS 2024-2025. Free.`.slice(0, 155)
    return {
      title,
      description,
      alternates: { canonical: `https://www.dayblip.com/compare/${slug}` },
      openGraph: {
        title,
        description,
        url: `https://www.dayblip.com/compare/${slug}`,
        images: [{ url: 'https://www.dayblip.com/api/og/tools', width: 1200, height: 630, alt: title }]
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['https://www.dayblip.com/api/og/tools']
      }
    }
  }

  return {
    title: 'Comparison | Dayblip',
    description: 'Side by side comparison tool. Free — no signup required.'
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
