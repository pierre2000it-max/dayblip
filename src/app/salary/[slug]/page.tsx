import { notFound } from 'next/navigation'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import AuthorByline from '@/components/AuthorByline'
import FAQAccordion from '@/components/FAQAccordion'
import ShareButtons from '@/components/ShareButtons'
import {
  getSalaryBySlug,
  getAllSalarySlugs,
  SALARY_DATA,
  STATES,
  getStateSlug,
  generateSlug,
} from '@/data/salary-data'

export async function generateStaticParams() {
  return getAllSalarySlugs().map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export default async function SalaryPage({ params }: Props) {
  const { slug } = await params
  const data = getSalaryBySlug(slug)
  if (!data) notFound()

  const { entry, state, stateSalary } = data

  const diff = stateSalary - entry.national
  const pctDiff = ((diff / entry.national) * 100).toFixed(1)
  const isAbove = diff >= 0
  const hourly = (stateSalary / 2080).toFixed(2)
  const nationalHourly = (entry.national / 2080).toFixed(2)

  // Top 5 and bottom 5 states
  const stateEntries = STATES.map((s) => ({
    state: s,
    salary: entry.states[s.abbreviation] ?? entry.national,
  })).sort((a, b) => b.salary - a.salary)

  const top5 = stateEntries.slice(0, 5)
  const bottom5 = stateEntries.slice(-5).reverse()

  // Other states for this job (6 others, skip current)
  const otherStates = STATES.filter((s) => s.abbreviation !== state.abbreviation).slice(0, 6)

  // Other jobs in this state (4 others)
  const otherJobs = SALARY_DATA.filter((e) => e.slug !== entry.slug).slice(0, 4)

  const faqItems = [
    {
      question: `What is the average ${entry.job.toLowerCase()} salary in ${state.name}?`,
      answer: `The average ${entry.job.toLowerCase()} salary in ${state.name} is $${stateSalary.toLocaleString()} per year as of BLS OES 2024-2025. This works out to approximately $${hourly} per hour based on a standard 2,080-hour work year.`,
    },
    {
      question: `How does ${state.name}&apos;s ${entry.job.toLowerCase()} salary compare to the national average?`,
      answer: `${state.name}&apos;s average ${entry.job.toLowerCase()} salary of $${stateSalary.toLocaleString()} is ${isAbove ? 'above' : 'below'} the national average of $${entry.national.toLocaleString()} by ${Math.abs(diff).toLocaleString()} (${Math.abs(Number(pctDiff))}%). ${isAbove ? `${state.name} is one of the higher-paying states for this occupation.` : `${state.name} tends to pay less than the national median for this role.`}`,
    },
    {
      question: `What factors affect ${entry.job.toLowerCase()} salaries in ${state.name}?`,
      answer: `${entry.job} salaries in ${state.name} are influenced by cost of living, local demand for workers, industry concentration, years of experience, education level, employer size, and unionization rates. Metro areas within ${state.name} may pay significantly more than rural areas.`,
    },
    {
      question: `What is the hourly rate for a ${entry.job.toLowerCase()} in ${state.name}?`,
      answer: `Based on the annual salary of $${stateSalary.toLocaleString()}, the approximate hourly rate for a ${entry.job.toLowerCase()} in ${state.name} is $${hourly} per hour (assuming 2,080 hours per year). The national average hourly rate is $${nationalHourly}.`,
    },
    {
      question: `Which states pay ${entry.job.toLowerCase()}s the most?`,
      answer: `According to BLS OES 2024-2025, the top paying states for ${entry.blsTitle} are: ${top5.map((t) => `${t.state.name} ($${t.salary.toLocaleString()})`).join(', ')}.`,
    },
    {
      question: `Is the ${entry.job.toLowerCase()} salary data from BLS reliable?`,
      answer: `Yes. This data comes from the Bureau of Labor Statistics (BLS) Occupational Employment and Wage Statistics (OES) survey, 2024-2025. The BLS OES program surveys over 1.1 million business establishments semi-annually and is the most comprehensive source of occupational wage data in the United States.`,
    },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question.replace(/&apos;/g, "'"),
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/&apos;/g, "'"),
      },
    })),
  }

  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${entry.job} Salary in ${state.name} 2026`,
    description: `Average annual salary for ${entry.blsTitle} in ${state.name} from BLS OES 2024-2025`,
    url: `https://www.dayblip.com/salary/${slug}`,
    creator: { '@type': 'Organization', name: 'Dayblip', url: 'https://www.dayblip.com' },
    publisher: { '@type': 'Organization', name: 'U.S. Bureau of Labor Statistics', url: 'https://www.bls.gov' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    temporalCoverage: '2024-2025',
    spatialCoverage: { '@type': 'Place', name: state.name },
    variableMeasured: 'Mean Annual Wage',
  }

  return (
    <main style={{ background: '#0d1b2a', minHeight: '100vh', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />

      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Salary Data', href: '/salary' },
          { label: `${entry.job} in ${state.name}` },
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '34px', fontWeight: '800', margin: '0 0 8px 0', lineHeight: 1.2 }}>
          {entry.job} Salary in {state.name}
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '15px', margin: '0 0 24px 0' }}>
          BLS OES 2024-2025 &mdash; {entry.blsTitle}
        </p>

        {/* Quick Answer */}
        <div style={{ background: '#1e2d4a', borderLeft: '4px solid #e94560', borderRadius: '8px', padding: '20px 24px', margin: '0 0 28px 0' }}>
          <p style={{ color: '#ffffff', fontSize: '16px', margin: 0, lineHeight: 1.6 }}>
            <strong style={{ color: '#e94560' }}>Quick answer:</strong> The average {entry.job.toLowerCase()} salary in {state.name} is{' '}
            <strong style={{ color: '#ffffff' }}>${stateSalary.toLocaleString()} per year</strong> (${hourly}/hr), which is{' '}
            <strong style={{ color: isAbove ? '#4ade80' : '#f87171' }}>
              {isAbove ? '+' : ''}{pctDiff}% {isAbove ? 'above' : 'below'}
            </strong>{' '}
            the national average of ${entry.national.toLocaleString()}.
          </p>
        </div>

        <AuthorByline variant="tool" />

        {/* Large salary card */}
        <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '40px 24px', textAlign: 'center', margin: '32px 0' }}>
          <div style={{ color: '#a8a8b3', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Average Annual Salary
          </div>
          <div style={{ color: '#e94560', fontSize: '52px', fontWeight: '800', lineHeight: 1, marginBottom: '8px' }}>
            ${stateSalary.toLocaleString()}
          </div>
          <div style={{ color: '#a8a8b3', fontSize: '15px' }}>
            {entry.job} &bull; {state.name} &bull; 2026
          </div>
        </div>

        {/* 3-column comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', margin: '0 0 40px 0' }}>
          <div style={{ background: '#1e2d4a', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
            <div style={{ color: '#a8a8b3', fontSize: '13px', marginBottom: '8px' }}>{state.name} Annual</div>
            <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700' }}>${stateSalary.toLocaleString()}</div>
          </div>
          <div style={{ background: '#1e2d4a', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
            <div style={{ color: '#a8a8b3', fontSize: '13px', marginBottom: '8px' }}>vs National Average</div>
            <div style={{ color: isAbove ? '#4ade80' : '#f87171', fontSize: '24px', fontWeight: '700' }}>
              {isAbove ? '+' : ''}{pctDiff}%
            </div>
            <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>${entry.national.toLocaleString()} national</div>
          </div>
          <div style={{ background: '#1e2d4a', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
            <div style={{ color: '#a8a8b3', fontSize: '13px', marginBottom: '8px' }}>{state.name} Hourly</div>
            <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700' }}>${hourly}</div>
            <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>per hour (2,080 hrs/yr)</div>
          </div>
        </div>

        {/* Top 5 / Bottom 5 table */}
        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '0 0 16px 0' }}>
          {entry.job} Salary by State
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
          <div>
            <div style={{ color: '#4ade80', fontSize: '13px', fontWeight: '600', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Top 5 Highest Paying
            </div>
            {top5.map((item, i) => (
              <div key={item.state.abbreviation} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1e2d4a' }}>
                <span style={{ color: '#a8a8b3', fontSize: '14px' }}>
                  <span style={{ color: '#6b7280', marginRight: '8px' }}>{i + 1}.</span>
                  <Link href={`/salary/${generateSlug(entry.slug, getStateSlug(item.state.name))}`} style={{ color: '#a8a8b3', textDecoration: 'none' }}>
                    {item.state.name}
                  </Link>
                </span>
                <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '14px' }}>${item.salary.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: '#f87171', fontSize: '13px', fontWeight: '600', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Bottom 5 Lowest Paying
            </div>
            {bottom5.map((item, i) => (
              <div key={item.state.abbreviation} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1e2d4a' }}>
                <span style={{ color: '#a8a8b3', fontSize: '14px' }}>
                  <span style={{ color: '#6b7280', marginRight: '8px' }}>{i + 1}.</span>
                  <Link href={`/salary/${generateSlug(entry.slug, getStateSlug(item.state.name))}`} style={{ color: '#a8a8b3', textDecoration: 'none' }}>
                    {item.state.name}
                  </Link>
                </span>
                <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '14px' }}>${item.salary.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <FAQAccordion items={faqItems} />

        <ShareButtons
          text={`The average ${entry.job.toLowerCase()} salary in ${state.name} is $${stateSalary.toLocaleString()}/year. See how it compares to all 50 states at Dayblip 💼`}
          url={`https://www.dayblip.com/salary/${slug}`}
        />

        {/* Related Tools */}
        <div style={{ background: '#1e2d4a', borderRadius: '10px', padding: '24px', margin: '40px 0' }}>
          <h2 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: '0 0 16px 0' }}>Related Tools</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { href: '/tools/salary-checker', label: 'Salary Checker — Is your pay fair?' },
              { href: '/finance/take-home-pay', label: 'Take-Home Pay Calculator' },
              { href: '/tools/true-hourly-wage', label: 'True Hourly Wage Calculator' },
              { href: '/tools/cost-of-living', label: 'Cost of Living Comparison' },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                style={{ color: '#e94560', fontSize: '14px', textDecoration: 'none', padding: '10px 14px', background: '#0d1b2a', borderRadius: '6px', display: 'block' }}
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Other states for this job */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>
            {entry.job} Salary in Other States
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {otherStates.map((s) => (
              <Link
                key={s.abbreviation}
                href={`/salary/${generateSlug(entry.slug, getStateSlug(s.name))}`}
                style={{ background: '#1e2d4a', color: '#a8a8b3', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', textDecoration: 'none', border: '1px solid #2a3a5c' }}
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Other jobs in this state */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>
            Other Jobs in {state.name}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {otherJobs.map((e) => (
              <Link
                key={e.slug}
                href={`/salary/${generateSlug(e.slug, getStateSlug(state.name))}`}
                style={{ background: '#1e2d4a', color: '#a8a8b3', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', textDecoration: 'none', border: '1px solid #2a3a5c' }}
              >
                {e.job}
              </Link>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div style={{ borderTop: '1px solid #2a3a5c', paddingTop: '24px' }}>
          <h2 style={{ color: '#a8a8b3', fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0' }}>Methodology</h2>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0, lineHeight: 1.7 }}>
            Salary data is sourced from the U.S. Bureau of Labor Statistics Occupational Employment and Wage Statistics (OES) program, 2024-2025 release. The OES survey samples approximately 1.1 million non-farm business establishments across the US. Figures represent mean annual wages. Individual salaries vary based on experience, education level, employer size, geographic location within the state, and other factors. Data is updated annually. For the most current figures, visit bls.gov/oes.
          </p>
        </div>
      </div>
    </main>
  )
}
