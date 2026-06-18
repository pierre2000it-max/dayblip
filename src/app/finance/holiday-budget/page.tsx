'use client'
import { useState } from 'react'
import ShareButtons from '@/components/ShareButtons'
import FAQAccordion from '@/components/FAQAccordion'
import AuthorByline from '@/components/AuthorByline'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedTools from '@/components/RelatedTools'
import LastUpdated from '@/components/LastUpdated'
import MethodologyNote from '@/components/MethodologyNote'

interface GiftRecipient {
  id: number
  name: string
  amount: string
}

export default function HolidayBudgetPage() {
  const [totalBudget, setTotalBudget] = useState('')
  const [recipients, setRecipients] = useState<GiftRecipient[]>([
    { id: 1, name: 'Spouse / Partner', amount: '' },
    { id: 2, name: 'Child 1', amount: '' },
    { id: 3, name: 'Parent', amount: '' },
  ])
  const [useCredit, setUseCredit] = useState(false)
  const [creditApr, setCreditApr] = useState('24')
  const [monthsToPay, setMonthsToPay] = useState('6')
  const [result, setResult] = useState<{
    totalSpend: number
    budget: number
    remaining: number
    overBudget: boolean
    recipientCount: number
    avgPerPerson: number
    trueCostCredit: number
    interestPaid: number
    monthlyPayment: number
    topRecipient: string
    topAmount: number
  } | null>(null)

  function addRecipient() {
    setRecipients(prev => [
      ...prev,
      { id: Date.now(), name: '', amount: '' }
    ])
  }

  function removeRecipient(id: number) {
    setRecipients(prev => prev.filter(r => r.id !== id))
  }

  function updateRecipient(id: number, field: 'name' | 'amount', value: string) {
    setRecipients(prev => prev.map(r =>
      r.id === id ? { ...r, [field]: value } : r
    ))
  }

  function calculate() {
    const budget = parseFloat(totalBudget) || 0
    const filledRecipients = recipients.filter(r => parseFloat(r.amount) > 0)
    if (filledRecipients.length === 0) return

    const totalSpend = filledRecipients.reduce(
      (sum, r) => sum + (parseFloat(r.amount) || 0), 0
    )
    const remaining = budget - totalSpend
    const overBudget = remaining < 0
    const recipientCount = filledRecipients.length
    const avgPerPerson = totalSpend / recipientCount

    const apr = parseFloat(creditApr) / 100 / 12
    const months = parseFloat(monthsToPay)
    const monthlyPayment = useCredit && apr > 0
      ? totalSpend * (apr * Math.pow(1 + apr, months)) / (Math.pow(1 + apr, months) - 1)
      : 0
    const trueCostCredit = monthlyPayment * months
    const interestPaid = trueCostCredit - totalSpend

    const top = filledRecipients.reduce((a, b) =>
      (parseFloat(a.amount) || 0) > (parseFloat(b.amount) || 0) ? a : b
    )

    setResult({
      totalSpend: Math.round(totalSpend * 100) / 100,
      budget: Math.round(budget * 100) / 100,
      remaining: Math.round(Math.abs(remaining) * 100) / 100,
      overBudget,
      recipientCount,
      avgPerPerson: Math.round(avgPerPerson * 100) / 100,
      trueCostCredit: Math.round(trueCostCredit * 100) / 100,
      interestPaid: Math.round(interestPaid * 100) / 100,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      topRecipient: top.name || 'Top recipient',
      topAmount: parseFloat(top.amount) || 0
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
  }

  const labelStyle: React.CSSProperties = {
    color: '#a8a8b3',
    fontSize: '13px',
    display: 'block',
    marginBottom: '8px',
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much should I spend on holiday gifts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Financial planners generally recommend spending no more than 1-1.5% of your annual income on holiday gifts. On a $60,000 income that is $600-900 total. The National Retail Federation reports the average American spent $932 on holiday gifts in 2024."
        }
      },
      {
        "@type": "Question",
        "name": "How do I avoid going over my holiday budget?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Write every person you plan to buy for before you start shopping. Assign a dollar amount to each person before browsing. Use cash or a dedicated debit card rather than a credit card."
        }
      },
      {
        "@type": "Question",
        "name": "Is it okay to put holiday gifts on a credit card?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Only if you can pay the full balance when the statement arrives in January. If you carry a balance at 24% APR for 6 months on $900 in gifts you will pay approximately $70 in interest."
        }
      }
    ]
  }

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Holiday Budget Planner",
    "url": "https://www.dayblip.com/finance/holiday-budget",
    "description": "Plan your holiday gift budget by recipient. See your total vs budget, cost per person, and the true cost if you put it on a credit card.",
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
        { label: 'Finance', href: '/finance' },
        { label: 'Holiday Budget Planner' }
      ]} />

      <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
        Holiday Budget Planner
      </h1>
      <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px', lineHeight: '1.6' }}>
        The average American spends $932 on holiday gifts and ends up paying
        it off until March. Plan your budget by recipient — and see the true
        cost before you swipe.
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
          The average American household spends $932 on holiday gifts according
          to the National Retail Federation 2024 survey — with 35% going over
          their self-stated budget. The most common mistake is not writing down
          everyone you plan to buy for before starting to shop. Enter your
          recipients and amounts below to see your total and whether you are on track.
        </p>
      </div>

      <AuthorByline variant="tool" />

      {/* Input Section */}
      <div style={{
        background: '#0d1b2a',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '24px',
      }}>
        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '0 0 20px' }}>
          Your Gift List
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>My total holiday gift budget</label>
          <input
            type="number"
            value={totalBudget}
            onChange={e => setTotalBudget(e.target.value)}
            placeholder="$500"
            style={inputStyle}
          />
          <p style={{ color: '#a8a8b3', fontSize: '12px', marginTop: '4px' }}>
            Set this first before adding recipients
          </p>
        </div>

        <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600', margin: '0 0 12px' }}>
          Recipients
        </p>

        <div style={{ margin: '0 0 8px' }}>
          {recipients.map((r, i) => (
            <div key={r.id} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 140px 40px',
              gap: '8px',
              marginBottom: '12px',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder={`Recipient ${i + 1} (e.g. Mom)`}
                value={r.name}
                onChange={e => updateRecipient(r.id, 'name', e.target.value)}
                style={{
                  background: '#1e2d4a',
                  color: '#ffffff',
                  border: '1px solid #2a3f5f',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '15px',
                }}
              />
              <input
                type="number"
                placeholder="$0"
                value={r.amount}
                onChange={e => updateRecipient(r.id, 'amount', e.target.value)}
                style={{
                  background: '#1e2d4a',
                  color: '#ffffff',
                  border: '1px solid #2a3f5f',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '15px',
                }}
              />
              <button
                onClick={() => removeRecipient(r.id)}
                style={{
                  background: '#0d1b2a',
                  color: '#e94560',
                  border: '1px solid #2a3f5f',
                  borderRadius: '8px',
                  padding: '10px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                ×
              </button>
            </div>
          ))}

          <button
            onClick={addRecipient}
            style={{
              background: '#1e2d4a',
              color: '#a8a8b3',
              border: '1px dashed #2a3f5f',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              width: '100%',
              marginBottom: '24px',
            }}
          >
            + Add Another Person
          </button>
        </div>

        {/* Credit card toggle */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Will you put this on a credit card?</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {([false, true] as const).map(val => (
              <button
                key={String(val)}
                onClick={() => setUseCredit(val)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  background: useCredit === val ? '#e94560' : '#1e2d4a',
                  color: '#ffffff',
                }}
              >
                {val ? 'Yes — Credit Card' : 'No — Paying Cash'}
              </button>
            ))}
          </div>
        </div>

        {useCredit && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Credit card APR %</label>
              <input
                type="number"
                value={creditApr}
                onChange={e => setCreditApr(e.target.value)}
                placeholder="24"
                style={inputStyle}
              />
              <p style={{ color: '#a8a8b3', fontSize: '12px', marginTop: '4px' }}>
                Average credit card APR in 2026 is approximately 21-24%
              </p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Months to pay it off</label>
              <input
                type="number"
                value={monthsToPay}
                onChange={e => setMonthsToPay(e.target.value)}
                placeholder="6"
                style={inputStyle}
              />
            </div>
          </>
        )}

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
          }}
        >
          Calculate My Holiday Budget
        </button>
      </div>

      {/* Results */}
      {result !== null && (
        <div>
          {/* Main budget status card */}
          <div style={{
            background: '#1e2d4a',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            marginBottom: '24px',
            borderTop: `4px solid ${result.overBudget ? '#e94560' : '#4ade80'}`,
          }}>
            <p style={{ color: '#a8a8b3', fontSize: '15px', margin: '0 0 8px' }}>
              Total holiday gift spending
            </p>
            <div style={{
              color: result.overBudget ? '#e94560' : '#4ade80',
              fontSize: '64px',
              fontWeight: '800',
              lineHeight: 1,
              margin: '0 0 8px',
            }}>
              ${result.totalSpend.toLocaleString()}
            </div>
            <p style={{ color: '#a8a8b3', fontSize: '15px', margin: 0 }}>
              {result.budget > 0
                ? result.overBudget
                  ? `⚠️ $${result.remaining.toLocaleString()} over your $${result.budget.toLocaleString()} budget`
                  : `✅ $${result.remaining.toLocaleString()} remaining of your $${result.budget.toLocaleString()} budget`
                : `Across ${result.recipientCount} recipients`
              }
            </p>
          </div>

          {/* Stats grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '24px',
          }}>
            {[
              { label: 'Recipients', value: String(result.recipientCount) },
              { label: 'Avg per person', value: `$${result.avgPerPerson.toLocaleString()}` },
              { label: 'Biggest gift', value: `${result.topRecipient}: $${result.topAmount.toLocaleString()}` },
              { label: 'Budget status', value: result.overBudget ? 'Over Budget' : 'On Track' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: '#0d1b2a',
                borderRadius: '12px',
                padding: '16px 20px',
              }}>
                <p style={{ color: '#a8a8b3', fontSize: '12px', margin: '0 0 4px' }}>{stat.label}</p>
                <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: 0 }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recipient breakdown table */}
          <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', margin: '0 0 16px' }}>
              Gift Breakdown
            </h3>
            {recipients
              .filter(r => parseFloat(r.amount) > 0)
              .sort((a, b) => (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0))
              .map((r, i, arr) => (
                <div key={r.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid #0d1b2a' : 'none',
                }}>
                  <span style={{ color: '#a8a8b3', fontSize: '14px' }}>
                    {r.name || `Recipient ${i + 1}`}
                  </span>
                  <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>
                    ${parseFloat(r.amount).toLocaleString()}
                  </span>
                </div>
              ))
            }
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0 0',
              borderTop: '2px solid #e94560',
              marginTop: '8px',
            }}>
              <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700' }}>Total</span>
              <span style={{ color: '#e94560', fontSize: '14px', fontWeight: '700' }}>
                ${result.totalSpend.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Credit card warning */}
          {useCredit && result.monthlyPayment > 0 && (
            <div style={{
              background: '#0d1b2a',
              borderRadius: '12px',
              padding: '20px 24px',
              marginBottom: '24px',
              borderLeft: '4px solid #e94560',
            }}>
              <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', margin: '0 0 12px' }}>
                ⚠️ Credit Card True Cost
              </p>
              {[
                { label: 'Gifts total', value: `$${result.totalSpend.toLocaleString()}` },
                { label: 'Monthly payment', value: `$${result.monthlyPayment.toFixed(2)}` },
                { label: 'Total you will pay', value: `$${result.trueCostCredit.toLocaleString()}` },
                { label: 'Interest charged', value: `$${result.interestPaid.toLocaleString()}` },
              ].map((row, i) => (
                <div key={row.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: i < 3 ? '1px solid #1e2d4a' : 'none',
                }}>
                  <span style={{ color: '#a8a8b3', fontSize: '13px' }}>{row.label}</span>
                  <span style={{
                    color: i === 3 ? '#e94560' : '#ffffff',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}>{row.value}</span>
                </div>
              ))}
              <p style={{ color: '#a8a8b3', fontSize: '13px', marginTop: '12px', lineHeight: '1.6' }}>
                Paying ${result.totalSpend.toLocaleString()} in gifts over {monthsToPay} months
                at {creditApr}% APR adds ${result.interestPaid.toLocaleString()} in interest —
                your holiday generosity costs ${result.trueCostCredit.toLocaleString()} total.
              </p>
            </div>
          )}

          <ShareButtons
            text={`I planned my holiday gift budget — $${result.totalSpend.toLocaleString()} across ${result.recipientCount} people ($${result.avgPerPerson.toLocaleString()} avg per person). ${result.overBudget ? `I'm $${result.remaining.toLocaleString()} over budget 😬` : `$${result.remaining.toLocaleString()} still in budget ✅`}. Plan yours at Dayblip 🎁`}
            url="https://www.dayblip.com/finance/holiday-budget"
            title="Holiday Budget Planner — Dayblip"
            tiktokText={`Holiday gift budget reality check 🎁 $${result.totalSpend.toLocaleString()} across ${result.recipientCount} people. ${result.overBudget ? 'Over budget 😬' : 'On track ✅'} Plan yours free at Dayblip #holidaybudget #giftgiving #moneytok`}
            instagramText={`Holiday budget: $${result.totalSpend.toLocaleString()} for ${result.recipientCount} people 🎁 Free planner at dayblip.com/finance/holiday-budget`}
          />
        </div>
      )}

      <FAQAccordion items={[
        {
          question: "How much should I spend on holiday gifts?",
          answer: "Financial planners generally recommend spending no more than 1-1.5% of your annual income on holiday gifts. On a $60,000 income that is $600-900 total. The National Retail Federation reports the average American spent $932 on holiday gifts in 2024. More important than the total amount is deciding your budget before you start shopping — people who set a budget before browsing spend an average of 23% less than those who shop without a number in mind."
        },
        {
          question: "How do I avoid going over my holiday budget?",
          answer: "Three tactics that work: Write every person you plan to buy for before you start shopping — most overspending comes from impulse gifts for people not on the original list. Assign a dollar amount to each person before shopping — not after browsing. Use cash or a dedicated debit card rather than a credit card — studies show people spend 12-18% more when paying with credit. This calculator is designed to make your list and budget explicit before you spend a dollar."
        },
        {
          question: "Is it okay to put holiday gifts on a credit card?",
          answer: "Only if you can pay the full balance when the statement arrives in January. If you carry a balance at 24% APR for 6 months on $900 in gifts you will pay approximately $70 in interest — effectively raising the cost of every gift by 8%. If you carry it for a full year the interest cost approaches $180. The credit card section of this calculator shows your exact interest cost based on your APR and repayment timeline."
        },
        {
          question: "How much do Americans spend on Christmas gifts on average?",
          answer: "According to the National Retail Federation 2024 Holiday Spending Survey the average American planned to spend $902 on gifts, up from $875 in 2023. Spending breaks down as approximately $641 on family gifts, $171 on friends, and $90 on coworkers and others. Higher income households spend more in absolute terms but a similar percentage of income. The most commonly overspent category is stocking stuffers and small gifts that accumulate unexpectedly."
        },
        {
          question: "What is a good budget for gifts by relationship?",
          answer: "General benchmarks used by financial planners: spouse or partner $50-200 depending on household income and agreements; children $50-150 per child; parents $25-75 each; siblings $20-50; close friends $15-30; coworkers and acquaintances $10-25. These are starting points — what matters more is setting explicit amounts per person before shopping so the total stays within your overall budget."
        },
        {
          question: "How can I spend less on holiday gifts without being cheap?",
          answer: "Five strategies that work: Suggest gift exchanges with groups (Secret Santa, White Elephant) so you buy one quality gift instead of many mediocre ones. Give experiences instead of things — a dinner out or activity is often more memorable than a physical gift. Make homemade gifts for people who value personal touch. Set spending agreements with family — many people are relieved when someone suggests a cap. Give consumables (food, candles, wine) which do not clutter and are universally appreciated."
        }
      ]} />

      <RelatedTools tools={[
        { emoji: '🎊', title: 'New Year Resolution Cost', desc: 'What will your resolutions actually cost?', href: '/tools/new-year-resolution-cost' },
        { emoji: '💰', title: 'Budget Calculator', desc: 'Monthly budget planning', href: '/finance/budget-calculator' },
        { emoji: '💳', title: 'Debt Payoff Calculator', desc: 'Pay off holiday debt faster', href: '/finance/debt-payoff' },
        { emoji: '🛍️', title: 'Black Friday Deal Analyzer', desc: 'Is that deal actually real?', href: '/tools/is-it-worth-it/black-friday-deal' }
      ]} />

      <LastUpdated date="June 2026" />
      <MethodologyNote text="Average American holiday spending from National Retail Federation 2024 Holiday Spending Survey. Credit card interest calculated using standard amortization formula. Average credit card APR of 21-24% from Federal Reserve Consumer Credit G.19 release 2026. Budget recommendations based on general financial planning guidelines — 1-1.5% of gross annual income for total holiday gift spending. Individual circumstances vary significantly. This tool provides estimates for planning purposes only." />
    </div>
  )
}
