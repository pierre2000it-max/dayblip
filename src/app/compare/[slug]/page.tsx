import { notFound } from 'next/navigation'
import { cities, CityData } from '@/data/cost-of-living'
import { SALARY_DATA, SalaryEntry, STATES } from '@/data/salary-data'
import Breadcrumb from '@/components/Breadcrumb'
import AuthorByline from '@/components/AuthorByline'
import FAQAccordion from '@/components/FAQAccordion'
import ShareButtons from '@/components/ShareButtons'
import RelatedTools from '@/components/RelatedTools'
import LastUpdated from '@/components/LastUpdated'
import MethodologyNote from '@/components/MethodologyNote'

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

export async function generateStaticParams() {
  const slugs: { slug: string }[] = []

  for (let i = 0; i < cities.length; i++) {
    for (let j = i + 1; j < cities.length; j++) {
      slugs.push({ slug: `${cities[i].slug}-vs-${cities[j].slug}` })
    }
  }

  for (let i = 0; i < SALARY_DATA.length; i++) {
    for (let j = i + 1; j < SALARY_DATA.length; j++) {
      slugs.push({ slug: `${SALARY_DATA[i].slug}-vs-${SALARY_DATA[j].slug}` })
    }
  }

  return slugs
}

const fmt = (n: number) => '$' + Math.round(n).toLocaleString()
const fmtIdx = (n: number) => n.toFixed(0)

function diffColor(a: number, b: number): string {
  if (b > a) return '#e94560'
  if (b < a) return '#4ade80'
  return '#a8a8b3'
}

function diffLabel(a: number, b: number): string {
  const d = Math.round(((b - a) / a) * 100)
  if (d === 0) return 'Same'
  return d > 0 ? `+${d}%` : `${d}%`
}

// ─── CITY COMPARISON ─────────────────────────────────────────────────────────

