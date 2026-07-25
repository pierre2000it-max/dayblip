'use client'
import { useState } from 'react'
import ShareButtons from '@/components/ShareButtons'
import FAQAccordion from '@/components/FAQAccordion'
import AuthorByline from '@/components/AuthorByline'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedTools from '@/components/RelatedTools'
import LastUpdated from '@/components/LastUpdated'
import MethodologyNote from '@/components/MethodologyNote'

// 2026 values per IRS Rev. Proc. 2025-32
const STATES: [string, number][] = [
  ['No state income tax (TX, FL, NV, WA, etc.)', 0],
  ['Colorado', 0.044],
  ['Arizona', 0.025],
  ['Indiana', 0.0305],
  ['Kentucky', 0.04],
  ['Georgia', 0.0549],
  ['Virginia', 0.0575],
  ['North Carolina', 0.0450],
  ['Missouri', 0.048],
  ['Ohio', 0.035],
  ['Pennsylvania', 0.0307],
  ['Michigan', 0.0425],
  ['Wisconsin', 0.0530],
  ['Minnesota', 0.0985],
  ['Illinois', 0.0495],
  ['Utah', 0.0465],
  ['Maryland', 0.0575],
  ['Connecticut', 0.0699],
  ['Massachusetts', 0.05],
  ['New York', 0.0685],
  ['New Jersey', 0.0637],
  ['California', 0.093],
  ['Oregon', 0.099],
  ['Hawaii', 0.11],
]

const BRACKETS_SINGLE: [number, number][] = [
  [11925, 0.10], [48475, 0.12], [103350, 0.22],
  [197300, 0.24], [250525, 0.32], [626350, 0.35], [Infinity, 0.37],
]
const BRACKETS_MFJ: [number, number][] = [
  [23850, 0.10], [96950, 0.12], [206700, 0.22],
  [394600, 0.24], [501050, 0.32], [751600, 0.35], [Infinity, 0.37],
]
const BRACKETS_HOH: [number, number][] = [
  [17000, 0.10], [64850, 0.12], [103350, 0.22],
  [197300, 0.24], [250500, 0.32], [626350, 0.35], [Infinity, 0.37],
]
const STD_DEDUCTION: Record<string, number> = {
  single: 16100, mfj: 32200, mfs: 16100, hoh: 24150,
}

function calcFedTax(taxableIncome: number, filing: string): number {
  if (taxableIncome <= 0) return 0
  const brackets =
    filing === 'mfj' ? BRACKETS_MFJ :
    filing === 'hoh' ? BRACKETS_HOH :
    BRACKETS_SINGLE
  let tax = 0
  let prev = 0
  for (const [limit, rate] of brackets) {
    if (taxableIncome <= prev) break
    tax += (Math.min(taxableIncome, limit) - prev) * rate
    prev = limit
  }
  return tax
}

const PAY_PERIODS: Record<string, { label: string; periods: number }> = {
  biweekly:    { label: 'Biweekly (every 2 weeks)', periods: 26 },
  weekly:      { label: 'Weekly', periods: 52 },
  semimonthly: { label: 'Semi-monthly (twice a month)', periods: 24 },
  monthly:     { label: 'Monthly', periods: 12 },
}

