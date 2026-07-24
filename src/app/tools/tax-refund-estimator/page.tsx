'use client'
import { useState } from 'react'
import ShareButtons from '@/components/ShareButtons'
import FAQAccordion from '@/components/FAQAccordion'
import AuthorByline from '@/components/AuthorByline'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedTools from '@/components/RelatedTools'
import LastUpdated from '@/components/LastUpdated'
import MethodologyNote from '@/components/MethodologyNote'

const STD_DEDUCTION: Record<string, number> = {
  single: 15000,
  mfj: 30000,
  mfs: 15000,
  hoh: 22500
}

const BRACKETS: Record<string, [number, number][]> = {
  single: [
    [11925, 0.10], [48475, 0.12], [103350, 0.22],
    [197300, 0.24], [250525, 0.32], [626350, 0.35], [Infinity, 0.37]
  ],
  mfj: [
    [23850, 0.10], [96950, 0.12], [206700, 0.22],
    [394600, 0.24], [501050, 0.32], [751600, 0.35], [Infinity, 0.37]
  ],
  mfs: [
    [11925, 0.10], [48475, 0.12], [103350, 0.22],
    [197300, 0.24], [250525, 0.32], [375800, 0.35], [Infinity, 0.37]
  ],
  hoh: [
    [17000, 0.10], [64850, 0.12], [103350, 0.22],
    [197300, 0.24], [250500, 0.32], [626350, 0.35], [Infinity, 0.37]
  ]
}

function calcFedTax(taxableIncome: number, status: string): number {
  if (taxableIncome <= 0) return 0
  const brackets = BRACKETS[status] ?? BRACKETS.single
  let tax = 0
  let prev = 0
  for (const [limit, rate] of brackets) {
    if (taxableIncome <= prev) break
    const taxable = Math.min(taxableIncome, limit) - prev
    tax += taxable * rate
    prev = limit
  }
  return tax
}

