'use client'
import { useState } from 'react'
import ShareButtons from '@/components/ShareButtons'
import FAQAccordion from '@/components/FAQAccordion'
import AuthorByline from '@/components/AuthorByline'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedTools from '@/components/RelatedTools'
import LastUpdated from '@/components/LastUpdated'
import MethodologyNote from '@/components/MethodologyNote'

interface Resolution {
  id: string
  label: string
  category: string
  emoji: string
  enabled: boolean
  monthlyCost: string
  defaultCost: number
  tip: string
}

const DEFAULT_RESOLUTIONS: Resolution[] = [
  {
    id: 'gym',
    label: 'Gym Membership',
    category: 'Health & Fitness',
    emoji: '💪',
    enabled: false,
    monthlyCost: '',
    defaultCost: 50,
    tip: 'Budget gyms: $10-25/mo. Mid-tier: $40-60/mo. Premium: $100-250/mo.'
  },
  {
    id: 'meal-prep',
    label: 'Healthy Meal Prep / Meal Kit Service',
    category: 'Health & Fitness',
    emoji: '🥗',
    enabled: false,
    monthlyCost: '',
    defaultCost: 120,
    tip: 'HelloFresh, Blue Apron etc: $8-12 per serving. 4 meals/week ≈ $140-200/mo.'
  },
  {
    id: 'therapy',
    label: 'Therapy / Mental Health',
    category: 'Mental Health',
    emoji: '🧠',
    enabled: false,
    monthlyCost: '',
    defaultCost: 200,
    tip: 'In-person: $100-250/session. Apps (BetterHelp, Talkspace): $60-100/mo.'
  },
  {
    id: 'meditation',
    label: 'Meditation App',
    category: 'Mental Health',
    emoji: '🧘',
    enabled: false,
    monthlyCost: '',
    defaultCost: 13,
    tip: 'Headspace: $12.99/mo. Calm: $14.99/mo. Many free alternatives exist.'
  },
  {
    id: 'online-course',
    label: 'Online Learning / Course',
    category: 'Career & Education',
    emoji: '📚',
    enabled: false,
    monthlyCost: '',
    defaultCost: 30,
    tip: 'Coursera: $49/mo. LinkedIn Learning: $39.99/mo. Udemy: pay-per-course.'
  },
  {
    id: 'coaching',
    label: 'Career Coach / Life Coach',
    category: 'Career & Education',
    emoji: '🎯',
    enabled: false,
    monthlyCost: '',
    defaultCost: 300,
    tip: 'Life coaches: $100-500/session. Career coaches: $150-400/session.'
  },
  {
    id: 'running-gear',
    label: 'Running / Exercise Equipment',
    category: 'Health & Fitness',
    emoji: '👟',
    enabled: false,
    monthlyCost: '',
    defaultCost: 50,
    tip: 'One-time purchase spread over 12 months. Shoes: $100-180. Gear varies.'
  },
  {
    id: 'diet-app',
    label: 'Diet / Nutrition App',
    category: 'Health & Fitness',
    emoji: '🍎',
    enabled: false,
    monthlyCost: '',
    defaultCost: 10,
    tip: 'MyFitnessPal Premium: $19.99/mo. Noom: $59/mo. Many free options.'
  },
  {
    id: 'books',
    label: 'Books / Reading Subscription',
    category: 'Personal Growth',
    emoji: '📖',
    enabled: false,
    monthlyCost: '',
    defaultCost: 15,
    tip: 'Audible: $14.95/mo. Kindle Unlimited: $11.99/mo. Library card: free.'
  },
  {
    id: 'travel',
    label: 'Travel / Adventure Fund',
    category: 'Lifestyle',
    emoji: '✈️',
    enabled: false,
    monthlyCost: '',
    defaultCost: 150,
    tip: 'Monthly savings toward a trip goal. Varies by destination and frequency.'
  },
  {
    id: 'social',
    label: 'Social / Dating Apps',
    category: 'Lifestyle',
    emoji: '💬',
    enabled: false,
    monthlyCost: '',
    defaultCost: 30,
    tip: 'Hinge+: $29.99/mo. Bumble Premium: $24.99/mo. Match: $20.99/mo.'
  },
  {
    id: 'custom',
    label: 'Other Resolution',
    category: 'Custom',
    emoji: '⭐',
    enabled: false,
    monthlyCost: '',
    defaultCost: 0,
    tip: 'Add any other monthly cost for a resolution not listed above.'
  },
]