export default function FirstPaycheckPage() {
  const [salary, setSalary] = useState('')
  const [payFreq, setPayFreq] = useState('biweekly')
  const [filing, setFiling] = useState('single')
  const [stateIdx, setStateIdx] = useState(0)
  const [healthInsurance, setHealthInsurance] = useState('0')
  const [fourOhOneK, setFourOhOneK] = useState('0')
  const [result, setResult] = useState<{
    grossPaycheck: number
    fedTax: number
    stateTax: number
    ss: number
    medicare: number
    healthIns: number
    retirement: number
    netPaycheck: number
    annualNet: number
    annualGross: number
    effectiveRate: number
    marginalRate: number
    employerSsTax: number
    employerMedicareTax: number
    totalEmployerCost: number
    periods: number
    stateName: string
  } | null>(null)

  function calculate() {
    const annual = parseFloat(salary)
    if (!annual || annual <= 0) return

    const periods = PAY_PERIODS[payFreq]?.periods ?? 26
    const healthIns = parseFloat(healthInsurance) || 0
    const k401pct = parseFloat(fourOhOneK) || 0

    const healthInsAnnual = healthIns * periods
    const k401Annual = annual * (k401pct / 100)

    const stdDed = STD_DEDUCTION[filing] ?? 16100
    const preTaxDeductions = healthInsAnnual + k401Annual
    const agi = Math.max(0, annual - preTaxDeductions)
    const taxableIncome = Math.max(0, agi - stdDed)

    const annualFedTax = calcFedTax(taxableIncome, filing)

    const stateRate = STATES[stateIdx]?.[1] ?? 0
    const annualStateTax = taxableIncome * stateRate
    const stateName = STATES[stateIdx]?.[0] ?? 'No state tax'

    const annualSs = Math.min(annual, 184500) * 0.062
    const annualMedicare = annual * 0.0145

    const employerSs = Math.min(annual, 184500) * 0.062
    const employerMedicare = annual * 0.0145
    const totalEmployerCost = annual + employerSs + employerMedicare

    const grossPaycheck = annual / periods
    const fedTax = annualFedTax / periods
    const stateTax = annualStateTax / periods
    const ss = annualSs / periods
    const medicare = annualMedicare / periods
    const healthInsPerCheck = healthIns
    const retirementPerCheck = k401Annual / periods

    const netPaycheck = grossPaycheck - fedTax - stateTax - ss - medicare - healthInsPerCheck - retirementPerCheck
    const annualNet = netPaycheck * periods
    const effectiveRate = annual > 0 ? ((annual - annualNet) / annual) * 100 : 0

    const bkts = filing === 'mfj' ? BRACKETS_MFJ : filing === 'hoh' ? BRACKETS_HOH : BRACKETS_SINGLE
    let marginalRate = 10
    let prev = 0
    for (const [limit, rate] of bkts) {
      if (taxableIncome > prev) marginalRate = rate * 100
      if (taxableIncome <= limit) break
      prev = limit
    }

    setResult({
      grossPaycheck: Math.round(grossPaycheck * 100) / 100,
      fedTax: Math.round(fedTax * 100) / 100,
      stateTax: Math.round(stateTax * 100) / 100,
      ss: Math.round(ss * 100) / 100,
      medicare: Math.round(medicare * 100) / 100,
      healthIns: Math.round(healthInsPerCheck * 100) / 100,
      retirement: Math.round(retirementPerCheck * 100) / 100,
      netPaycheck: Math.round(netPaycheck * 100) / 100,
      annualNet: Math.round(annualNet),
      annualGross: Math.round(annual),
      effectiveRate: Math.round(effectiveRate * 10) / 10,
      marginalRate,
      employerSsTax: Math.round(employerSs),
      employerMedicareTax: Math.round(employerMedicare),
      totalEmployerCost: Math.round(totalEmployerCost),
      periods,
      stateName
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
                name: 'Why is my paycheck so much less than my salary?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Federal income tax takes 10-22% for most new graduates. Social Security takes 6.2%. Medicare takes 1.45%. State income tax varies from 0% to 11%. Health insurance and 401k contributions are additional deductions. Most employees take home 65-80% of gross salary.'
                }
              },
              {
                '@type': 'Question',
                name: 'What is the difference between gross pay and net pay?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Gross pay is your salary before deductions. Net pay is what hits your bank account after federal tax, state tax, Social Security, Medicare, health insurance, and retirement contributions are subtracted. For most new graduates net pay is 68-78% of gross pay.'
                }
              },
              {
                '@type': 'Question',
                name: 'Should I contribute to my 401k on my first job?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes — immediately, and at minimum enough to get your full employer match. Not contributing enough to get the full match means forfeiting free compensation. Starting early matters enormously due to compound growth.'
                }
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
            name: 'First Paycheck Calculator 2026',
            url: 'https://www.dayblip.com/finance/first-paycheck',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: 'Calculate exactly what your first paycheck will look like after all deductions. Shows federal tax, state tax, Social Security, Medicare, health insurance, and 401k breakdown per paycheck.'
          })
        }}
      />

      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Finance', href: '/finance' },
          { label: 'First Paycheck Calculator' }
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
          First Paycheck Calculator
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px', lineHeight: '1.6' }}>
          You accepted a $65,000 offer. Your first paycheck shows $1,847.
          Here is where the rest went — and what every paycheck will look
          like for the rest of the year.
        </p>

        <div style={{ background: '#1e2d4a', borderLeft: '4px solid #e94560', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }}>
          <div style={{ color: '#e94560', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: '700' }}>QUICK ANSWER</div>
          {result ? (
            <p style={{ color: '#ffffff', fontSize: '15px', margin: 0, lineHeight: '1.7' }}>
              Your {PAY_PERIODS[payFreq]?.label} gross paycheck is ${result.grossPaycheck.toLocaleString()} but your actual take-home is ${result.netPaycheck.toLocaleString()} —{' '}
              {Math.round(result.netPaycheck / result.grossPaycheck * 100)}% of your gross pay. Over a full year you take home ${result.annualNet.toLocaleString()} of your ${result.annualGross.toLocaleString()} salary.
            </p>
          ) : (
            <p style={{ color: '#ffffff', fontSize: '15px', margin: 0, lineHeight: '1.7' }}>
              On a $65,000 salary paid biweekly in a no-tax state, your gross paycheck is $2,500 but your net take-home is approximately $1,980 after federal taxes, Social Security, and Medicare — before any health insurance or retirement deductions. Enter your numbers below for your exact breakdown.
            </p>
          )}
        </div>

        <AuthorByline variant="tool" />

        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '32px 0 16px' }}>Your Job Details</h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Annual salary (before taxes)
          </label>
          <input
            type="number"
            value={salary}
            onChange={e => setSalary(e.target.value)}
            placeholder="$65,000"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            How often will you be paid?
          </label>
          <select
            value={payFreq}
            onChange={e => setPayFreq(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {Object.entries(PAY_PERIODS).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Tax filing status
          </label>
          <select
            value={filing}
            onChange={e => setFiling(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="single">Single</option>
            <option value="mfj">Married Filing Jointly</option>
            <option value="hoh">Head of Household</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            State you will work in
          </label>
          <select
            value={stateIdx}
            onChange={e => setStateIdx(Number(e.target.value))}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {STATES.map(([name], i) => (
              <option key={i} value={i}>{name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Health insurance per paycheck (pre-tax)
          </label>
          <input
            type="number"
            value={healthInsurance}
            onChange={e => setHealthInsurance(e.target.value)}
            placeholder="$0"
            style={inputStyle}
          />
          <p style={{ color: '#a8a8b3', fontSize: '12px', marginTop: '4px' }}>
            Check your benefits packet — typically $50–200 per paycheck
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            401k contribution % (optional)
          </label>
          <input
            type="number"
            value={fourOhOneK}
            onChange={e => setFourOhOneK(e.target.value)}
            placeholder="0"
            style={inputStyle}
          />
          <p style={{ color: '#a8a8b3', fontSize: '12px', marginTop: '4px' }}>
            Most employers match 3–6% — contribute at least enough to get the full match
          </p>
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
          Calculate My First Paycheck
        </button>

        {result && (
          <div style={{ margin: '40px 0' }}>
            {/* Main paycheck card */}
            <div style={{
              background: '#1e2d4a',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              marginBottom: '24px',
              borderTop: '4px solid #e94560'
            }}>
              <p style={{ color: '#a8a8b3', fontSize: '15px', margin: '0 0 8px' }}>
                Your {PAY_PERIODS[payFreq]?.label} take-home pay
              </p>
              <div style={{ color: '#e94560', fontSize: '64px', fontWeight: '800', lineHeight: 1, margin: '0 0 8px' }}>
                ${result.netPaycheck.toLocaleString()}
              </div>
              <p style={{ color: '#a8a8b3', fontSize: '14px', margin: 0 }}>
                of ${result.grossPaycheck.toLocaleString()} gross —{' '}
                {Math.round(result.netPaycheck / result.grossPaycheck * 100)}% take-home rate
              </p>
            </div>

            {/* Where did my money go */}
            <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', margin: '0 0 16px' }}>
                Where Did My Money Go?
              </h3>
              {[
                { label: '💵 Gross Paycheck', value: result.grossPaycheck, color: '#4ade80', bold: true, sign: '+' },
                { label: '🏛️ Federal Income Tax', value: result.fedTax, color: '#e94560', bold: false, sign: '−' },
                { label: `🏙️ State Tax (${result.stateName.split('(')[0].trim()})`, value: result.stateTax, color: '#e94560', bold: false, sign: '−' },
                { label: '👴 Social Security (6.2%)', value: result.ss, color: '#e94560', bold: false, sign: '−' },
                { label: '🏥 Medicare (1.45%)', value: result.medicare, color: '#e94560', bold: false, sign: '−' },
                { label: '❤️ Health Insurance', value: result.healthIns, color: result.healthIns > 0 ? '#e94560' : '#a8a8b3', bold: false, sign: '−' },
                { label: '📈 401k Contribution', value: result.retirement, color: result.retirement > 0 ? '#facc15' : '#a8a8b3', bold: false, sign: '−' },
                { label: '🏠 Your Take-Home Pay', value: result.netPaycheck, color: '#4ade80', bold: true, sign: '+' },
              ].map((row, i) => (
                <div key={row.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: i < 7 ? '1px solid #0d1b2a' : 'none',
                  borderTop: i === 7 ? '2px solid #e94560' : 'none',
                  marginTop: i === 7 ? '8px' : 0
                }}>
                  <span style={{ color: '#a8a8b3', fontSize: '14px', fontWeight: row.bold ? '700' : '400' }}>
                    {row.label}
                  </span>
                  <span style={{ color: row.color, fontSize: '14px', fontWeight: '700' }}>
                    {row.sign}${Math.abs(row.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>

            {/* Annual projection grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {[
                { label: 'Annual Gross', value: `$${result.annualGross.toLocaleString()}` },
                { label: 'Annual Take-Home', value: `$${result.annualNet.toLocaleString()}` },
                { label: 'Effective Tax Rate', value: `${result.effectiveRate}%` },
                { label: 'Marginal Tax Rate', value: `${result.marginalRate}%` },
              ].map(card => (
                <div key={card.label} style={{ background: '#1e2d4a', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                  <div style={{ color: '#a8a8b3', fontSize: '12px', marginBottom: '8px' }}>{card.label}</div>
                  <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700' }}>{card.value}</div>
                </div>
              ))}
            </div>

            {/* Employer cost education box */}
            <div style={{
              background: '#0d1b2a',
              borderRadius: '12px',
              padding: '20px 24px',
              marginBottom: '24px',
              borderLeft: '4px solid #a8a8b3'
            }}>
              <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', margin: '0 0 8px' }}>
                💡 What Your Employer Actually Pays For You
              </p>
              <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: '0 0 12px' }}>
                Your salary is ${result.annualGross.toLocaleString()} but your employer&apos;s
                total cost is ${result.totalEmployerCost.toLocaleString()} per year.
                They pay an additional ${(result.employerSsTax + result.employerMedicareTax).toLocaleString()} in
                payroll taxes on your behalf — money that never appears on your paycheck.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ color: '#a8a8b3', fontSize: '13px' }}>Employer SS tax: </span>
                  <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600' }}>${result.employerSsTax.toLocaleString()}</span>
                </div>
                <div>
                  <span style={{ color: '#a8a8b3', fontSize: '13px' }}>Employer Medicare: </span>
                  <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600' }}>${result.employerMedicareTax.toLocaleString()}</span>
                </div>
                <div>
                  <span style={{ color: '#a8a8b3', fontSize: '13px' }}>Total employer cost: </span>
                  <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600' }}>${result.totalEmployerCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 401k match tip */}
            {parseFloat(fourOhOneK) < 3 && (
              <div style={{
                background: '#0d1b2a',
                borderRadius: '12px',
                padding: '20px 24px',
                marginBottom: '24px',
                borderLeft: '4px solid #4ade80'
              }}>
                <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', margin: '0 0 8px' }}>
                  🎁 Free Money Alert — 401k Match
                </p>
                <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                  Most employers match 3–6% of your salary in 401k contributions.
                  If your employer matches 3% on a ${result.annualGross.toLocaleString()} salary
                  that is ${Math.round(result.annualGross * 0.03).toLocaleString()} in free money per year.
                  Not contributing enough to get the full match is leaving part of your
                  compensation on the table. Update your 401k contribution above and
                  recalculate to see the impact.
                </p>
              </div>
            )}

            {/* ── NOW WHAT? Interpretation Layer ── */}
            {(() => {
              const effectiveRate = result.effectiveRate
              const marginalRate = result.marginalRate
              const takeHomePct = Math.round((result.netPaycheck / result.grossPaycheck) * 100)
              const annualK401 = result.retirement * result.periods
              const k401Pct = parseFloat(fourOhOneK) || 0
              const annualTaxes = (result.fedTax + result.stateTax + result.ss + result.medicare) * result.periods

              let shockTier: 'mild' | 'moderate' | 'significant' | 'severe'
              let shockMessage: string

              if (takeHomePct >= 82) {
                shockTier = 'mild'
                shockMessage = `You keep ${takeHomePct}% of your gross paycheck — a relatively mild deduction. At your income level and state, taxes and deductions are taking a smaller share than most. This is a strong starting position for building wealth early in your career.`
              } else if (takeHomePct >= 74) {
                shockTier = 'moderate'
                shockMessage = `You keep ${takeHomePct}% of your gross paycheck. The gap between your offer letter number and your bank deposit is typical for your income and location. Every new employee experiences this — the key is understanding which deductions are mandatory (taxes, FICA) vs choices you control (401k, health insurance).`
              } else if (takeHomePct >= 65) {
                shockTier = 'significant'
                shockMessage = `You keep ${takeHomePct}% of your gross paycheck — taxes and deductions are taking a significant share. At your income level combined federal, state, and FICA taxes add up quickly. The good news: pre-tax contributions (401k, HSA) directly reduce your taxable income and increase your take-home relative to not contributing at all.`
              } else {
                shockTier = 'severe'
                shockMessage = `You keep only ${takeHomePct}% of your gross paycheck. The gap between offer and take-home is large — driven by your income level, state tax rate (${result.stateName}), and deductions. This is the reality of higher-income employment. Understanding where each dollar goes is the first step to optimizing your financial position.`
              }

              let k401Message: string
              if (k401Pct === 0) {
                k401Message = `You are contributing 0% to your 401k. This is the single most important first financial decision of your career. If your employer matches any amount you are leaving free money unclaimed. At a $${result.annualGross.toLocaleString()} salary a 3% employer match = $${Math.round(result.annualGross * 0.03).toLocaleString()}/year in free compensation. Enroll today and contribute at minimum the match percentage.`
              } else if (k401Pct < 6) {
                k401Message = `You are contributing ${k401Pct}% ($${Math.round(annualK401).toLocaleString()}/year) to your 401k. Good start — but verify your employer match threshold. Most employers match up to 3-6%. If your employer matches 6% and you contribute ${k401Pct}% you are leaving ${6 - k401Pct}% of your salary in unclaimed matching funds.`
              } else if (k401Pct < 15) {
                k401Message = `You are contributing ${k401Pct}% ($${Math.round(annualK401).toLocaleString()}/year) — a strong start for your first job. The 2026 limit is $23,500. If you increase contributions by 1% per year you will reach the maximum within a few years without feeling a significant paycheck impact. Time in market at your age is your greatest asset.`
              } else {
                k401Message = `You are contributing ${k401Pct}% ($${Math.round(annualK401).toLocaleString()}/year) — exceptional for a first job. If not already at the $23,500 annual limit consider increasing further. Next priority: open a Roth IRA ($7,000/year) while your income is likely below the phase-out threshold ($161,000 single in 2026).`
              }

              let nextActions: string[]
              if (shockTier === 'mild' || shockTier === 'moderate') {
                nextActions = [
                  `Contribute at least enough to your 401k to capture the full employer match — verify the exact match percentage with HR this week`,
                  `Open a Roth IRA immediately — at your income level you likely qualify and tax-free growth over 40 years is enormous`,
                  `Build a $1,000 starter emergency fund before lifestyle inflation sets in — automate a transfer on your first payday`,
                  `Avoid lifestyle inflation for 12 months — live on what you earned before this job and invest the difference`
                ]
              } else if (shockTier === 'significant') {
                nextActions = [
                  `Increase 401k contributions — every pre-tax dollar contributed reduces your taxable income and increases your effective take-home`,
                  `Open an HSA if your health plan is HSA-eligible — triple tax advantage and the best savings account available`,
                  `Model your budget on your net paycheck ($${result.netPaycheck.toLocaleString()}) not your gross — gross is a fiction that hits your bank account before you can spend it`,
                  `Negotiate salary review in 6 months — first-year employees who negotiate early earn significantly more over a career than those who wait`
                ]
              } else {
                nextActions = [
                  `Max tax-advantaged accounts: 401k ($23,500 in 2026) and HSA ($4,300 single) — at your income these are essential, not optional`,
                  `Understand your marginal rate (${marginalRate}%) — every raise, bonus, or side income is taxed at this rate, not your effective rate`,
                  `Consider traditional 401k over Roth 401k at your income level — pre-tax contributions save more at a ${marginalRate}% marginal rate`,
                  `Track your net worth from day one — knowing your starting number makes every future milestone more meaningful`
                ]
              }

              const borderColor = shockTier === 'mild' ? '#4ade80'
                : shockTier === 'moderate' ? '#60a5fa'
                : shockTier === 'significant' ? '#facc15'
                : '#e94560'

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
                      Now What? Your First Paycheck Action Plan
                    </h3>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                      Paycheck Reality — You Keep {takeHomePct}% of Gross
                    </p>
                    <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                      {shockMessage}
                    </p>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                      Your Tax Picture — {effectiveRate}% Effective / {marginalRate}% Marginal
                    </p>
                    <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                      Your effective rate ({effectiveRate}%) is what you actually pay on total income.
                      Your marginal rate ({marginalRate}%) is what you pay on the next dollar earned —
                      this applies to raises, bonuses, and side income. The gap between these two numbers
                      is how the progressive tax system works: lower brackets apply to lower income, not all income.
                      You pay ${Math.round(annualTaxes).toLocaleString()} in total federal, state, and FICA taxes annually.
                    </p>
                  </div>

                  <div style={{ background: '#1e2d4a', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px' }}>
                    <p style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.7', margin: 0, fontWeight: '600' }}>
                      📈 {k401Message}
                    </p>
                  </div>

                  <div style={{ background: '#1e2d4a', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px' }}>
                    <p style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.7', margin: 0, fontWeight: '600' }}>
                      ⏰ Time is your biggest advantage. $200/month invested at age 22 at 7% annual return
                      grows to approximately $525,000 by age 62. The same $200/month started at 32 grows
                      to only $243,000. Starting now — even a small amount — is worth more than starting
                      later with more.
                    </p>
                  </div>

                  <div>
                    <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                      Your First 4 Financial Moves
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
              text={`I calculated my first real paycheck on a $${result.annualGross.toLocaleString()} salary — take-home is $${result.netPaycheck.toLocaleString()} per paycheck (${Math.round(result.netPaycheck / result.grossPaycheck * 100)}% of gross). No more paycheck shock. Calculate yours at Dayblip 💵`}
              url="https://www.dayblip.com/finance/first-paycheck"
              title="First Paycheck Calculator — What Will I Actually Take Home?"
              tiktokText={`POV: you calculate your first real paycheck 💵 $${result.annualGross.toLocaleString()} salary = $${result.netPaycheck.toLocaleString()} per paycheck. Here's where the rest went 👇 #firstjob #salary #moneytok #newgrad`}
              instagramText={`First paycheck reality check 💵 $${result.annualGross.toLocaleString()} salary → $${result.netPaycheck.toLocaleString()} take-home per paycheck. Calculate yours free at dayblip.com/finance/first-paycheck`}
            />
          </div>
        )}

        <FAQAccordion items={[
          {
            question: 'Why is my paycheck so much less than my salary?',
            answer: 'Your gross salary is split between you and several tax authorities before it reaches your bank account. Federal income tax takes 10-22% for most new graduates. Social Security takes 6.2% on the first $184,500 of wages. Medicare takes 1.45% on all wages. State income tax varies from 0% (Texas, Florida, Washington) to 9-11% (California, Oregon, Hawaii). Health insurance premiums and 401k contributions are deducted before or after tax depending on the plan. The result is that most employees take home 65-80% of their gross salary.'
          },
          {
            question: 'What is the difference between gross pay and net pay?',
            answer: 'Gross pay is your salary before any deductions — what your employer agrees to pay you. Net pay (also called take-home pay) is what actually hits your bank account after federal income tax, state income tax, Social Security, Medicare, health insurance premiums, and retirement contributions are subtracted. For most new graduates earning $50,000-80,000 in a moderate-tax state, net pay is typically 68-78% of gross pay.'
          },
          {
            question: 'What is Social Security tax and why do I pay it?',
            answer: 'Social Security tax is 6.2% of your gross wages up to $184,500 in 2026 — the wage base set by the Social Security Administration. This funds the Social Security retirement and disability programs. Your employer also pays 6.2% on your behalf — money that never appears on your paycheck. You will receive Social Security benefits when you retire, become disabled, or your survivors will receive benefits if you die. The amount you receive is based on your lifetime earnings history.'
          },
          {
            question: 'Should I contribute to my 401k on my first job?',
            answer: 'Yes — immediately, and at minimum enough to get your full employer match. If your employer matches 3% of your salary and you earn $65,000, not contributing at least 3% means you forfeit $1,950 in free compensation annually. The cost per paycheck to get the full match is typically $75-150 depending on salary and pay frequency — and that contribution is pre-tax, meaning it reduces your taxable income and costs you less than the face value. Starting early matters enormously: $200 per month at 22 grows to approximately $525,000 by age 62 at 7% annual return.'
          },
          {
            question: 'How do I read my first pay stub?',
            answer: 'Your pay stub shows gross pay at the top — your full salary divided by pay periods. Below that are deductions in two categories: pre-tax (401k, health insurance, HSA — these reduce your taxable income) and post-tax (Roth 401k, some life insurance). Federal and state withholding show how much was sent to tax authorities. FICA shows your Social Security and Medicare contributions. Net pay at the bottom is what hits your bank account. YTD columns show running totals for the year.'
          },
          {
            question: 'How can I increase my take-home pay?',
            answer: 'Four legal ways to increase your net paycheck: First, update your W-4 with your employer — if you are single with one job and no dependents the default withholding is usually accurate but adjustments can help. Second, contribute to a pre-tax 401k — this reduces your taxable income and therefore your federal and state tax. Third, enroll in an HSA if you have a high-deductible health plan — contributions are pre-tax and reduce your taxable income. Fourth, choose a state with no income tax when job searching — moving from California (9.3%) to Texas (0%) on a $70,000 salary saves approximately $6,510 per year.'
          }
        ]} />

        <RelatedTools tools={[
          { emoji: '💵', title: 'Take-Home Pay Calculator', desc: 'Full paycheck calculator for any situation', href: '/finance/take-home-pay' },
          { emoji: '📊', title: 'Tax Bracket Calculator', desc: 'Your marginal and effective tax rates', href: '/finance/tax-brackets' },
          { emoji: '🏦', title: '401k Calculator', desc: 'How much your contributions will grow', href: '/finance/401k-calculator' },
          { emoji: '💼', title: 'Salary by Job and State', desc: 'Is your offer competitive?', href: '/salary' }
        ]} />

        <LastUpdated date="June 2026" />
        <MethodologyNote text="Federal income tax calculated using 2026 brackets per IRS Revenue Procedure 2025-32. Standard deduction: $16,100 single, $32,200 married filing jointly, $24,150 head of household. Social Security tax: 6.2% on wages up to $184,500 (2026 wage base per SSA). Medicare tax: 1.45% on all wages (additional 0.9% on wages above $200,000 not included). State income tax applied as flat rate on federal taxable income — rates are approximations based on top marginal rates and may differ from actual liability for some income levels. Health insurance deduction treated as pre-tax (Section 125 cafeteria plan). 401k contribution treated as pre-tax traditional contribution. Roth 401k, HSA, FSA, and other deductions not included. This calculator provides an estimate — actual withholding depends on W-4 elections, additional income sources, and employer-specific payroll processing. Always verify with your employer's HR or payroll department. Sources: IRS Rev. Proc. 2025-32, SSA 2026 COLA announcement, state revenue department rate schedules." />
      </div>
    </main>
  )
}