function CityComparison({ cityA, cityB, slug }: {
  cityA: CityData
  cityB: CityData
  slug: string
}) {
  const pctDiff = Math.round(((cityB.coliIndex - cityA.coliIndex) / cityA.coliIndex) * 100)
  const isMoreExpensive = pctDiff > 0
  const isCheaper = pctDiff < 0

  const categories = [
    { label: 'Overall COLI', a: cityA.coliIndex, b: cityB.coliIndex },
    { label: 'Housing', a: cityA.housingIndex, b: cityB.housingIndex },
    { label: 'Groceries', a: cityA.groceriesIndex, b: cityB.groceriesIndex },
    { label: 'Transport', a: cityA.transportIndex, b: cityB.transportIndex },
    { label: 'Healthcare', a: cityA.healthcareIndex, b: cityB.healthcareIndex },
    { label: 'Utilities', a: cityA.utilitiesIndex, b: cityB.utilitiesIndex },
  ]

  const biggestDiff = [...categories].sort(
    (a, b) => Math.abs((b.b - b.a) / b.a) - Math.abs((a.b - a.a) / a.a)
  )[0]

  const faqItems = [
    {
      question: `Is ${cityA.name} or ${cityB.name} cheaper to live in?`,
      answer: `${isCheaper ? cityB.name : cityA.name} is cheaper to live in overall. ${cityA.name} has a cost of living index of ${fmtIdx(cityA.coliIndex)} while ${cityB.name} has an index of ${fmtIdx(cityB.coliIndex)}, where 100 represents the US national average. ${cityB.name} is ${Math.abs(pctDiff)}% ${isMoreExpensive ? 'more expensive' : 'cheaper'} than ${cityA.name} overall.`
    },
    {
      question: `How does housing compare between ${cityA.name} and ${cityB.name}?`,
      answer: `The median 1-bedroom rent in ${cityA.name} is ${fmt(cityA.medRent1br)} per month compared to ${fmt(cityB.medRent1br)} in ${cityB.name}. The median home price in ${cityA.name} is ${fmt(cityA.medHomePrice)} versus ${fmt(cityB.medHomePrice)} in ${cityB.name}. Housing is typically the largest factor in cost of living differences between cities.`
    },
    {
      question: `What is the cost of living index for ${cityA.name} and ${cityB.name}?`,
      answer: `${cityA.name} has a cost of living index of ${fmtIdx(cityA.coliIndex)} and ${cityB.name} has an index of ${fmtIdx(cityB.coliIndex)}, both measured against a US national average of 100. An index above 100 means more expensive than the national average — below 100 means cheaper.`
    },
    {
      question: `How much do you need to earn in ${cityB.name} to match a salary in ${cityA.name}?`,
      answer: `To maintain the same purchasing power as a salary in ${cityA.name}, multiply by ${(cityB.coliIndex / cityA.coliIndex).toFixed(2)}. For example a $75,000 salary in ${cityA.name} is equivalent to approximately ${fmt(75000 * cityB.coliIndex / cityA.coliIndex)} in ${cityB.name}.`
    },
    {
      question: `Which city has better job opportunities — ${cityA.name} or ${cityB.name}?`,
      answer: `${cityA.name} has a median household income of ${fmt(cityA.medHouseholdIncome)} per year versus ${fmt(cityB.medHouseholdIncome)} in ${cityB.name}. Higher incomes must be weighed against cost of living. Use the Dayblip salary tools to see specific job salaries in both cities.`
    },
    {
      question: `Is it worth moving from ${cityA.name} to ${cityB.name}?`,
      answer: `Whether moving from ${cityA.name} to ${cityB.name} is worthwhile depends on your salary, lifestyle, and priorities. ${cityB.name} is ${Math.abs(pctDiff)}% ${isMoreExpensive ? 'more expensive' : 'cheaper'} overall — with the biggest difference in ${biggestDiff.label.toLowerCase()}. Use the Dayblip cost of living calculator to enter your specific salary and see the exact dollar impact.`
    }
  ]

  return (
    <main style={{ background: '#0d1b2a', minHeight: '100vh', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `Is ${cityA.name} or ${cityB.name} cheaper to live in?`,
                acceptedAnswer: { '@type': 'Answer', text: `${isCheaper ? cityB.name : cityA.name} is cheaper. ${cityA.name} COLI: ${fmtIdx(cityA.coliIndex)}. ${cityB.name} COLI: ${fmtIdx(cityB.coliIndex)}. National average = 100.` }
              },
              {
                '@type': 'Question',
                name: `What is the cost of living index for ${cityA.name} and ${cityB.name}?`,
                acceptedAnswer: { '@type': 'Answer', text: `${cityA.name} COLI: ${fmtIdx(cityA.coliIndex)}. ${cityB.name} COLI: ${fmtIdx(cityB.coliIndex)}. National average = 100.` }
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: `${cityA.name} vs ${cityB.name} Cost of Living Comparison`,
            url: `https://www.dayblip.com/compare/${slug}`,
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: `Compare cost of living between ${cityA.name} and ${cityB.name} using C2ER 2024-2025 data.`
          })
        }}
      />

      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Compare', href: '/compare' },
          { label: `${cityA.name} vs ${cityB.name}` }
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
          {cityA.name} vs {cityB.name}
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '15px', margin: '0 0 24px' }}>
          Cost of living comparison — C2ER 2024-2025 data
        </p>

        <div style={{ background: '#1e2d4a', borderLeft: '4px solid #e94560', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }}>
          <p style={{ color: '#e94560', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>QUICK ANSWER</p>
          <p style={{ color: '#ffffff', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
            {cityB.name} is{' '}
            <strong style={{ color: '#e94560' }}>
              {isMoreExpensive ? `${Math.abs(pctDiff)}% more expensive` : isCheaper ? `${Math.abs(pctDiff)}% cheaper` : 'the same cost'}
            </strong>
            {' '}than {cityA.name} overall.
            {cityA.name} has a cost of living index of {fmtIdx(cityA.coliIndex)} vs {cityB.name} at {fmtIdx(cityB.coliIndex)}{' '}
            (national average = 100). The biggest difference is {biggestDiff.label.toLowerCase()} —{' '}
            {biggestDiff.a > biggestDiff.b ? cityA.name : cityB.name} costs{' '}
            {Math.abs(Math.round(((biggestDiff.b - biggestDiff.a) / biggestDiff.a) * 100))}%{' '}
            {biggestDiff.a > biggestDiff.b ? 'more' : 'less'}.
          </p>
        </div>

        <AuthorByline variant="tool" />

        {/* Head to head */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '16px',
          alignItems: 'center',
          margin: '32px 0'
        }}>
          <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{cityA.name}</div>
            <div style={{ color: '#a8a8b3', fontSize: '13px', marginBottom: '16px' }}>{cityA.state}</div>
            <div style={{ color: '#e94560', fontSize: '40px', fontWeight: '800' }}>{fmtIdx(cityA.coliIndex)}</div>
            <div style={{ color: '#a8a8b3', fontSize: '12px' }}>COLI index</div>
          </div>
          <div style={{ color: '#a8a8b3', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>VS</div>
          <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{cityB.name}</div>
            <div style={{ color: '#a8a8b3', fontSize: '13px', marginBottom: '16px' }}>{cityB.state}</div>
            <div style={{ color: '#e94560', fontSize: '40px', fontWeight: '800' }}>{fmtIdx(cityB.coliIndex)}</div>
            <div style={{ color: '#a8a8b3', fontSize: '12px' }}>COLI index</div>
          </div>
        </div>

        {/* Category breakdown */}
        <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '24px', marginBottom: '24px', overflowX: 'auto' }}>
          <h2 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: '0 0 16px' }}>
            Category Breakdown
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Category', cityA.name, cityB.name, 'Difference'].map(h => (
                  <th key={h} style={{
                    color: '#a8a8b3',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '8px 12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #0d1b2a'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((row, i) => (
                <tr key={row.label} style={{ background: i % 2 === 0 ? '#1e2d4a' : '#162338' }}>
                  <td style={{ padding: '12px', color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>{row.label}</td>
                  <td style={{ padding: '12px', color: '#a8a8b3', fontSize: '14px' }}>{fmtIdx(row.a)}</td>
                  <td style={{ padding: '12px', color: '#a8a8b3', fontSize: '14px' }}>{fmtIdx(row.b)}</td>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: '700', color: diffColor(row.a, row.b) }}>
                    {diffLabel(row.a, row.b)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Real estate cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          margin: '0 0 32px'
        }}>
          {[
            { label: 'Median 1BR Rent', aVal: fmt(cityA.medRent1br) + '/mo', bVal: fmt(cityB.medRent1br) + '/mo' },
            { label: 'Median Home Price', aVal: fmt(cityA.medHomePrice), bVal: fmt(cityB.medHomePrice) },
            { label: 'Median Household Income', aVal: fmt(cityA.medHouseholdIncome), bVal: fmt(cityB.medHouseholdIncome) },
          ].map(row => (
            <div key={row.label} style={{ background: '#1e2d4a', borderRadius: '12px', padding: '20px' }}>
              <p style={{ color: '#a8a8b3', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>{row.label}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#a8a8b3', fontSize: '11px', marginBottom: '2px' }}>{cityA.name}</div>
                  <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700' }}>{row.aVal}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#a8a8b3', fontSize: '11px', marginBottom: '2px' }}>{cityB.name}</div>
                  <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700' }}>{row.bVal}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ShareButtons
          text={`${cityA.name} vs ${cityB.name}: ${cityB.name} is ${Math.abs(pctDiff)}% ${isMoreExpensive ? 'more expensive' : 'cheaper'} overall. See the full breakdown at Dayblip 🏙️`}
          url={`https://www.dayblip.com/compare/${slug}`}
          title={`${cityA.name} vs ${cityB.name} Cost of Living Comparison`}
          tiktokText={`${cityA.name} vs ${cityB.name} — which is cheaper to live in? 🏙️ The answer might surprise you. #costofli ving #relocation #citylife`}
          instagramText={`${cityA.name} vs ${cityB.name}: ${cityB.name} is ${Math.abs(pctDiff)}% ${isMoreExpensive ? 'more expensive' : 'cheaper'}. Full breakdown at dayblip.com/compare/${slug}`}
        />

        <FAQAccordion items={faqItems} />

        <RelatedTools tools={[
          { emoji: '🏙️', title: 'Cost of Living Calculator', desc: 'Enter your salary and compare cities', href: '/tools/cost-of-living' },
          { emoji: '💼', title: 'Salary Data', desc: 'Average salaries by job and state', href: '/salary' },
          { emoji: '💰', title: 'Take-Home Pay', desc: 'What you keep after taxes', href: '/finance/take-home-pay' },
          { emoji: '📊', title: 'Where You Rank', desc: 'Your income percentile nationally', href: '/tools/where-you-rank' }
        ]} />

        <LastUpdated date="June 2026" />
        <MethodologyNote text="Cost of living indices from C2ER Cost of Living Index 2024-2025. Rent data from Zillow December 2024. Home price data from Zillow Home Value Index December 2024. Household income from US Census Bureau ACS 2023. National average COLI = 100. Data updated annually." />
      </div>
    </main>
  )
}

// ─── JOB COMPARISON ──────────────────────────────────────────────────────────

function JobComparison({ jobA, jobB, slug }: {
  jobA: SalaryEntry
  jobB: SalaryEntry
  slug: string
}) {
  const pctDiff = Math.round(((jobB.national - jobA.national) / jobA.national) * 100)
  const isHigher = pctDiff > 0

  const stateComparisons = STATES.map(state => ({
    state,
    salaryA: jobA.states[state.abbreviation] ?? jobA.national,
    salaryB: jobB.states[state.abbreviation] ?? jobB.national,
  }))

  const top5ForB = [...stateComparisons]
    .sort((a, b) => (b.salaryB - b.salaryA) - (a.salaryB - a.salaryA))
    .slice(0, 5)

  const top5ForA = [...stateComparisons]
    .sort((a, b) => (b.salaryA - b.salaryB) - (a.salaryA - a.salaryB))
    .slice(0, 5)

  const sortedByA = [...STATES].sort(
    (a, b) => (jobA.states[b.abbreviation] ?? jobA.national) - (jobA.states[a.abbreviation] ?? jobA.national)
  )
  const sortedByB = [...STATES].sort(
    (a, b) => (jobB.states[b.abbreviation] ?? jobB.national) - (jobB.states[a.abbreviation] ?? jobB.national)
  )
  const topStateA = sortedByA[0]
  const topStateB = sortedByB[0]
  const topSalaryA = jobA.states[topStateA.abbreviation] ?? jobA.national
  const topSalaryB = jobB.states[topStateB.abbreviation] ?? jobB.national

  const gap = Math.abs(jobB.national - jobA.national)
  const compoundedGap = Math.round(gap * 0.12 * ((Math.pow(1.07, 30) - 1) / 0.07))

  const faqItems = [
    {
      question: `Do ${jobA.job}s or ${jobB.job}s earn more?`,
      answer: `${isHigher ? jobB.job : jobA.job}s earn more nationally. The median annual salary for ${jobA.job}s is ${fmt(jobA.national)} versus ${fmt(jobB.national)} for ${jobB.job}s — a difference of ${fmt(gap)} per year or ${fmt(Math.round(gap / 12))} per month.`
    },
    {
      question: `What is the salary difference between ${jobA.job} and ${jobB.job}?`,
      answer: `The national median salary gap between ${jobA.job}s and ${jobB.job}s is ${fmt(gap)} per year. ${isHigher ? jobB.job : jobA.job}s earn ${Math.abs(pctDiff)}% more. Over a 30-year career this difference, if invested at 7% annual return, compounds to approximately ${fmt(compoundedGap)}.`
    },
    {
      question: `Which state pays ${jobA.job}s the most?`,
      answer: `Based on BLS OES 2024-2025 data, ${topStateA.name} pays ${jobA.job}s the highest median salary at ${fmt(topSalaryA)} per year.`
    },
    {
      question: `Which state pays ${jobB.job}s the most?`,
      answer: `Based on BLS OES 2024-2025 data, ${topStateB.name} pays ${jobB.job}s the highest median salary at ${fmt(topSalaryB)} per year.`
    },
    {
      question: `Is a ${jobA.job} or ${jobB.job} career better?`,
      answer: `Salary is one factor — ${isHigher ? jobB.job : jobA.job}s earn more nationally. But career choice involves job satisfaction, work-life balance, education requirements, and job growth. ${jobA.blsTitle} and ${jobB.blsTitle} both have different educational paths, licensing requirements, and long-term growth projections. Use salary as a starting point, not the only factor.`
    },
    {
      question: `How much do ${jobA.job}s and ${jobB.job}s make per hour?`,
      answer: `Based on a standard 2,080-hour work year, ${jobA.job}s earn approximately ${fmt(Math.round(jobA.national / 2080))} per hour nationally and ${jobB.job}s earn approximately ${fmt(Math.round(jobB.national / 2080))} per hour. Actual hourly rates vary based on overtime, part-time work, and whether the role is salaried or hourly.`
    }
  ]

  return (
    <main style={{ background: '#0d1b2a', minHeight: '100vh', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `Do ${jobA.job}s or ${jobB.job}s earn more?`,
                acceptedAnswer: { '@type': 'Answer', text: `${isHigher ? jobB.job : jobA.job}s earn more. Median: ${jobA.job} ${fmt(jobA.national)}/yr vs ${jobB.job} ${fmt(jobB.national)}/yr — a ${fmt(gap)} gap.` }
              },
              {
                '@type': 'Question',
                name: `What is the salary difference between ${jobA.job} and ${jobB.job}?`,
                acceptedAnswer: { '@type': 'Answer', text: `The national median salary gap is ${fmt(gap)} per year. ${isHigher ? jobB.job : jobA.job}s earn ${Math.abs(pctDiff)}% more.` }
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: `${jobA.job} vs ${jobB.job} Salary Comparison`,
            url: `https://www.dayblip.com/compare/${slug}`,
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: `Compare ${jobA.job} and ${jobB.job} salaries nationally and by state using BLS OES 2024-2025 data.`
          })
        }}
      />

      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Compare', href: '/compare' },
          { label: `${jobA.job} vs ${jobB.job}` }
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
          {jobA.job} vs {jobB.job} Salary
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '15px', margin: '0 0 24px' }}>
          National salary comparison — BLS OES 2024-2025 data
        </p>

        <div style={{ background: '#1e2d4a', borderLeft: '4px solid #e94560', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }}>
          <p style={{ color: '#e94560', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>QUICK ANSWER</p>
          <p style={{ color: '#ffffff', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
            {jobA.job}s earn a national median of{' '}
            <strong style={{ color: '#e94560' }}>{fmt(jobA.national)}/year</strong>
            {' '}vs {jobB.job}s at{' '}
            <strong style={{ color: '#e94560' }}>{fmt(jobB.national)}/year</strong>.
            {' '}{isHigher ? jobB.job : jobA.job}s earn {Math.abs(pctDiff)}% more nationally.
            The gap is {fmt(gap)} per year — or {fmt(Math.round(gap / 12))} per month.
          </p>
        </div>

        <AuthorByline variant="tool" />

        {/* Head to head */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '16px',
          alignItems: 'center',
          margin: '32px 0'
        }}>
          <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>{jobA.job}</div>
            <div style={{ color: '#e94560', fontSize: '36px', fontWeight: '800' }}>{fmt(jobA.national)}</div>
            <div style={{ color: '#a8a8b3', fontSize: '12px', marginTop: '4px' }}>national median/year</div>
            <div style={{ color: '#a8a8b3', fontSize: '13px', marginTop: '8px' }}>
              {fmt(Math.round(jobA.national / 12))}/mo &bull; {fmt(Math.round(jobA.national / 2080))}/hr
            </div>
          </div>
          <div style={{ color: '#a8a8b3', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>VS</div>
          <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>{jobB.job}</div>
            <div style={{ color: '#e94560', fontSize: '36px', fontWeight: '800' }}>{fmt(jobB.national)}</div>
            <div style={{ color: '#a8a8b3', fontSize: '12px', marginTop: '4px' }}>national median/year</div>
            <div style={{ color: '#a8a8b3', fontSize: '13px', marginTop: '8px' }}>
              {fmt(Math.round(jobB.national / 12))}/mo &bull; {fmt(Math.round(jobB.national / 2080))}/hr
            </div>
          </div>
        </div>

        {/* Salary gap card */}
        <div style={{
          background: '#0d1b2a',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          margin: '0 0 32px',
          borderLeft: '4px solid #e94560'
        }}>
          <p style={{ color: '#a8a8b3', fontSize: '14px', margin: '0 0 8px' }}>Annual salary gap</p>
          <div style={{ color: '#e94560', fontSize: '40px', fontWeight: '800', margin: '0 0 4px' }}>
            {fmt(gap)}
          </div>
          <p style={{ color: '#a8a8b3', fontSize: '13px', margin: 0 }}>
            {isHigher ? jobB.job : jobA.job}s earn {Math.abs(pctDiff)}% more per year nationally.
            Over 30 years at 7% investment return that gap compounds to approximately {fmt(compoundedGap)}.
          </p>
        </div>

        {/* State tables */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '0 0 32px' }}>
          <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', margin: '0 0 4px' }}>
              Best states for {jobB.job}s
            </h3>
            <p style={{ color: '#a8a8b3', fontSize: '12px', margin: '0 0 16px' }}>vs {jobA.job}s</p>
            {top5ForB.map((item, i) => (
              <div key={item.state.abbreviation} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: i < 4 ? '1px solid #0d1b2a' : 'none',
                fontSize: '13px'
              }}>
                <span style={{ color: '#a8a8b3' }}>{item.state.name}</span>
                <span style={{ color: '#4ade80', fontWeight: '600' }}>+{fmt(item.salaryB - item.salaryA)}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', margin: '0 0 4px' }}>
              Best states for {jobA.job}s
            </h3>
            <p style={{ color: '#a8a8b3', fontSize: '12px', margin: '0 0 16px' }}>vs {jobB.job}s</p>
            {top5ForA.map((item, i) => (
              <div key={item.state.abbreviation} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: i < 4 ? '1px solid #0d1b2a' : 'none',
                fontSize: '13px'
              }}>
                <span style={{ color: '#a8a8b3' }}>{item.state.name}</span>
                <span style={{ color: '#4ade80', fontWeight: '600' }}>+{fmt(item.salaryA - item.salaryB)}</span>
              </div>
            ))}
          </div>
        </div>

        <ShareButtons
          text={`${jobA.job} vs ${jobB.job}: ${isHigher ? jobB.job : jobA.job}s earn ${Math.abs(pctDiff)}% more — a ${fmt(gap)}/year gap. See the full comparison at Dayblip 💼`}
          url={`https://www.dayblip.com/compare/${slug}`}
          title={`${jobA.job} vs ${jobB.job} Salary Comparison`}
          tiktokText={`${jobA.job} vs ${jobB.job} salary — which career pays more? 💼 The gap is ${fmt(gap)}/year. #salary #careerchoices #moneytok`}
          instagramText={`${jobA.job} vs ${jobB.job}: ${fmt(gap)}/year salary gap. See which pays more in your state at dayblip.com/compare/${slug}`}
        />

        <FAQAccordion items={faqItems} />

        <RelatedTools tools={[
          { emoji: '💰', title: 'Salary Data', desc: 'Average salaries by job and state', href: '/salary' },
          { emoji: '💼', title: 'Salary Checker', desc: 'Are you paid fairly?', href: '/tools/salary-checker' },
          { emoji: '🏙️', title: 'Cost of Living', desc: 'Compare cities side by side', href: '/tools/cost-of-living' },
          { emoji: '📊', title: 'Where You Rank', desc: 'Your income percentile nationally', href: '/tools/where-you-rank' }
        ]} />

        <LastUpdated date="June 2026" />
        <MethodologyNote text="Salary data from Bureau of Labor Statistics Occupational Employment and Wage Statistics (OEWS) 2024-2025. Figures represent median annual wages for wage and salary workers. Self-employed excluded. Hourly rates calculated at 2,080 hours per year. State salary figures from same BLS OES dataset. Updated annually." />
      </div>
    </main>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> }

export default async function ComparePage({ params }: Props) {
  const { slug } = await params
  const { type, aSlug, bSlug } = parseSlug(slug)

  if (type === 'city') {
    const cityA = cities.find(c => c.slug === aSlug)
    const cityB = cities.find(c => c.slug === bSlug)
    if (!cityA || !cityB) notFound()
    return <CityComparison cityA={cityA} cityB={cityB} slug={slug} />
  }

  if (type === 'job') {
    const jobA = SALARY_DATA.find(j => j.slug === aSlug)
    const jobB = SALARY_DATA.find(j => j.slug === bSlug)
    if (!jobA || !jobB) notFound()
    return <JobComparison jobA={jobA} jobB={jobB} slug={slug} />
  }

  notFound()
}