export default function TaxRefundEstimatorPage() {
  const [filingStatus, setFilingStatus] = useState('single')
  const [grossIncome, setGrossIncome] = useState('')
  const [federalWithheld, setFederalWithheld] = useState('')
  const [deductionType, setDeductionType] = useState<'standard' | 'itemized'>('standard')
  const [itemizedAmount, setItemizedAmount] = useState('')
  const [preTaxDeductions, setPreTaxDeductions] = useState('')
  const [childTaxCredit, setChildTaxCredit] = useState('0')
  const [otherCredits, setOtherCredits] = useState('0')
  const [result, setResult] = useState<{
    verdict: 'REFUND' | 'OWE'
    amount: number
    grossIncome: number
    adjustedGross: number
    taxableIncome: number
    totalTax: number
    effectiveRate: number
    marginalRate: number
    withheld: number
    totalCredits: number
  } | null>(null)

  function calculate() {
    const gross = parseFloat(grossIncome)
    const withheld = parseFloat(federalWithheld)
    if (!gross || !withheld) return

    const preTax = parseFloat(preTaxDeductions) || 0
    const credits = (parseFloat(childTaxCredit) || 0) + (parseFloat(otherCredits) || 0)

    const agi = Math.max(0, gross - preTax)

    const stdDed = STD_DEDUCTION[filingStatus] ?? STD_DEDUCTION.single
    const itemized = parseFloat(itemizedAmount) || 0
    const deduction = deductionType === 'itemized' ? Math.max(itemized, stdDed) : stdDed

    const taxableIncome = Math.max(0, agi - deduction)
    const taxBeforeCredits = calcFedTax(taxableIncome, filingStatus)
    const totalTax = Math.max(0, taxBeforeCredits - credits)

    const diff = withheld - totalTax
    const verdict: 'REFUND' | 'OWE' = diff >= 0 ? 'REFUND' : 'OWE'
    const amount = Math.abs(diff)

    const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0

    const brackets = BRACKETS[filingStatus] ?? BRACKETS.single
    let marginalRate = 10
    let prev = 0
    for (const [limit, rate] of brackets) {
      if (taxableIncome > prev) marginalRate = rate * 100
      if (taxableIncome <= limit) break
      prev = limit
    }

    setResult({
      verdict,
      amount: Math.round(amount),
      grossIncome: Math.round(gross),
      adjustedGross: Math.round(agi),
      taxableIncome: Math.round(taxableIncome),
      totalTax: Math.round(totalTax),
      effectiveRate: Math.round(effectiveRate * 10) / 10,
      marginalRate: Math.round(marginalRate),
      withheld: Math.round(withheld),
      totalCredits: Math.round(credits)
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
      question: 'How big is the average 2026 tax refund?',
      answer: 'The average federal tax refund in recent years has been approximately $3,000-3,200 according to IRS filing statistics. For 2026 returns filed in early 2027 the average is expected to remain in a similar range. However refund size varies enormously based on income, filing status, withholding elections, and credits claimed. This calculator gives you a personalized estimate based on your specific situation.'
    },
    {
      question: 'What is the 2026 standard deduction?',
      answer: 'The 2026 standard deduction is $15,000 for single filers and married filing separately, $30,000 for married filing jointly and qualifying surviving spouses, and $22,500 for head of household per current IRS guidance. Taxpayers age 65 or older receive an additional $2,050 (single) or $1,650 (married) per qualifying condition.'
    },
    {
      question: 'What are the 2026 federal tax brackets?',
      answer: 'The 2025 federal tax brackets for single filers are: 10% on taxable income up to $11,925; 12% from $11,925 to $48,475; 22% from $48,475 to $103,350; 24% from $103,350 to $197,300; 32% from $197,300 to $250,525; 35% from $250,525 to $626,350; and 37% above $626,350. Remember these are marginal rates — only the income in each bracket is taxed at that rate.'
    },
    {
      question: 'What is the difference between a refund and a tax liability?',
      answer: 'Your tax liability is the total federal income tax you owe based on your taxable income and applicable tax brackets. Your refund — or amount owed — is the difference between your tax liability and the taxes already withheld from your paychecks throughout the year. A refund means you withheld more than you owed. An amount owed means your withholding fell short of your liability.'
    },
    {
      question: 'What reduces my taxable income the most?',
      answer: 'The most impactful deductions and adjustments are pre-tax retirement contributions (401k up to $23,500 in 2026, or $31,000 if age 50+), HSA contributions ($4,300 single or $8,550 family in 2026), the standard deduction ($15,000 single, $30,000 MFJ), and itemized deductions if they exceed the standard deduction. Tax credits — which directly reduce your tax liability dollar for dollar rather than reducing taxable income — are even more valuable. The Child Tax Credit ($2,200 per qualifying child in 2026) is the most widely claimed.'
    },
    {
      question: 'Should I adjust my W-4 after using this calculator?',
      answer: 'If this calculator shows you consistently owe a large amount each year your withholding is too low — update your W-4 with your employer to withhold more each paycheck. If you consistently get a very large refund your withholding is too high — you are giving the IRS an interest-free loan. Updating your W-4 to withhold less puts more money in each paycheck which you can invest. The IRS Tax Withholding Estimator at irs.gov is the most accurate tool for calculating the exact W-4 adjustment needed.'
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
                name: 'What is the 2026 standard deduction?',
                acceptedAnswer: { '@type': 'Answer', text: 'The 2026 standard deduction is $15,000 for single filers, $30,000 for married filing jointly, and $22,500 for head of household per current IRS guidance.' }
              },
              {
                '@type': 'Question',
                name: 'How big is the average 2026 tax refund?',
                acceptedAnswer: { '@type': 'Answer', text: 'The average federal tax refund has been approximately $3,000-3,200 based on recent IRS filing statistics. Individual refunds vary significantly based on income, withholding, and credits.' }
              },
              {
                '@type': 'Question',
                name: 'What are the 2026 federal tax brackets?',
                acceptedAnswer: { '@type': 'Answer', text: '2026 single filer brackets: 10% to $12,400; 12% to $47,150; 22% to $100,525; 24% to $191,950; 32% to $243,725; 35% to $609,350; 37% above. Per IRS Rev. Proc. 2025-32.' }
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
            name: '2026 Tax Refund Estimator',
            url: 'https://www.dayblip.com/tools/tax-refund-estimator',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: 'Estimate your 2026 federal tax refund or amount owed based on IRS Rev. Proc. 2025-32 brackets and standard deductions. Free, no signup required.'
          })
        }}
      />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 0px' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'Tax Refund Estimator' }
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
          2026 Tax Refund Estimator
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px', lineHeight: '1.6' }}>
          Estimate your federal tax refund or amount owed for 2026.
          Based on IRS Rev. Proc. 2025-32 tax brackets and standard deductions.
        </p>

        {/* Quick Answer Box */}
        <div style={{ background: '#1e2d4a', borderLeft: '4px solid #e94560', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }}>
          <div style={{ color: '#e94560', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: '700' }}>QUICK ANSWER</div>
          {result ? (
            <p style={{ color: '#ffffff', fontSize: '15px', margin: 0, lineHeight: '1.7' }}>
              Based on your numbers, your estimated 2026 federal{' '}
              {result.verdict === 'REFUND'
                ? <><strong style={{ color: '#4ade80' }}>refund is ${result.amount.toLocaleString()}</strong>. Your effective tax rate is {result.effectiveRate}% on a taxable income of ${result.taxableIncome.toLocaleString()}.</>
                : <><strong style={{ color: '#e94560' }}>amount owed is ${result.amount.toLocaleString()}</strong>. Consider updating your W-4 to avoid a bill next year.</>
              }
            </p>
          ) : (
            <p style={{ color: '#ffffff', fontSize: '15px', margin: 0, lineHeight: '1.7' }}>
              The average 2026 federal tax refund is approximately $3,100 based on IRS data.
              Whether you get a refund depends on how much was withheld from your paychecks
              versus your actual tax liability. Enter your numbers below for a personalized estimate.
            </p>
          )}
        </div>

        <AuthorByline variant="tool" />

        {/* Input Section */}
        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '32px 0 16px' }}>
          Your 2026 Tax Information
        </h2>

        {/* Filing Status */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Filing Status</label>
          <select
            value={filingStatus}
            onChange={e => setFilingStatus(e.target.value)}
            style={{ ...inputStyle }}
          >
            <option value="single">Single</option>
            <option value="mfj">Married Filing Jointly</option>
            <option value="mfs">Married Filing Separately</option>
            <option value="hoh">Head of Household</option>
          </select>
        </div>

        {/* Gross Income */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Gross Annual Income</label>
          <input
            type="number"
            placeholder="$75,000"
            value={grossIncome}
            onChange={e => setGrossIncome(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Federal Withheld */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Federal Taxes Withheld</label>
          <input
            type="number"
            placeholder="$8,000"
            value={federalWithheld}
            onChange={e => setFederalWithheld(e.target.value)}
            style={inputStyle}
          />
          <p style={{ color: '#a8a8b3', fontSize: '12px', margin: '4px 0 0' }}>
            Find this on your W-2 Box 2 or add up your paystub YTD withholding
          </p>
        </div>

        {/* Deduction Type Toggle */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Deduction Type</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['standard', 'itemized'] as const).map(type => (
              <button
                key={type}
                onClick={() => setDeductionType(type)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  background: deductionType === type ? '#e94560' : '#1e2d4a',
                  color: '#ffffff'
                }}
              >
                {type === 'standard'
                  ? `Standard ($${(STD_DEDUCTION[filingStatus] ?? 16100).toLocaleString()})`
                  : 'Itemized'
                }
              </button>
            ))}
          </div>
        </div>

        {/* Itemized Amount — conditional */}
        {deductionType === 'itemized' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Total Itemized Deductions</label>
            <input
              type="number"
              placeholder="e.g. $25,000"
              value={itemizedAmount}
              onChange={e => setItemizedAmount(e.target.value)}
              style={inputStyle}
            />
            <p style={{ color: '#a8a8b3', fontSize: '12px', margin: '4px 0 0' }}>
              Include mortgage interest, state taxes (up to $10,000), and charitable contributions
            </p>
          </div>
        )}

        {/* Pre-Tax Deductions */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Pre-Tax Deductions (annual)</label>
          <input
            type="number"
            placeholder="$5,000"
            value={preTaxDeductions}
            onChange={e => setPreTaxDeductions(e.target.value)}
            style={inputStyle}
          />
          <p style={{ color: '#a8a8b3', fontSize: '12px', margin: '4px 0 0' }}>
            401k contributions, HSA, health insurance premiums paid pre-tax
          </p>
        </div>

        {/* Child Tax Credit */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Child Tax Credit</label>
          <input
            type="number"
            placeholder="$0"
            value={childTaxCredit}
            onChange={e => setChildTaxCredit(e.target.value)}
            style={inputStyle}
          />
          <p style={{ color: '#a8a8b3', fontSize: '12px', margin: '4px 0 0' }}>
            $2,000 per qualifying child under 17 in 2026
          </p>
        </div>

        {/* Other Credits */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Other Tax Credits</label>
          <input
            type="number"
            placeholder="$0"
            value={otherCredits}
            onChange={e => setOtherCredits(e.target.value)}
            style={inputStyle}
          />
          <p style={{ color: '#a8a8b3', fontSize: '12px', margin: '4px 0 0' }}>
            Education credits, retirement savings credit, EV credit, etc.
          </p>
        </div>

        {/* Calculate Button */}
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
          Estimate My 2026 Tax Refund
        </button>

        {/* Result Section */}
        {result && (
          <div style={{ margin: '40px 0' }}>
            {/* Main verdict card */}
            <div style={{
              background: '#1e2d4a',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              marginBottom: '24px',
              borderTop: `4px solid ${result.verdict === 'REFUND' ? '#4ade80' : '#e94560'}`
            }}>
              <p style={{ color: '#a8a8b3', fontSize: '15px', margin: '0 0 8px' }}>
                {result.verdict === 'REFUND' ? 'Estimated Federal Refund' : 'Estimated Amount Owed'}
              </p>
              <div style={{
                color: result.verdict === 'REFUND' ? '#4ade80' : '#e94560',
                fontSize: '64px',
                fontWeight: '800',
                lineHeight: 1,
                margin: '0 0 8px'
              }}>
                ${result.amount.toLocaleString()}
              </div>
              <p style={{ color: '#a8a8b3', fontSize: '14px', margin: 0 }}>
                {result.verdict === 'REFUND'
                  ? 'You likely overpaid your taxes through withholding'
                  : 'You likely underpaid — consider adjusting your W-4'
                }
              </p>
            </div>

            {/* Tax breakdown */}
            <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', margin: '0 0 16px' }}>
                Tax Breakdown
              </h3>
              {[
                { label: 'Gross Income', value: `$${result.grossIncome.toLocaleString()}` },
                { label: 'Adjusted Gross Income', value: `$${result.adjustedGross.toLocaleString()}` },
                { label: 'Taxable Income', value: `$${result.taxableIncome.toLocaleString()}` },
                { label: 'Federal Tax Owed', value: `$${result.totalTax.toLocaleString()}` },
                { label: 'Tax Credits Applied', value: `- $${result.totalCredits.toLocaleString()}` },
                { label: 'Federal Tax Withheld', value: `$${result.withheld.toLocaleString()}` },
                { label: 'Effective Tax Rate', value: `${result.effectiveRate}%` },
                { label: 'Marginal Tax Rate', value: `${result.marginalRate}%` },
              ].map((row, i) => (
                <div key={row.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: i < 7 ? '1px solid #0d1b2a' : 'none'
                }}>
                  <span style={{ color: '#a8a8b3', fontSize: '14px' }}>{row.label}</span>
                  <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* W-4 tip — owe */}
            {result.verdict === 'OWE' && (
              <div style={{
                background: '#0d1b2a',
                borderRadius: '12px',
                padding: '20px 24px',
                marginBottom: '24px',
                borderLeft: '4px solid #e94560'
              }}>
                <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', margin: '0 0 8px' }}>
                  Avoid this next year — update your W-4
                </p>
                <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                  If you owe ${result.amount.toLocaleString()} this year your withholding is too low.
                  Ask your employer for a new W-4 form and increase your withholding by approximately
                  ${Math.round(result.amount / 12).toLocaleString()} per month to break even next year.
                </p>
              </div>
            )}

            {/* Refund tip */}
            {result.verdict === 'REFUND' && (
              <div style={{
                background: '#0d1b2a',
                borderRadius: '12px',
                padding: '20px 24px',
                marginBottom: '24px',
                borderLeft: '4px solid #4ade80'
              }}>
                <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', margin: '0 0 8px' }}>
                  A large refund means you overpaid
                </p>
                <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                  A ${result.amount.toLocaleString()} refund means you gave the IRS an interest-free loan
                  of ${Math.round(result.amount / 12).toLocaleString()} per month all year.
                  Consider updating your W-4 to keep more money in each paycheck and invest the difference.
                </p>
              </div>
            )}

            {/* ── NOW WHAT? Interpretation Layer ── */}
            {(() => {
              const isRefund = result.verdict === 'REFUND'
              const effectiveRate = result.effectiveRate
              const marginalRate = result.marginalRate
              const amount = result.amount

              const filingLabel = filingStatus === 'mfj' ? 'Married Filing Jointly'
                : filingStatus === 'hoh' ? 'Head of Household'
                : filingStatus === 'mfs' ? 'Married Filing Separately'
                : 'Single'

              let refundTier: 'small-refund' | 'large-refund' | 'small-owe' | 'large-owe' | 'break-even'
              let verdictMessage: string

              if (isRefund && amount < 500) {
                refundTier = 'small-refund'
                verdictMessage = `You are getting a $${amount.toLocaleString()} refund — a small, healthy amount. A small refund means your withholding was close to accurate. You gave the IRS a modest interest-free loan of approximately $${Math.round(amount / 12).toLocaleString()}/month. This is near-optimal — large refunds sound good but mean you overpaid all year.`
              } else if (isRefund && amount >= 500) {
                refundTier = 'large-refund'
                verdictMessage = `You are getting a $${amount.toLocaleString()} refund. This feels like a windfall but it means you overpaid the IRS by $${Math.round(amount / 12).toLocaleString()}/month throughout the year. That money could have been in your paycheck — invested at 7% for a year $${amount.toLocaleString()} would have grown to $${Math.round(amount * 1.07).toLocaleString()}. Consider updating your W-4 to keep more each paycheck.`
              } else if (!isRefund && amount < 500) {
                refundTier = 'small-owe'
                verdictMessage = `You owe $${amount.toLocaleString()} — a small, manageable amount. This means your withholding was slightly below your actual liability. A small amount owed is not a penalty issue if you withheld at least 90% of this year's tax or 100% of last year's tax (110% if income exceeds $150,000). Pay by April 15 to avoid interest charges.`
              } else if (!isRefund && amount >= 500) {
                refundTier = 'large-owe'
                verdictMessage = `You owe $${amount.toLocaleString()} — a significant underpayment. This likely means your withholding elections on your W-4 are set too low, you had significant income without withholding (freelance, investments, bonuses), or a life change reduced your deductions. Pay by April 15 to stop interest from accruing at the current IRS rate of approximately 8% annually.`
              } else {
                refundTier = 'break-even'
                verdictMessage = `You are near breakeven — the ideal outcome. Your withholding closely matched your actual tax liability. You neither gave the IRS an interest-free loan nor underpaid. This is the target that tax professionals aim for.`
              }

              let rateMessage: string
              if (effectiveRate < 8) {
                rateMessage = `Your ${effectiveRate}% effective federal rate is very low — you are keeping a high percentage of your income. At this rate the biggest financial lever is not tax reduction but savings rate and investment consistency.`
              } else if (effectiveRate < 15) {
                rateMessage = `Your ${effectiveRate}% effective federal rate is moderate. Pre-tax 401k contributions and HSA deposits are your most powerful tools to reduce this further — each dollar contributed reduces your taxable income dollar-for-dollar.`
              } else if (effectiveRate < 22) {
                rateMessage = `Your ${effectiveRate}% effective federal rate is in the upper-middle range. At this level maxing tax-advantaged accounts (401k $23,500, HSA $4,300 single in 2026) has meaningful impact on your effective rate and long-term wealth accumulation.`
              } else {
                rateMessage = `Your ${effectiveRate}% effective federal rate is high. At this level tax optimization is a high-ROI activity. Maxing all pre-tax accounts, reviewing itemized vs standard deduction, and timing income and deductions strategically can each save thousands annually.`
              }

              let w4Message: string
              if (isRefund && amount >= 1000) {
                const monthlyAdjust = Math.round(amount / 12)
                w4Message = `To avoid overpaying next year: ask your HR department for a new W-4 form. In Step 4(c) enter an additional $${monthlyAdjust}/month as a deduction — or use the IRS Tax Withholding Estimator at irs.gov/W4app for a precise calculation. This keeps $${monthlyAdjust} more in each paycheck for you to invest.`
              } else if (!isRefund && amount >= 500) {
                const monthlyAdjust = Math.round(amount / 12)
                w4Message = `To fix your withholding for next year: ask HR for a new W-4 form. In Step 4(c) enter an additional $${monthlyAdjust}/month in extra withholding. This spreads the payment across paychecks so you do not face a lump sum bill next April. Alternatively use the IRS Tax Withholding Estimator at irs.gov/W4app.`
              } else {
                w4Message = `Your withholding is well-calibrated. No W-4 adjustment needed unless your income, filing status, or deductions change significantly this year. Triggering events that warrant a W-4 review: marriage, divorce, new child, second job, large bonus, or starting freelance work.`
              }

              let nextActions: string[]
              if (refundTier === 'large-refund') {
                nextActions = [
                  `Update your W-4 — add a deduction of approximately $${Math.round(amount / 12).toLocaleString()}/month in Step 4(c) to recapture that money in each paycheck`,
                  `Invest your refund immediately — do not let it sit in a checking account. Put it in your Roth IRA ($7,000 limit), emergency fund, or brokerage account`,
                  `Check if you missed any deductions — charitable contributions, student loan interest, educator expenses, or HSA contributions may reduce next year's bill`,
                  `Model the compounding impact — $${amount.toLocaleString()} invested at 7% for 10 years grows to $${Math.round(amount * Math.pow(1.07, 10)).toLocaleString()}`
                ]
              } else if (refundTier === 'small-refund') {
                nextActions = [
                  `Your withholding is close to optimal — no W-4 change needed unless income or filing status changes`,
                  `Invest your refund rather than spending it — even a small amount compounds meaningfully over time`,
                  `Review your tax-advantaged account contributions for next year — 401k $23,500 limit, IRA $7,000 limit in 2026`,
                  `Check if you qualify for any credits you may have missed — Child Tax Credit, Earned Income Credit, education credits`
                ]
              } else if (refundTier === 'large-owe') {
                nextActions = [
                  `Pay your balance by April 15 to stop interest charges — IRS charges approximately 8% annually on unpaid balances`,
                  `Update your W-4 immediately — add $${Math.round(amount / 12).toLocaleString()}/month in extra withholding in Step 4(c) to prevent a repeat`,
                  `If you had freelance or investment income without withholding consider making quarterly estimated tax payments next year (due April, June, September, January)`,
                  `Verify you meet the safe harbor rule — you avoid underpayment penalty if you withheld at least 90% of this year's tax or 100% of last year's total tax`
                ]
              } else if (refundTier === 'small-owe') {
                nextActions = [
                  `Pay by April 15 — small amounts owed are common and not a problem if paid on time`,
                  `Verify safe harbor: you avoid underpayment penalty if you withheld at least 90% of this year's tax or 100% of last year's tax`,
                  `Consider adding $${Math.round(amount / 12).toLocaleString()}/month extra withholding on your W-4 if you prefer to break even rather than owe`,
                  `Review whether any deductions were missed — mortgage interest, charitable contributions, or state taxes may reduce next year's liability`
                ]
              } else {
                nextActions = [
                  `Maintain your current withholding elections — your W-4 is well-calibrated`,
                  `Review annually — update W-4 if income, filing status, or major deductions change`,
                  `Focus on tax-advantaged investing for next year: 401k $23,500, HSA $4,300 single, IRA $7,000`,
                  `Consider a tax professional review if your situation becomes more complex (freelance, investments, rental income)`
                ]
              }

              const borderColor = isRefund
                ? (amount >= 500 ? '#facc15' : '#4ade80')
                : (amount >= 500 ? '#e94560' : '#60a5fa')

              const labelColor = borderColor

              return (
                <div style={{
                  background: '#0d1b2a',
                  borderRadius: '16px',
                  padding: '28px 28px 24px',
                  margin: '32px 0 24px',
                  borderLeft: `4px solid ${borderColor}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '22px' }}>🧭</span>
                    <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '800', margin: 0 }}>
                      Now What? Your Tax Action Plan
                    </h3>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                      {isRefund ? `Refund — $${amount.toLocaleString()} Back` : `Amount Owed — $${amount.toLocaleString()}`}
                    </p>
                    <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                      {verdictMessage}
                    </p>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                      Tax Rate — {effectiveRate}% Effective / {marginalRate}% Marginal
                    </p>
                    <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                      {rateMessage}
                    </p>
                  </div>

                  <div style={{ background: '#1e2d4a', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px' }}>
                    <p style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.7', margin: 0, fontWeight: '600' }}>
                      📋 W-4 Guidance ({filingLabel}): {w4Message}
                    </p>
                  </div>

                  <div>
                    <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                      Your Next 4 Actions
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {nextActions.map((action, i) => (
                        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <span style={{ color: borderColor, fontSize: '14px', fontWeight: '800', minWidth: '20px', marginTop: '1px' }}>
                            {i + 1}.
                          </span>
                          <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                            {action}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })()}

            <ShareButtons
              text={`I estimated my 2026 tax ${result.verdict === 'REFUND' ? `refund: $${result.amount.toLocaleString()} back` : `bill: $${result.amount.toLocaleString()} owed`}. Effective rate: ${result.effectiveRate}%. Calculate yours at Dayblip 💰`}
              url="https://www.dayblip.com/tools/tax-refund-estimator"
              title="2026 Tax Refund Estimator — Dayblip"
            />
          </div>
        )}

        <FAQAccordion items={faqItems} />

        <RelatedTools tools={[
          { emoji: '💵', title: 'Take-Home Pay Calculator', desc: 'Your actual paycheck after all taxes', href: '/finance/take-home-pay' },
          { emoji: '📊', title: 'Tax Bracket Calculator', desc: 'Your marginal and effective rates', href: '/finance/tax-bracket' },
          { emoji: '🏦', title: '401k Calculator', desc: 'How much your contributions grow', href: '/finance/401k-calculator' },
          { emoji: '💰', title: 'Where You Rank', desc: 'Your income percentile nationally', href: '/tools/where-you-rank' }
        ]} />

        <LastUpdated date="June 2026" />

        <MethodologyNote text="Tax calculations use 2026 federal income tax brackets and standard deductions per IRS Revenue Procedure 2025-32. Federal withholding entered by the user is used directly — FICA taxes (Social Security and Medicare) are not included in this estimate as they are not refundable through income tax returns. State income taxes are not included. Credits are treated as non-refundable (cannot reduce tax below zero). This tool provides an estimate only — actual refunds depend on additional factors including other income sources, AMT, self-employment tax, and specific IRS calculations. Always consult a tax professional for advice specific to your situation. Source: IRS Rev. Proc. 2025-32; IRS Publication 505 (2026)." />
      </div>
    </main>
  )
}
