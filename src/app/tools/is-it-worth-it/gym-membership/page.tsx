'use client'
import { useState } from 'react'
import ShareButtons from '@/components/ShareButtons'
import FAQAccordion from '@/components/FAQAccordion'
import AuthorByline from '@/components/AuthorByline'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedTools from '@/components/RelatedTools'
import LastUpdated from '@/components/LastUpdated'
import MethodologyNote from '@/components/MethodologyNote'

export default function GymMembershipPage() {
  const [monthlyFee, setMonthlyFee] = useState('')
  const [initiationFee, setInitiationFee] = useState('0')
  const [visitsPerMonth, setVisitsPerMonth] = useState('')
  const [monthsPerYear, setMonthsPerYear] = useState('12')
  const [homeGymCost, setHomeGymCost] = useState('1500')
  const [result, setResult] = useState<{
    verdict: 'WORTH IT' | 'NOT WORTH IT'
    costPerVisit: number
    annualCost: number
    breakevenVisits: number
    homeGymBreakevenYears: number
    fiveYearGym: number
    fiveYearHome: number
  } | null>(null)

  function calculate() {
    const fee = parseFloat(monthlyFee)
    const initiation = parseFloat(initiationFee)
    const visits = parseFloat(visitsPerMonth)
    const months = parseFloat(monthsPerYear)
    const homeGym = parseFloat(homeGymCost)

    if (!fee || !visits) return

    const annualCost = (fee * months) + initiation
    const totalVisitsPerYear = visits * months
    const costPerVisit = annualCost / totalVisitsPerYear

    const breakevenVisits = Math.ceil(annualCost / 10 / months)

    const fiveYearGym = annualCost * 5 + initiation
    const fiveYearHome = homeGym + (homeGym * 0.05 * 5)

    const homeGymBreakevenYears = Math.ceil(homeGym / annualCost)

    const verdict = costPerVisit < 15 ? 'WORTH IT' : 'NOT WORTH IT'

    setResult({
      verdict,
      costPerVisit: Math.round(costPerVisit * 100) / 100,
      annualCost: Math.round(annualCost),
      breakevenVisits,
      homeGymBreakevenYears,
      fiveYearGym: Math.round(fiveYearGym),
      fiveYearHome: Math.round(fiveYearHome)
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
      question: 'How much does the average gym membership cost?',
      answer: 'The average gym membership in the United States costs approximately $40-50 per month or $480-600 per year according to the International Health, Racquet and Sportsclub Association. Budget gyms like Planet Fitness start at $10-25 per month while premium gyms like Equinox can cost $150-250 per month. Many gyms also charge initiation fees of $0-100 when you join.'
    },
    {
      question: 'How many times per month do I need to go to make a gym membership worth it?',
      answer: 'At $50 per month you need to visit at least 5 times per month to keep your cost per visit below $10 — a reasonable benchmark for a workout facility. At 8 visits per month your cost drops to $6.25 per visit which is genuinely good value. The national average gym visit frequency is approximately 2 visits per week or 8 per month for active members — but the average member actually goes only 1-2 times per week.'
    },
    {
      question: 'Is it cheaper to build a home gym or pay for a gym membership?',
      answer: 'A basic home gym costs $500-2,000 for equipment like adjustable dumbbells, a pull-up bar, resistance bands, and a mat. At $50 per month for a gym membership a basic $1,500 home gym breaks even in 2.5 years. After that every workout is essentially free. A more complete home gym with a power rack and barbell costs $2,000-5,000 but the math still often favors home gym over 5+ years.'
    },
    {
      question: 'Why do people waste money on gym memberships?',
      answer: 'Research from the Journal of Health Economics found that gym members on average pay $17 per visit despite expecting to pay $10 when they signed up — meaning they overestimate how often they will go by about 70%. The gym business model depends on this overestimation — most gyms could not physically accommodate all their members if everyone showed up. Tracking your actual visits with this calculator creates the accountability most members lack.'
    },
    {
      question: 'What is a reasonable cost per gym visit?',
      answer: 'A reasonable cost per gym visit is generally considered $5-15 depending on the facility. Budget gyms at $5-10 per visit are good value. Mid-tier gyms at $10-20 per visit are reasonable if you use the facilities regularly. Above $25 per visit you are likely not going enough to justify the membership and should either increase your frequency or consider a pay-per-visit option.'
    },
    {
      question: 'Are expensive gyms worth the extra cost?',
      answer: 'Premium gyms like Equinox or boutique fitness studios charge $100-250 per month and can be worth it if the environment significantly increases your consistency. Research on exercise adherence suggests that people who enjoy their gym are substantially more likely to maintain their fitness routine. If a premium environment means you go 12 times per month instead of 4 times the cost per visit may actually be similar to a budget gym.'
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
            name: 'Is a Gym Membership Worth It? Cost Per Visit Calculator',
            url: 'https://www.dayblip.com/tools/is-it-worth-it/gym-membership',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: 'Calculate your true cost per gym visit and compare gym membership vs home gym investment.'
          })
        }}
      />

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'Is It Worth It?', href: '/tools/is-it-worth-it' },
          { label: 'Gym Membership' }
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
          Is a Gym Membership Worth It?
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px', lineHeight: '1.6' }}>
          Your real cost per visit — and how many times you need to go to make it worth it
        </p>

        <div style={{ background: '#1e2d4a', borderLeft: '4px solid #e94560', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }}>
          <div style={{ color: '#e94560', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: '700' }}>QUICK ANSWER</div>
          {result ? (
            <p style={{ color: '#ffffff', fontSize: '15px', margin: 0, lineHeight: '1.7' }}>
              Your cost per visit is <strong>${result.costPerVisit}</strong>. Your membership is{' '}
              <strong>{result.verdict}</strong> at your current visit frequency.
              You need to go at least <strong>{result.breakevenVisits} times per month</strong> to keep the cost under $10/visit.
            </p>
          ) : (
            <p style={{ color: '#ffffff', fontSize: '15px', margin: 0, lineHeight: '1.7' }}>
              At $50/month and 8 visits per month your cost is $6.25 per visit — excellent value. At 2 visits per month it jumps to $25 per visit. Enter your numbers to find your real cost.
            </p>
          )}
        </div>

        <AuthorByline variant="tool" />

        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '32px 0 16px' }}>Calculate Your Numbers</h2>

        {[
          { label: 'Monthly membership fee', value: monthlyFee, set: setMonthlyFee, placeholder: '$50' },
          { label: 'Initiation / signup fee', value: initiationFee, set: setInitiationFee, placeholder: '$0' },
          { label: 'Visits per month', value: visitsPerMonth, set: setVisitsPerMonth, placeholder: '8' },
          { label: 'Months per year you use it', value: monthsPerYear, set: setMonthsPerYear, placeholder: '12' },
          { label: 'Home gym equipment cost', value: homeGymCost, set: setHomeGymCost, placeholder: '$1,500' },
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
          Is It Worth It?
        </button>

        {result && (
          <div style={{ margin: '40px 0' }}>
            <div style={{
              background: '#1e2d4a',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              marginBottom: '24px',
              borderTop: `4px solid ${result.verdict === 'WORTH IT' ? '#4ade80' : '#e94560'}`
            }}>
              <div style={{ color: result.verdict === 'WORTH IT' ? '#4ade80' : '#e94560', fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>
                {result.verdict === 'WORTH IT' ? '✅ WORTH IT' : '❌ NOT WORTH IT'}
              </div>
              <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px' }}>
                at ${result.costPerVisit} per visit
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', borderTop: '1px solid #0d1b2a', paddingTop: '24px' }}>
                {[
                  { label: 'Cost per visit', value: `$${result.costPerVisit}` },
                  { label: 'Annual membership cost', value: `$${result.annualCost.toLocaleString()}` },
                  { label: 'Breakeven visits/month', value: `${result.breakevenVisits} visits` },
                  { label: 'Home gym breaks even in', value: `${result.homeGymBreakevenYears} years` },
                  { label: '5-year gym cost', value: `$${result.fiveYearGym.toLocaleString()}` },
                  { label: '5-year home gym cost', value: `$${result.fiveYearHome.toLocaleString()}` },
                ].map(stat => (
                  <div key={stat.label}>
                    <div style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700' }}>{stat.value}</div>
                    <div style={{ color: '#a8a8b3', fontSize: '13px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <ShareButtons
              text={`Is my gym membership worth it? My cost per visit: $${result.costPerVisit}. I need to go ${result.breakevenVisits} times/month to justify it. Calculate yours at Dayblip 💪`}
              url="https://www.dayblip.com/tools/is-it-worth-it/gym-membership"
              title="Is a Gym Membership Worth It? — Dayblip"
            />
          </div>
        )}

        <FAQAccordion items={faqItems} />

        <RelatedTools tools={[
          { emoji: '📺', title: 'Cable vs Streaming', desc: 'Is cutting the cord worth it?', href: '/tools/is-it-worth-it/cable-vs-streaming' },
          { emoji: '🚬', title: 'Smoking Cost Calculator', desc: 'True cost of smoking vs investing', href: '/tools/smoking-cost' },
          { emoji: '☕', title: 'Latte Factor', desc: 'Small habits, big financial impact', href: '/curiosity/latte-factor' },
          { emoji: '💰', title: 'True Hourly Wage', desc: 'What your time is actually worth', href: '/tools/true-hourly-wage' }
        ]} />

        <LastUpdated date="June 2026" />
        <MethodologyNote text="Cost per visit calculated as total annual membership cost divided by total annual visits. Breakeven visit threshold set at $10 per visit — a commonly cited benchmark for fitness facility value. Home gym maintenance assumed at 5% of equipment cost annually. 5-year comparison includes initiation fee in year 1 for gym membership. Home gym assumes no monthly ongoing costs beyond maintenance. Sources: IHRSA Health Club Consumer Report 2024; Journal of Health Economics gym attendance research." />
      </div>
    </main>
  )
}