export default function NewYearResolutionCostPage() {
  const [resolutions, setResolutions] = useState<Resolution[]>(DEFAULT_RESOLUTIONS)
  const [result, setResult] = useState<{
    totalMonthly: number
    totalAnnual: number
    enabledCount: number
    topResolution: string
    topCost: number
    categories: { name: string; monthly: number }[]
  } | null>(null)

  function toggleResolution(id: string) {
    setResolutions(prev => prev.map(r =>
      r.id === id
        ? { ...r, enabled: !r.enabled, monthlyCost: !r.enabled && !r.monthlyCost ? String(r.defaultCost) : r.monthlyCost }
        : r
    ))
  }

  function updateCost(id: string, value: string) {
    setResolutions(prev => prev.map(r =>
      r.id === id ? { ...r, monthlyCost: value } : r
    ))
  }

  function calculate() {
    const enabled = resolutions.filter(r => r.enabled && parseFloat(r.monthlyCost) > 0)
    if (enabled.length === 0) return

    const totalMonthly = enabled.reduce((sum, r) => sum + (parseFloat(r.monthlyCost) || 0), 0)
    const totalAnnual = totalMonthly * 12
    const enabledCount = enabled.length

    const top = enabled.reduce((a, b) =>
      (parseFloat(a.monthlyCost) || 0) > (parseFloat(b.monthlyCost) || 0) ? a : b
    )

    const catMap: Record<string, number> = {}
    for (const r of enabled) {
      catMap[r.category] = (catMap[r.category] || 0) + (parseFloat(r.monthlyCost) || 0)
    }
    const categories = Object.entries(catMap)
      .map(([name, monthly]) => ({ name, monthly }))
      .sort((a, b) => b.monthly - a.monthly)

    setResult({
      totalMonthly: Math.round(totalMonthly * 100) / 100,
      totalAnnual: Math.round(totalAnnual),
      enabledCount,
      topResolution: top.label,
      topCost: parseFloat(top.monthlyCost) || 0,
      categories
    })
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much do New Year's resolutions cost on average?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The most popular resolution — getting fit — costs $600-1,200 per year in gym membership. Add a meal prep service at $150/month, a fitness app at $10-20/month, and new workout gear and the total easily reaches $2,500-3,000 annually."
        }
      },
      {
        "@type": "Question",
        "name": "What percentage of people keep their New Year's resolutions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Research from the University of Scranton found that only 8% of people fully achieve their New Year's resolutions. Approximately 80% fail by February."
        }
      },
      {
        "@type": "Question",
        "name": "Is a gym membership worth it for a New Year's resolution?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Only if you will go consistently. At $50 per month you need to visit at least 5 times per month to keep your cost under $10 per visit — a reasonable benchmark."
        }
      }
    ]
  }

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "New Year Resolution Cost Calculator",
    "url": "https://www.dayblip.com/tools/new-year-resolution-cost",
    "description": "Calculate the real annual cost of your New Year's resolutions — gym, meal prep, therapy, courses, apps, and more.",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 20px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <Breadcrumb crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Tools', href: '/tools' },
        { label: 'New Year Resolution Cost' }
      ]} />

      <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
        New Year Resolution Cost Calculator
      </h1>
      <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px', lineHeight: '1.6' }}>
        The average person commits to 3-4 resolutions in January and
        abandons most by February. Before you commit — see what they will
        actually cost you for a full year.
      </p>

      {/* Quick Answer Box */}
      <div style={{
        background: '#1e2d4a',
        borderLeft: '4px solid #e94560',
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '28px',
      }}>
        <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', margin: '0 0 6px' }}>
          Quick Answer
        </p>
        <p style={{ color: '#a8a8b3', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
          The most popular New Year&apos;s resolution — getting fit — costs $600-1,200
          per year in gym membership alone. Add meal prep, a fitness app, and new
          gear and you are looking at $2,000+ annually. Most people set resolutions
          without calculating the financial commitment. Select your resolutions below
          to see the real price tag.
        </p>
      </div>

      <AuthorByline variant="tool" />

      {/* Resolution Selector */}
      <div style={{
        background: '#0d1b2a',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '24px',
      }}>
        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '0 0 6px' }}>
          Select Your 2026 Resolutions
        </h2>
        <p style={{ color: '#a8a8b3', fontSize: '14px', margin: '0 0 20px', lineHeight: '1.6' }}>
          Toggle each resolution you are committing to and adjust the monthly cost to match your plan.
        </p>

        {resolutions.map(r => (
          <div key={r.id} style={{
            background: r.enabled ? '#1e2d4a' : '#0d1b2a',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '12px',
            border: `1px solid ${r.enabled ? '#e94560' : '#2a3f5f'}`,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: r.enabled ? '12px' : 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{r.emoji}</span>
                <div>
                  <div style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600' }}>
                    {r.label}
                  </div>
                  <div style={{ color: '#a8a8b3', fontSize: '12px' }}>
                    {r.category}
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleResolution(r.id)}
                style={{
                  background: r.enabled ? '#e94560' : '#1e2d4a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '700',
                  minWidth: '60px',
                }}
              >
                {r.enabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {r.enabled && (
              <div>
                <label style={{ color: '#a8a8b3', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                  Monthly cost ($)
                </label>
                <input
                  type="number"
                  value={r.monthlyCost}
                  onChange={e => updateCost(r.id, e.target.value)}
                  placeholder={String(r.defaultCost)}
                  style={{
                    background: '#0d1b2a',
                    color: '#ffffff',
                    border: '1px solid #2a3f5f',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '15px',
                    width: '140px',
                  }}
                />
                <p style={{ color: '#a8a8b3', fontSize: '12px', marginTop: '6px', fontStyle: 'italic' }}>
                  {r.tip}
                </p>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={calculate}
          style={{
            width: '100%',
            padding: '16px',
            background: '#e94560',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '17px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '8px',
          }}
        >
          Calculate My Resolution Cost
        </button>
      </div>

      {/* Results */}
      {result !== null && (
        <div>
          {/* Main cost card */}
          <div style={{
            background: '#1e2d4a',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            marginBottom: '24px',
            borderTop: '4px solid #e94560',
          }}>
            <p style={{ color: '#a8a8b3', fontSize: '15px', margin: '0 0 8px' }}>
              Your 2026 resolution price tag
            </p>
            <div style={{ color: '#e94560', fontSize: '64px', fontWeight: '800', lineHeight: 1, margin: '0 0 8px' }}>
              ${result.totalAnnual.toLocaleString()}
            </div>
            <p style={{ color: '#a8a8b3', fontSize: '14px', margin: 0 }}>
              ${result.totalMonthly.toLocaleString()}/month across {result.enabledCount} resolutions
            </p>
          </div>

          {/* Stats grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '24px',
          }}>
            {[
              { label: 'Monthly total', value: `$${result.totalMonthly.toLocaleString()}` },
              { label: 'Annual total', value: `$${result.totalAnnual.toLocaleString()}` },
              { label: 'Biggest commitment', value: result.topResolution },
            ].map(stat => (
              <div key={stat.label} style={{
                background: '#0d1b2a',
                borderRadius: '12px',
                padding: '16px 20px',
              }}>
                <p style={{ color: '#a8a8b3', fontSize: '12px', margin: '0 0 4px' }}>{stat.label}</p>
                <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', margin: 0, lineHeight: '1.3' }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Category breakdown */}
          <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', margin: '0 0 16px' }}>
              Cost by Category
            </h3>
            {result.categories.map((cat, i) => (
              <div key={cat.name} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: i < result.categories.length - 1 ? '1px solid #0d1b2a' : 'none',
              }}>
                <span style={{ color: '#a8a8b3', fontSize: '14px' }}>{cat.name}</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>
                    ${cat.monthly.toLocaleString()}/mo
                  </span>
                  <span style={{ color: '#a8a8b3', fontSize: '13px', marginLeft: '12px' }}>
                    ${Math.round(cat.monthly * 12).toLocaleString()}/yr
                  </span>
                </div>
              </div>
            ))}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0 0',
              borderTop: '2px solid #e94560',
              marginTop: '8px',
            }}>
              <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700' }}>Total</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#e94560', fontSize: '14px', fontWeight: '700' }}>
                  ${result.totalMonthly.toLocaleString()}/mo
                </span>
                <span style={{ color: '#e94560', fontSize: '14px', fontWeight: '700', marginLeft: '12px' }}>
                  ${result.totalAnnual.toLocaleString()}/yr
                </span>
              </div>
            </div>
          </div>

          {/* Resolution reality check */}
          <div style={{
            background: '#0d1b2a',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '24px',
            borderLeft: '4px solid #a8a8b3',
          }}>
            <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', margin: '0 0 8px' }}>
              💡 The Resolution Reality Check
            </p>
            <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              You are committing ${result.totalAnnual.toLocaleString()} to your resolutions in 2026.
              Research from the University of Scranton found that only 8% of people
              achieve their New Year&apos;s resolutions — meaning 92% of people will spend
              some or all of this money without reaching their goal.
              The resolutions most likely to succeed have specific measurable targets,
              weekly check-ins, and social accountability.
              Consider which of your {result.enabledCount} resolutions have all three.
            </p>
          </div>

          <ShareButtons
            text={`My 2026 New Year's resolutions will cost $${result.totalAnnual.toLocaleString()}/year ($${result.totalMonthly.toLocaleString()}/month). Are yours worth it? Calculate at Dayblip 🎊`}
            url="https://www.dayblip.com/tools/new-year-resolution-cost"
            title="New Year Resolution Cost Calculator — Dayblip"
            tiktokText={`POV: you calculate how much your New Year's resolutions actually cost 😳 Mine: $${result.totalAnnual.toLocaleString()}/year. Calculate yours at Dayblip 🎊 #newyear #resolutions #moneytok`}
            instagramText={`My 2026 resolutions cost $${result.totalAnnual.toLocaleString()}/year 🎊 See what yours cost at dayblip.com/tools/new-year-resolution-cost`}
          />
        </div>
      )}

      <FAQAccordion items={[
        {
          question: "How much do New Year's resolutions cost on average?",
          answer: "The most popular resolution — getting fit — costs $600-1,200 per year in gym membership. Add a meal prep service at $150/month, a fitness app at $10-20/month, and new workout gear and the total easily reaches $2,500-3,000 annually. A therapy resolution at $200/month costs $2,400 per year. Most people set resolutions without calculating the financial commitment — this calculator makes the cost explicit before you commit."
        },
        {
          question: "What percentage of people keep their New Year's resolutions?",
          answer: "Research from the University of Scranton found that only 8% of people fully achieve their New Year's resolutions. Approximately 80% fail by February. The most common reasons for failure are setting too many resolutions simultaneously, setting vague goals without specific measures, and lacking accountability. Resolutions most likely to succeed have specific measurable targets (run a 5K by March, not 'get fit'), weekly progress check-ins, and at least one accountability partner."
        },
        {
          question: "Is a gym membership worth it for a New Year's resolution?",
          answer: "Only if you will go consistently. At $50 per month you need to visit at least 5 times per month to keep your cost under $10 per visit — a reasonable benchmark. The average gym member who joins in January goes 3-4 times in the first month then drops to 1-2 times by March. Use the Dayblip gym membership calculator to find your exact cost per visit breakeven. If your visit frequency does not justify the membership a home gym investment often has better long-term ROI."
        },
        {
          question: "How do I actually keep my New Year's resolutions?",
          answer: "The research is clear on what works: Specific over vague (lose 15 pounds by June vs lose weight), implementation intentions (I will go to the gym every Tuesday and Thursday at 7am vs I will exercise more), habit stacking (attach the new behavior to an existing habit), reducing friction (sleep in gym clothes if you work out in the morning), and social accountability (tell someone your goal or join a group). Financial commitment also helps — people who pay for a course or program complete it at higher rates than those who access it free."
        },
        {
          question: "Should I make financial resolutions for the New Year?",
          answer: "Yes — financial resolutions are among the most impactful you can make. The most effective financial resolutions have specific targets: save $5,000 by December (not save more money), pay off the $3,200 credit card by June (not pay off debt), increase 401k contribution to 6% by February (not invest more). Use the Dayblip First Paycheck and Take-Home Pay calculators to find exactly how much you can redirect to savings goals."
        },
        {
          question: "What are the most popular New Year's resolutions?",
          answer: "According to YouGov and Statista annual surveys the most common New Year's resolutions are: exercise more or improve fitness (50% of resolution-makers), eat healthier (43%), lose weight (37%), save more money (37%), spend more time with family (30%), reduce stress (28%), learn a new skill (25%), and travel more (22%). Notably the top four resolutions all have significant financial costs — making financial planning for your resolutions an important first step."
        }
      ]} />

      <RelatedTools tools={[
        { emoji: '🎁', title: 'Holiday Budget Planner', desc: 'Plan your gift spending by recipient', href: '/finance/holiday-budget' },
        { emoji: '💪', title: 'Gym Membership Worth It?', desc: 'Calculate your cost per visit', href: '/tools/is-it-worth-it/gym-membership' },
        { emoji: '💰', title: 'Budget Calculator', desc: 'Monthly budget planning', href: '/finance/budget-calculator' },
        { emoji: '📅', title: 'Days Until New Year', desc: 'How many days until 2027?', href: '/days-until/new-years-day' }
      ]} />

      <LastUpdated date="June 2026" />
      <MethodologyNote text="Resolution cost defaults based on published pricing from major service providers as of June 2026. Gym membership range from IHRSA 2024 Health Club Consumer Report. Meal kit pricing from HelloFresh, Blue Apron, and Green Chef published rates June 2026. Therapy costs from Mental Health America 2024 cost survey. App pricing from published subscription rates — subject to change. Resolution success rate from University of Scranton Journal of Clinical Psychology research. Popular resolution data from YouGov New Year Survey 2024. All costs are estimates — actual prices vary by provider, location, and plan." />
    </div>
  )
}
