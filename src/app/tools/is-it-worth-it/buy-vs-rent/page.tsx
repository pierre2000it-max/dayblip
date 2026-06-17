'use client'
import { useState } from 'react'
import ShareButtons from '@/components/ShareButtons'
import FAQAccordion from '@/components/FAQAccordion'
import AuthorByline from '@/components/AuthorByline'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedTools from '@/components/RelatedTools'
import LastUpdated from '@/components/LastUpdated'
import MethodologyNote from '@/components/MethodologyNote'

export default function BuyVsRentPage() {
  const [homePrice, setHomePrice] = useState('')
  const [downPayment, setDownPayment] = useState('20')
  const [mortgageRate, setMortgageRate] = useState('7.0')
  const [monthlyRent, setMonthlyRent] = useState('')
  const [yearsToStay, setYearsToStay] = useState('')
  const [result, setResult] = useState<{
    verdict: 'BUY' | 'RENT'
    breakevenYears: number
    totalBuyCost: number
    totalRentCost: number
    monthlySavings: number
    netCostDiff: number
  } | null>(null)

  function calculate() {
    const price = parseFloat(homePrice)
    const dp = parseFloat(downPayment) / 100
    const rate = parseFloat(mortgageRate) / 100 / 12
    const rent = parseFloat(monthlyRent)
    const years = parseFloat(yearsToStay)

    if (!price || !rent || !years) return

    const loanAmount = price * (1 - dp)
    const n = 30 * 12
    const monthlyMortgage = loanAmount * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1)

    const propertyTax = price * 0.012 / 12
    const insurance = price * 0.005 / 12
    const maintenance = price * 0.01 / 12
    const totalMonthlyBuy = monthlyMortgage + propertyTax + insurance + maintenance

    const downPaymentAmount = price * dp
    const opportunityCostPerMonth = downPaymentAmount * 0.07 / 12

    const totalMonthlyBuyTrue = totalMonthlyBuy + opportunityCostPerMonth

    const months = years * 12
    const homeValueAtSale = price * Math.pow(1.03, years)
    const equityBuilt = homeValueAtSale - loanAmount * Math.pow(1 + rate, months) + loanAmount

    const totalBuyCost = (totalMonthlyBuyTrue * months) - equityBuilt
    const totalRentCost = rent * months * Math.pow(1.03, years / 2)

    let breakevenYears = 0
    for (let y = 1; y <= 30; y++) {
      const m = y * 12
      const hv = price * Math.pow(1.03, y)
      const eq = hv - loanAmount * Math.pow(1 + rate, m) + loanAmount
      const buyTotal = (totalMonthlyBuyTrue * m) - eq
      const rentTotal = rent * m * Math.pow(1.03, y / 2)
      if (buyTotal < rentTotal) {
        breakevenYears = y
        break
      }
    }

    const verdict = totalBuyCost < totalRentCost ? 'BUY' : 'RENT'
    const netCostDiff = Math.abs(totalBuyCost - totalRentCost)
    const monthlySavings = Math.round(netCostDiff / months)

    setResult({
      verdict,
      breakevenYears: breakevenYears || 30,
      totalBuyCost: Math.round(totalBuyCost),
      totalRentCost: Math.round(totalRentCost),
      monthlySavings,
      netCostDiff: Math.round(netCostDiff)
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
      question: 'Is it better to buy or rent a home?',
      answer: 'It depends primarily on how long you plan to stay. Buying typically beats renting after 5-7 years in most US markets when you account for equity building, home appreciation at approximately 3-4% annually, and the fact that rent increases over time while a fixed-rate mortgage payment stays constant. If you plan to stay fewer than 5 years renting is usually cheaper when you factor in closing costs, down payment opportunity cost, maintenance, and property taxes.'
    },
    {
      question: 'What is the breakeven point for buying vs renting?',
      answer: 'The breakeven point is the number of years you need to stay in a home for buying to be cheaper than renting over the same period. It accounts for your down payment, mortgage payments, property taxes, insurance, maintenance, home appreciation, and equity building. In most US cities the breakeven is 5-7 years. In high-cost cities like San Francisco or New York it can be 10+ years.'
    },
    {
      question: 'What costs does this calculator include for buying?',
      answer: 'This calculator includes monthly mortgage payment based on a 30-year fixed rate, property tax at 1.2% of home value annually, homeowner\'s insurance at 0.5% annually, maintenance at 1% annually, and the opportunity cost of your down payment invested at 7% annual return. It also accounts for home appreciation at 3% per year and the equity you build through mortgage payments.'
    },
    {
      question: 'Should I buy a house in 2026?',
      answer: 'Whether to buy in 2026 depends on your personal situation — your income stability, credit score, down payment savings, how long you plan to stay, and local market conditions. Mortgage rates in 2026 are approximately 6.5-7.5% for a 30-year fixed loan. Use this calculator with your specific numbers to find your personal breakeven point rather than relying on general market advice.'
    },
    {
      question: 'How much should I put down on a house?',
      answer: 'A 20% down payment avoids private mortgage insurance (PMI) which typically costs 0.5-1.5% of the loan amount annually. However putting down less allows you to buy sooner and keep more cash invested. FHA loans allow as little as 3.5% down. The right down payment depends on your PMI cost, how long you plan to stay, and your investment return expectations for the alternative use of that capital.'
    },
    {
      question: 'What is opportunity cost in buying vs renting?',
      answer: 'Opportunity cost is what your down payment could earn if invested instead of used to buy a home. A $90,000 down payment on a $450,000 home invested at 7% annual return would grow to approximately $176,000 in 10 years. This is a real cost of homeownership that most buy vs rent calculators ignore — this calculator includes it.'
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
            name: 'Buy vs Rent Calculator — Is It Worth It?',
            url: 'https://www.dayblip.com/tools/is-it-worth-it/buy-vs-rent',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: 'Calculate whether buying or renting is cheaper based on your home price, rent, and how long you plan to stay.'
          })
        }}
      />

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'Is It Worth It?', href: '/tools/is-it-worth-it' },
          { label: 'Buy vs Rent' }
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
          Buy vs Rent Calculator
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px', lineHeight: '1.6' }}>
          The honest answer to whether buying is better than renting — based on your specific numbers
        </p>

        <div style={{ background: '#1e2d4a', borderLeft: '4px solid #e94560', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }}>
          <div style={{ color: '#e94560', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: '700' }}>
            QUICK ANSWER
          </div>
          {result ? (
            <p style={{ color: '#ffffff', fontSize: '15px', margin: 0, lineHeight: '1.7' }}>
              Based on your inputs, <strong>{result.verdict === 'BUY' ? 'buying is worth it' : 'renting is worth it'}</strong> over {yearsToStay} years.{' '}
              {result.verdict === 'BUY'
                ? `Buying saves you approximately $${result.netCostDiff.toLocaleString()} compared to renting. Your breakeven point is ${result.breakevenYears} years.`
                : `Renting saves you approximately $${result.netCostDiff.toLocaleString()} over this period. You would need to stay ${result.breakevenYears} years for buying to make sense.`
              }
            </p>
          ) : (
            <p style={{ color: '#ffffff', fontSize: '15px', margin: 0, lineHeight: '1.7' }}>
              Buying beats renting in most US markets after 5-7 years. Below that threshold renting is often cheaper when you factor in down payment opportunity cost, maintenance, taxes, and insurance. Enter your numbers to find your personal breakeven point.
            </p>
          )}
        </div>

        <AuthorByline variant="tool" />

        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '32px 0 16px' }}>
          Calculate Your Numbers
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Home price</label>
          <input type="number" placeholder="$450,000" value={homePrice} onChange={e => setHomePrice(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Down payment (%)</label>
          <input type="number" placeholder="20" value={downPayment} onChange={e => setDownPayment(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Mortgage interest rate (%)</label>
          <input type="number" placeholder="7.0" value={mortgageRate} onChange={e => setMortgageRate(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Monthly rent (alternative)</label>
          <input type="number" placeholder="$2,000" value={monthlyRent} onChange={e => setMonthlyRent(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Years planning to stay</label>
          <input type="number" placeholder="7" value={yearsToStay} onChange={e => setYearsToStay(e.target.value)} style={inputStyle} />
        </div>

        <button
          onClick={calculate}
          style={{
            width: '100%',
            background: '#e94560',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '8px'
          }}
        >
          Is It Worth It to Buy?
        </button>

        {result && (
          <div style={{ margin: '40px 0' }}>
            <div style={{
              background: '#1e2d4a',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              marginBottom: '24px',
              borderTop: `4px solid ${result.verdict === 'BUY' ? '#4ade80' : '#e94560'}`
            }}>
              <div style={{
                color: result.verdict === 'BUY' ? '#4ade80' : '#e94560',
                fontSize: '36px',
                fontWeight: '800',
                marginBottom: '8px'
              }}>
                {result.verdict === 'BUY' ? '✅ YES — Buy' : '❌ NOT YET — Keep Renting'}
              </div>
              <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px' }}>
                {result.verdict === 'BUY'
                  ? `Buying saves you $${result.netCostDiff.toLocaleString()} over ${yearsToStay} years`
                  : `Renting saves you $${result.netCostDiff.toLocaleString()} over ${yearsToStay} years`
                }
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                borderTop: '1px solid #0d1b2a',
                paddingTop: '24px'
              }}>
                {[
                  { label: 'Breakeven point', value: `${result.breakevenYears} years` },
                  { label: 'Monthly difference', value: `$${result.monthlySavings.toLocaleString()}` },
                  { label: 'Total buy cost', value: `$${result.totalBuyCost.toLocaleString()}` },
                  { label: 'Total rent cost', value: `$${result.totalRentCost.toLocaleString()}` },
                ].map(stat => (
                  <div key={stat.label}>
                    <div style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700' }}>{stat.value}</div>
                    <div style={{ color: '#a8a8b3', fontSize: '13px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <ShareButtons
              text={`Is it worth it to buy vs rent? Based on my numbers: ${result.verdict === 'BUY' ? 'YES — buying saves me $' + result.netCostDiff.toLocaleString() : 'NOT YET — renting saves me $' + result.netCostDiff.toLocaleString()}. Calculate yours at Dayblip 🏠`}
              url="https://www.dayblip.com/tools/is-it-worth-it/buy-vs-rent"
              title="Buy vs Rent Calculator — Is It Worth It?"
            />
          </div>
        )}

        <FAQAccordion items={faqItems} />

        <RelatedTools tools={[
          { emoji: '🚗', title: 'Lease vs Buy a Car', desc: 'Which is cheaper over 5 years?', href: '/tools/is-it-worth-it/lease-vs-buy-car' },
          { emoji: '💰', title: 'Take-Home Pay', desc: 'What you keep after taxes', href: '/finance/take-home-pay' },
          { emoji: '🏙️', title: 'Cost of Living', desc: 'Compare cities side by side', href: '/tools/cost-of-living' },
          { emoji: '📅', title: 'FI Date', desc: 'When could you stop working?', href: '/tools/fi-date' }
        ]} />

        <LastUpdated date="June 2026" />
        <MethodologyNote text="Home appreciation assumed at 3% annually based on historical US national average (Federal Housing Finance Agency HPI). Investment return on down payment assumed at 7% annually based on long-term S&P 500 historical average. Property tax at 1.2% of home value — US national median (Tax Foundation). Homeowner's insurance at 0.5% of home value. Maintenance at 1% of home value annually. Mortgage uses standard 30-year fixed amortization formula. Rent increases assumed at 3% annually. These are averages — actual results vary significantly by location and market conditions. Not financial advice." />
      </div>
    </main>
  )
}
