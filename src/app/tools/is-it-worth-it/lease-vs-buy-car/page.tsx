'use client'
import { useState } from 'react'
import ShareButtons from '@/components/ShareButtons'
import FAQAccordion from '@/components/FAQAccordion'
import AuthorByline from '@/components/AuthorByline'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedTools from '@/components/RelatedTools'
import LastUpdated from '@/components/LastUpdated'
import MethodologyNote from '@/components/MethodologyNote'

export default function LeaseVsBuyCarPage() {
  const [carPrice, setCarPrice] = useState('')
  const [leasePayment, setLeasePayment] = useState('')
  const [leaseTerm, setLeaseTerm] = useState('36')
  const [leaseDownPayment, setLeaseDownPayment] = useState('0')
  const [buyDownPayment, setBuyDownPayment] = useState('20')
  const [loanRate, setLoanRate] = useState('7.0')
  const [loanTerm, setLoanTerm] = useState('60')
  const [milesPerYear, setMilesPerYear] = useState('12000')
  const [result, setResult] = useState<{
    verdict: 'LEASE' | 'BUY'
    totalLeaseCost: number
    totalBuyCost: number
    costDiff: number
    monthlyLease: number
    monthlyBuy: number
    residualValue: number
  } | null>(null)

  function calculate() {
    const price = parseFloat(carPrice)
    const leasePaymentNum = parseFloat(leasePayment)
    const leaseTermNum = parseFloat(leaseTerm)
    const leaseDP = parseFloat(leaseDownPayment)
    const buyDP = parseFloat(buyDownPayment) / 100
    const rate = parseFloat(loanRate) / 100 / 12
    const loanTermNum = parseFloat(loanTerm)
    const miles = parseFloat(milesPerYear)

    if (!price || !leasePaymentNum) return

    const leaseMileageOverage = miles > 12000 ? (miles - 12000) * 0.15 * (leaseTermNum / 12) : 0
    const totalLeaseCost = leaseDP + (leasePaymentNum * leaseTermNum) + leaseMileageOverage

    const loanAmount = price * (1 - buyDP)
    const monthlyPayment = rate > 0
      ? loanAmount * (rate * Math.pow(1 + rate, loanTermNum)) / (Math.pow(1 + rate, loanTermNum) - 1)
      : loanAmount / loanTermNum

    const years = leaseTermNum / 12
    const residualValue = price * Math.pow(0.85, years)

    const totalBuyCost = (price * buyDP) + (monthlyPayment * leaseTermNum) - residualValue

    const verdict = totalLeaseCost < totalBuyCost ? 'LEASE' : 'BUY'
    const costDiff = Math.abs(totalLeaseCost - totalBuyCost)

    setResult({
      verdict,
      totalLeaseCost: Math.round(totalLeaseCost),
      totalBuyCost: Math.round(totalBuyCost),
      costDiff: Math.round(costDiff),
      monthlyLease: leasePaymentNum,
      monthlyBuy: Math.round(monthlyPayment),
      residualValue: Math.round(residualValue)
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
      question: 'Is it better to lease or buy a car?',
      answer: 'Buying is almost always cheaper over the long term if you keep the car for many years. Leasing is cheaper in the short term — lower monthly payments and no large down payment — but you own nothing at the end of the lease. Leasing makes sense if you want a new car every 3 years, drive fewer than 12,000 miles per year, and prioritize lower monthly payments. Buying makes sense if you drive a lot, keep cars long-term, or want to build equity in an asset.'
    },
    {
      question: 'What are the hidden costs of leasing a car?',
      answer: 'Lease agreements typically include mileage limits of 10,000-15,000 miles per year with overage fees of $0.10-0.25 per mile. Excessive wear and tear charges at lease return can add hundreds or thousands of dollars. Lease acquisition fees, disposition fees, and gap insurance are additional costs often overlooked. Early lease termination penalties can be extremely expensive — typically the remaining payments plus fees.'
    },
    {
      question: 'What is the residual value in a car lease?',
      answer: 'The residual value is the estimated worth of the car at the end of the lease term — set by the leasing company when you sign. A higher residual value means lower monthly lease payments because you are financing less depreciation. Residual values vary significantly by make and model — vehicles with strong resale values like Toyota and Honda typically have higher residuals and therefore lower lease payments.'
    },
    {
      question: 'How much should I put down on a car lease?',
      answer: 'Financial advisors generally recommend putting $0 down on a car lease. Unlike a home purchase, a lease down payment does not reduce your monthly payment significantly and if the car is totaled or stolen in the first month you lose that down payment entirely. Insurance will only cover the car\'s value — not your down payment. Keep your money invested and pay the monthly lease payment instead.'
    },
    {
      question: 'What happens at the end of a car lease?',
      answer: 'At the end of a car lease you have three options: return the vehicle and lease or buy something new, purchase the vehicle at the predetermined residual value, or in some cases extend the lease. If you return the vehicle you may face charges for excess mileage, excessive wear and tear, and a lease disposition fee typically $300-500. If the car\'s market value exceeds the residual value you may be able to negotiate a favorable purchase.'
    },
    {
      question: 'How is a car loan different from a lease?',
      answer: 'A car loan finances the full purchase of the vehicle — you own the car and build equity with each payment. At the end of the loan you own the car outright. A lease finances only the depreciation during the lease term — you never own the car. Monthly loan payments are typically higher than lease payments for the same vehicle but you build an asset. A loan has no mileage restrictions and no wear-and-tear charges.'
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
            name: 'Lease vs Buy Car Calculator — Is It Worth It?',
            url: 'https://www.dayblip.com/tools/is-it-worth-it/lease-vs-buy-car',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: 'Compare total costs of leasing vs buying a car including payments, down payment, residual value, and mileage.'
          })
        }}
      />

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'Is It Worth It?', href: '/tools/is-it-worth-it' },
          { label: 'Lease vs Buy a Car' }
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
          Lease vs Buy a Car Calculator
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px', lineHeight: '1.6' }}>
          The true cost of leasing vs buying — including residual value, mileage, and loan interest
        </p>

        <div style={{ background: '#1e2d4a', borderLeft: '4px solid #e94560', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }}>
          <div style={{ color: '#e94560', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: '700' }}>QUICK ANSWER</div>
          {result ? (
            <p style={{ color: '#ffffff', fontSize: '15px', margin: 0, lineHeight: '1.7' }}>
              Based on your inputs, <strong>{result.verdict === 'LEASE' ? 'leasing is cheaper' : 'buying is cheaper'}</strong> over {leaseTerm} months by ${result.costDiff.toLocaleString()}.
            </p>
          ) : (
            <p style={{ color: '#ffffff', fontSize: '15px', margin: 0, lineHeight: '1.7' }}>
              Leasing is cheaper month-to-month but you own nothing at the end. Buying costs more upfront but you keep the residual value. Enter your numbers to see which is cheaper over the lease term.
            </p>
          )}
        </div>

        <AuthorByline variant="tool" />

        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '32px 0 16px' }}>Calculate Your Numbers</h2>

        {[
          { label: 'Car price (MSRP)', value: carPrice, set: setCarPrice, placeholder: '$35,000' },
          { label: 'Monthly lease payment', value: leasePayment, set: setLeasePayment, placeholder: '$400' },
          { label: 'Lease term (months)', value: leaseTerm, set: setLeaseTerm, placeholder: '36' },
          { label: 'Lease down payment ($)', value: leaseDownPayment, set: setLeaseDownPayment, placeholder: '$0' },
          { label: 'Buy down payment (%)', value: buyDownPayment, set: setBuyDownPayment, placeholder: '20' },
          { label: 'Loan interest rate (%)', value: loanRate, set: setLoanRate, placeholder: '7.0' },
          { label: 'Loan term (months)', value: loanTerm, set: setLoanTerm, placeholder: '60' },
          { label: 'Miles per year', value: milesPerYear, set: setMilesPerYear, placeholder: '12,000' },
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
          Is It Worth It to Lease?
        </button>

        {result && (
          <div style={{ margin: '40px 0' }}>
            <div style={{
              background: '#1e2d4a',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              marginBottom: '24px',
              borderTop: `4px solid ${result.verdict === 'LEASE' ? '#4ade80' : '#e94560'}`
            }}>
              <div style={{ color: result.verdict === 'LEASE' ? '#4ade80' : '#e94560', fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>
                {result.verdict === 'LEASE' ? '✅ YES — Lease' : '❌ NO — Buy Instead'}
              </div>
              <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px' }}>
                {result.verdict === 'LEASE' ? 'Leasing' : 'Buying'} saves ${result.costDiff.toLocaleString()} over {leaseTerm} months
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', borderTop: '1px solid #0d1b2a', paddingTop: '24px' }}>
                {[
                  { label: 'Total lease cost', value: `$${result.totalLeaseCost.toLocaleString()}` },
                  { label: 'Total buy cost', value: `$${result.totalBuyCost.toLocaleString()}` },
                  { label: 'Monthly lease', value: `$${result.monthlyLease.toLocaleString()}` },
                  { label: 'Monthly buy payment', value: `$${result.monthlyBuy.toLocaleString()}` },
                  { label: 'Car residual value', value: `$${result.residualValue.toLocaleString()}` },
                  { label: 'Cost difference', value: `$${result.costDiff.toLocaleString()}` },
                ].map(stat => (
                  <div key={stat.label}>
                    <div style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700' }}>{stat.value}</div>
                    <div style={{ color: '#a8a8b3', fontSize: '13px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <ShareButtons
              text={`Lease vs buy a car — ${result.verdict === 'LEASE' ? 'leasing' : 'buying'} saves me $${result.costDiff.toLocaleString()} over ${leaseTerm} months. Calculate yours at Dayblip 🚗`}
              url="https://www.dayblip.com/tools/is-it-worth-it/lease-vs-buy-car"
              title="Lease vs Buy Car Calculator — Is It Worth It?"
            />
          </div>
        )}

        <FAQAccordion items={faqItems} />

        <RelatedTools tools={[
          { emoji: '🏠', title: 'Buy vs Rent', desc: 'Is buying a home worth it?', href: '/tools/is-it-worth-it/buy-vs-rent' },
          { emoji: '💰', title: 'True Hourly Wage', desc: 'What your car costs per work hour', href: '/tools/true-hourly-wage' },
          { emoji: '🏙️', title: 'Cost of Living', desc: 'Compare cities side by side', href: '/tools/cost-of-living' },
          { emoji: '💳', title: 'Debt Payoff', desc: 'Pay off your car loan faster', href: '/finance/debt-payoff' }
        ]} />

        <LastUpdated date="June 2026" />
        <MethodologyNote text="Car depreciation modeled at 15% per year for the first three years based on Edmunds and Kelley Blue Book historical depreciation data. Mileage overage fee of $0.15 per mile above 12,000 per year — typical industry rate. Loan uses standard amortization formula. Residual value calculated from depreciation model. This calculator compares costs over the lease term only — buying becomes more advantageous the longer you keep the vehicle. Not financial advice." />
      </div>
    </main>
  )
}
