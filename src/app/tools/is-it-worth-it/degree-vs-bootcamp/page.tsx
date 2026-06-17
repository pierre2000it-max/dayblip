'use client'
import { useState } from 'react'
import ShareButtons from '@/components/ShareButtons'
import FAQAccordion from '@/components/FAQAccordion'
import AuthorByline from '@/components/AuthorByline'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedTools from '@/components/RelatedTools'
import LastUpdated from '@/components/LastUpdated'
import MethodologyNote from '@/components/MethodologyNote'

export default function DegreeVsBootcampPage() {
  const [degreeCost, setDegreeCost] = useState('120000')
  const [degreeSalary, setDegreeSalary] = useState('75000')
  const [bootcampCost, setBootcampCost] = useState('15000')
  const [bootcampSalary, setBootcampSalary] = useState('65000')
  const [currentAge, setCurrentAge] = useState('22')
  const [result, setResult] = useState<{
    verdict: 'DEGREE' | 'BOOTCAMP'
    degreeBreakeven: number
    tenYearDegree: number
    tenYearBootcamp: number
    twentyYearDegree: number
    twentyYearBootcamp: number
    costDiff: number
    salaryDiff: number
  } | null>(null)

  function calculate() {
    const dc = parseFloat(degreeCost)
    const ds = parseFloat(degreeSalary)
    const bc = parseFloat(bootcampCost)
    const bs = parseFloat(bootcampSalary)

    if (!dc || !ds || !bc || !bs) return

    const degreeOpportunityCost = bs * 4
    const degreeTotalCost = dc + degreeOpportunityCost
    const bootcampTotalCost = bc + (bs * 0.5)

    const salaryDiff = ds - bs
    const degreeBreakeven = salaryDiff > 0
      ? Math.ceil((degreeTotalCost - bootcampTotalCost) / salaryDiff)
      : 99

    let tenYearDegree = -degreeTotalCost
    let tenYearBootcamp = -bootcampTotalCost
    let twentyYearDegree = -degreeTotalCost
    let twentyYearBootcamp = -bootcampTotalCost

    for (let y = 1; y <= 20; y++) {
      const dSalary = ds * Math.pow(1.03, y - 1)
      const bSalary = bs * Math.pow(1.03, y - 1)
      if (y <= 10) {
        tenYearDegree += dSalary
        tenYearBootcamp += bSalary
      }
      twentyYearDegree += dSalary
      twentyYearBootcamp += bSalary
    }

    const verdict = twentyYearDegree > twentyYearBootcamp ? 'DEGREE' : 'BOOTCAMP'

    setResult({
      verdict,
      degreeBreakeven,
      tenYearDegree: Math.round(tenYearDegree),
      tenYearBootcamp: Math.round(tenYearBootcamp),
      twentyYearDegree: Math.round(twentyYearDegree),
      twentyYearBootcamp: Math.round(twentyYearBootcamp),
      costDiff: Math.round(Math.abs(twentyYearDegree - twentyYearBootcamp)),
      salaryDiff: Math.round(salaryDiff)
    })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#1e2d4a',
    color: '#ffffff',
    border: '1px solid #2a3f5f',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none',
  }

  const faqItems = [
    {
      question: 'Is a college degree worth it financially?',
      answer: 'On average yes — but it depends heavily on your major, the school\'s cost, and your career path. Georgetown Center on Education and the Workforce found that bachelor\'s degree holders earn $1.2 million more over a lifetime than high school graduates. However high-cost degrees in low-paying fields can take 20+ years to pay off while lower-cost degrees in high-demand fields may pay back in 5-7 years.'
    },
    {
      question: 'How much does a coding bootcamp cost?',
      answer: 'Coding bootcamps typically cost $10,000-20,000 for a 12-24 week intensive program. Some bootcamps offer income share agreements where you pay nothing upfront and repay a percentage of income after getting a job. The average starting salary for bootcamp graduates is approximately $65,000-75,000 according to Course Report\'s annual survey.'
    },
    {
      question: 'What is the ROI of a college degree vs bootcamp?',
      answer: 'This calculator models the full ROI including opportunity cost — the income you forgo while in school. A 4-year degree costs both tuition ($40,000-$200,000) and 4 years of forgone income. A bootcamp costs $10,000-20,000 and only 3-6 months of forgone income. The degree typically wins over 20+ years if the salary premium is large enough. Over 10 years the bootcamp often wins due to earlier entry into the workforce.'
    },
    {
      question: 'Can you get a tech job without a degree?',
      answer: 'Yes — increasingly so. Major tech companies including Google Apple IBM and Microsoft have removed degree requirements for many roles. Bootcamp graduates regularly land software engineering roles at competitive salaries. However a computer science degree still provides advantages for certain roles particularly at larger companies, graduate school paths, and fields like machine learning that have deep theoretical requirements.'
    },
    {
      question: 'What is opportunity cost in education?',
      answer: 'Opportunity cost in education is the income you give up while attending school rather than working. A 4-year degree at age 22 means forgoing approximately 4 years of entry-level income — often $50,000-70,000 per year totaling $200,000-280,000 in forgone earnings. This is often larger than the tuition cost itself and is the primary reason why lower-cost faster-completion programs can have better short-term ROI.'
    },
    {
      question: 'Does the type of degree matter for ROI?',
      answer: 'Enormously. Georgetown CEW research shows median earnings by major range from $29,000 (early childhood education) to $80,000+ (petroleum and chemical engineering). STEM degrees consistently show the highest ROI while arts and humanities degrees at expensive schools sometimes never fully pay back the investment. This calculator lets you input your specific expected salary — use BLS OES data for your target career to get the most accurate result.'
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
            mainEntity: faqItems.slice(0, 3).map(item => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: { '@type': 'Answer', text: item.answer }
            }))
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Degree vs Bootcamp ROI Calculator — Is It Worth It?',
            url: 'https://www.dayblip.com/tools/is-it-worth-it/degree-vs-bootcamp',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: 'Compare the 10-year and 20-year ROI of a 4-year college degree vs a coding bootcamp including opportunity cost.'
          })
        }}
      />

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'Is It Worth It?', href: '/tools/is-it-worth-it' },
          { label: 'Degree vs Bootcamp' }
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
          Is a Degree Worth It vs Bootcamp?
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px', lineHeight: '1.6' }}>
          Compare the real ROI of a 4-year degree vs a coding bootcamp over 10 and 20 years
        </p>

        <div style={{ background: '#1e2d4a', borderLeft: '4px solid #e94560', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }}>
          <div style={{ color: '#e94560', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: '700' }}>QUICK ANSWER</div>
          {result ? (
            <p style={{ color: '#ffffff', fontSize: '15px', margin: 0, lineHeight: '1.7' }}>
              Over 20 years, <strong>{result.verdict === 'DEGREE' ? 'the degree wins' : 'the bootcamp wins'}</strong> by ${result.costDiff.toLocaleString()} in net earnings.{' '}
              {result.salaryDiff > 0
                ? `The degree pays $${result.salaryDiff.toLocaleString()}/year more — but takes ${result.degreeBreakeven} years to break even on the extra cost and 4 lost years.`
                : `The bootcamp path earns more or equally while costing far less and getting you into the workforce 4 years earlier.`
              }
            </p>
          ) : (
            <p style={{ color: '#ffffff', fontSize: '15px', margin: 0, lineHeight: '1.7' }}>
              Default estimates: 4-year degree costs $120,000, bootcamp costs $15,000. The degree pays $75,000/year to start vs $65,000/year after bootcamp. Over 20 years the degree typically wins — but it takes 8-12 years to break even on the extra cost and 4 lost working years.
            </p>
          )}
        </div>

        <AuthorByline variant="tool" />

        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '32px 0 16px' }}>Calculate Your Numbers</h2>

        {[
          { label: '4-year degree total cost', value: degreeCost, set: setDegreeCost, placeholder: '$120,000' },
          { label: 'Expected starting salary with degree', value: degreeSalary, set: setDegreeSalary, placeholder: '$75,000' },
          { label: 'Bootcamp total cost', value: bootcampCost, set: setBootcampCost, placeholder: '$15,000' },
          { label: 'Expected starting salary after bootcamp', value: bootcampSalary, set: setBootcampSalary, placeholder: '$65,000' },
          { label: 'Current age', value: currentAge, set: setCurrentAge, placeholder: '22' },
        ].map(field => (
          <div key={field.label} style={{ marginBottom: '20px' }}>
            <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>{field.label}</label>
            <input type="number" placeholder={field.placeholder} value={field.value} onChange={e => field.set(e.target.value)} style={inputStyle} />
          </div>
        ))}

        <button
          onClick={calculate}
          style={{ width: '100%', background: '#e94560', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' }}
        >
          Is the Degree Worth It?
        </button>

        {result && (
          <div style={{ margin: '40px 0' }}>
            <div style={{
              background: '#1e2d4a',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              marginBottom: '24px',
              borderTop: `4px solid ${result.verdict === 'DEGREE' ? '#4ade80' : '#e94560'}`
            }}>
              <div style={{ color: result.verdict === 'DEGREE' ? '#4ade80' : '#e94560', fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>
                {result.verdict === 'DEGREE' ? '✅ YES — Degree Wins' : '❌ BOOTCAMP Wins'}
              </div>
              <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px' }}>
                Over 20 years, {result.verdict === 'DEGREE' ? 'the degree' : 'the bootcamp'} nets ${result.costDiff.toLocaleString()} more
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', borderTop: '1px solid #0d1b2a', paddingTop: '24px' }}>
                {[
                  { label: '10-yr net (degree)', value: `$${result.tenYearDegree.toLocaleString()}` },
                  { label: '10-yr net (bootcamp)', value: `$${result.tenYearBootcamp.toLocaleString()}` },
                  { label: '20-yr net (degree)', value: `$${result.twentyYearDegree.toLocaleString()}` },
                  { label: '20-yr net (bootcamp)', value: `$${result.twentyYearBootcamp.toLocaleString()}` },
                  { label: 'Degree breakeven', value: `${result.degreeBreakeven} years` },
                  { label: 'Annual salary gap', value: `$${result.salaryDiff.toLocaleString()}` },
                ].map(stat => (
                  <div key={stat.label}>
                    <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700' }}>{stat.value}</div>
                    <div style={{ color: '#a8a8b3', fontSize: '13px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <ShareButtons
              text={`Is a college degree worth it vs a bootcamp? Over 20 years: degree nets $${result.twentyYearDegree.toLocaleString()} vs bootcamp $${result.twentyYearBootcamp.toLocaleString()}. Calculate yours at Dayblip 🎓`}
              url="https://www.dayblip.com/tools/is-it-worth-it/degree-vs-bootcamp"
              title="Degree vs Bootcamp Calculator — Is It Worth It?"
            />
          </div>
        )}

        <FAQAccordion items={faqItems} />

        <RelatedTools tools={[
          { emoji: '💼', title: 'Salary by Job and State', desc: 'See what your career actually pays', href: '/salary' },
          { emoji: '💰', title: 'Student Loan Calculator', desc: 'True cost of your student debt', href: '/finance/student-loan' },
          { emoji: '📊', title: 'Where You Rank', desc: 'Your income percentile nationally', href: '/tools/where-you-rank' },
          { emoji: '📅', title: 'FI Date', desc: 'When could you stop working?', href: '/tools/fi-date' }
        ]} />

        <LastUpdated date="June 2026" />
        <MethodologyNote text="Salary growth modeled at 3% annually based on BLS Employment Cost Index historical average. Opportunity cost for 4-year degree calculated as 4 years of bootcamp starting salary. Opportunity cost for bootcamp calculated as 6 months of bootcamp starting salary. All calculations in nominal dollars — not inflation adjusted. Average bootcamp cost from Course Report 2024 annual survey. Average degree cost from College Board Trends in College Pricing 2024. Not financial advice." />
      </div>
    </main>
  )
}
