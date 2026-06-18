'use client'
import { useState } from 'react'
import ShareButtons from '@/components/ShareButtons'
import FAQAccordion from '@/components/FAQAccordion'
import AuthorByline from '@/components/AuthorByline'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedTools from '@/components/RelatedTools'
import LastUpdated from '@/components/LastUpdated'
import MethodologyNote from '@/components/MethodologyNote'

const GOOD_DEAL_THRESHOLD: Record<string, number> = {
  electronics: 20,
  appliances: 25,
  clothing: 40,
  toys: 30,
  furniture: 35,
  tools: 25,
  other: 20
}

const CATEGORY_LABELS: Record<string, string> = {
  electronics: 'Electronics',
  appliances: 'Appliances',
  clothing: 'Clothing / Apparel',
  toys: 'Toys / Games',
  furniture: 'Furniture / Home',
  tools: 'Tools / Hardware',
  other: 'Other'
}

export default function BlackFridayDealPage() {
  const [originalPrice, setOriginalPrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [advertisedDiscount, setAdvertisedDiscount] = useState('')
  const [category, setCategory] = useState('electronics')
  const [financeIt, setFinanceIt] = useState(false)
  const [apr, setApr] = useState('24')
  const [months, setMonths] = useState('12')

  const [result, setResult] = useState<{
    verdict: 'REAL DEAL' | 'INFLATED DEAL' | 'SKIP IT'
    realDiscount: number
    advertised: number
    discrepancy: number
    savings: number
    opportunityCost10yr: number
    monthlyPayment: number
    totalFinancedCost: number
    financingOvercharge: number
    priceHistory: string
    recommendation: string
  } | null>(null)

  function calculate() {
    const original = parseFloat(originalPrice)
    const sale = parseFloat(salePrice)

    if (!original || !sale || sale >= original) return

    const realDiscount = ((original - sale) / original) * 100
    const advertised = parseFloat(advertisedDiscount) || realDiscount
    const discrepancy = Math.abs(realDiscount - advertised)
    const savings = original - sale

    const opportunityCost10yr = sale * Math.pow(1.07, 10)

    const aprNum = parseFloat(apr) / 100 / 12
    const monthsNum = parseFloat(months)
    const monthlyPayment = financeIt && aprNum > 0
      ? sale * (aprNum * Math.pow(1 + aprNum, monthsNum)) / (Math.pow(1 + aprNum, monthsNum) - 1)
      : 0
    const totalFinancedCost = monthlyPayment * monthsNum
    const financingOvercharge = totalFinancedCost - sale

    const threshold = GOOD_DEAL_THRESHOLD[category] ?? 20
    const isInflated = discrepancy > 5
    const isGoodDiscount = realDiscount >= threshold

    let verdict: 'REAL DEAL' | 'INFLATED DEAL' | 'SKIP IT'
    let recommendation: string

    if (isInflated && !isGoodDiscount) {
      verdict = 'SKIP IT'
      recommendation = `The advertised ${advertised.toFixed(0)}% discount is inflated — the real discount is only ${realDiscount.toFixed(1)}%, below the ${threshold}% threshold for ${CATEGORY_LABELS[category]}. The original price appears to have been marked up before the sale. Skip it or wait for a better deal.`
    } else if (isInflated) {
      verdict = 'INFLATED DEAL'
      recommendation = `The advertised ${advertised.toFixed(0)}% discount overstates the real ${realDiscount.toFixed(1)}% savings by ${discrepancy.toFixed(1)} percentage points. The actual savings of $${savings.toLocaleString()} is real but the discount was exaggerated. Only buy if you genuinely need this item.`
    } else if (isGoodDiscount) {
      verdict = 'REAL DEAL'
      recommendation = `This is a genuine ${realDiscount.toFixed(1)}% discount — above the ${threshold}% threshold for ${CATEGORY_LABELS[category]}. The advertised discount matches the real savings within normal rounding. This is worth buying if you were already planning to purchase this item.`
    } else {
      verdict = 'SKIP IT'
      recommendation = `A ${realDiscount.toFixed(1)}% discount is below the ${threshold}% threshold for ${CATEGORY_LABELS[category]}. This is not a standout Black Friday deal. You can likely find the same or better price year-round.`
    }

    const priceHistory = `To verify this deal check CamelCamelCamel.com (Amazon price history), Honey, or Google Shopping. If the item was selling for close to $${sale.toLocaleString()} before November — this is not a real Black Friday discount.`

    setResult({
      verdict,
      realDiscount: Math.round(realDiscount * 10) / 10,
      advertised: Math.round(advertised * 10) / 10,
      discrepancy: Math.round(discrepancy * 10) / 10,
      savings: Math.round(savings),
      opportunityCost10yr: Math.round(opportunityCost10yr),
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalFinancedCost: Math.round(totalFinancedCost),
      financingOvercharge: Math.round(financingOvercharge),
      priceHistory,
      recommendation
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
                name: 'How do retailers inflate Black Friday prices?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Retailers commonly raise the listed original price in the weeks before Black Friday so the discounted price looks like a bigger deal. A TV normally selling for $700 might be listed at $1,200 in October so the $699 Black Friday price looks like a 42% discount when real savings is only $1.'
                }
              },
              {
                '@type': 'Question',
                name: 'What is a real Black Friday deal?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'A genuine Black Friday deal is a discount from the item\'s actual normal selling price. For electronics a real deal is typically 20% or more off the price the item sold for during October. Verify using CamelCamelCamel price history.'
                }
              },
              {
                '@type': 'Question',
                name: 'Should I finance a Black Friday purchase?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Financing almost always eliminates the savings. A $699 item financed at 28% APR over 12 months costs $826 total — more than the regular price. Only exception is 0% APR promotional financing paid in full before the period ends.'
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
            name: 'Black Friday Deal Analyzer',
            url: 'https://www.dayblip.com/tools/is-it-worth-it/black-friday-deal',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: 'Analyze Black Friday deals to find out if the discount is real or inflated. Includes opportunity cost and financing true cost calculator.'
          })
        }}
      />

      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'Is It Worth It?', href: '/tools/is-it-worth-it' },
          { label: 'Black Friday Deal Analyzer' }
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
          Black Friday Deal Analyzer
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px', lineHeight: '1.6' }}>
          Is that deal actually real — or did the retailer inflate the original
          price to manufacture a bigger discount? Enter the numbers and find out.
        </p>

        <div style={{ background: '#1e2d4a', borderLeft: '4px solid #e94560', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }}>
          <div style={{ color: '#e94560', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: '700' }}>QUICK ANSWER</div>
          <p style={{ color: '#ffffff', fontSize: '15px', margin: 0, lineHeight: '1.7' }}>
            Retailers commonly inflate pre-sale prices by 30–50% in the weeks before Black Friday to manufacture larger discounts. A genuine Black Friday deal in electronics is typically 20%+ off the item&apos;s normal selling price — not the inflated &ldquo;original&rdquo; price. Enter the prices below to find out if your deal is real.
          </p>
        </div>

        <AuthorByline variant="tool" />

        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '32px 0 16px' }}>Analyze This Deal</h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Original price listed by retailer
          </label>
          <input
            type="number"
            value={originalPrice}
            onChange={e => setOriginalPrice(e.target.value)}
            placeholder="$1,200"
            style={inputStyle}
          />
          <p style={{ color: '#a8a8b3', fontSize: '12px', marginTop: '4px' }}>
            The &ldquo;was&rdquo; or &ldquo;regular&rdquo; price shown crossed out on the tag
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Black Friday sale price
          </label>
          <input
            type="number"
            value={salePrice}
            onChange={e => setSalePrice(e.target.value)}
            placeholder="$699"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Advertised discount % (optional)
          </label>
          <input
            type="number"
            value={advertisedDiscount}
            onChange={e => setAdvertisedDiscount(e.target.value)}
            placeholder="e.g. 42"
            style={inputStyle}
          />
          <p style={{ color: '#a8a8b3', fontSize: '12px', marginTop: '4px' }}>
            The % off advertised by the retailer — leave blank to skip inflation check
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Product category
          </label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Are you planning to finance this purchase?
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {([false, true] as boolean[]).map(val => (
              <button
                key={String(val)}
                onClick={() => setFinanceIt(val)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  background: financeIt === val ? '#e94560' : '#1e2d4a',
                  color: '#ffffff'
                }}
              >
                {val ? 'Yes — Financing It' : 'No — Paying Cash'}
              </button>
            ))}
          </div>
        </div>

        {financeIt && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                APR (interest rate %)
              </label>
              <input
                type="number"
                value={apr}
                onChange={e => setApr(e.target.value)}
                placeholder="24"
                style={inputStyle}
              />
              <p style={{ color: '#a8a8b3', fontSize: '12px', marginTop: '4px' }}>
                Store credit cards average 28–32% APR. General credit cards average 20–24% APR.
              </p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                Repayment period (months)
              </label>
              <input
                type="number"
                value={months}
                onChange={e => setMonths(e.target.value)}
                placeholder="12"
                style={inputStyle}
              />
            </div>
          </>
        )}

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
          Analyze This Deal 🔍
        </button>

        {result && (
          <div style={{ margin: '40px 0' }}>
            <div style={{
              background: '#1e2d4a',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              marginBottom: '24px',
              borderTop: `4px solid ${
                result.verdict === 'REAL DEAL' ? '#4ade80' :
                result.verdict === 'INFLATED DEAL' ? '#facc15' : '#e94560'
              }`
            }}>
              <div style={{
                fontSize: '40px',
                fontWeight: '800',
                color: result.verdict === 'REAL DEAL' ? '#4ade80' :
                       result.verdict === 'INFLATED DEAL' ? '#facc15' : '#e94560',
                marginBottom: '12px'
              }}>
                {result.verdict === 'REAL DEAL' ? '✅ REAL DEAL' :
                 result.verdict === 'INFLATED DEAL' ? '⚠️ INFLATED DEAL' : '❌ SKIP IT'}
              </div>
              <p style={{ color: '#a8a8b3', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
                {result.recommendation}
              </p>
            </div>

            <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', margin: '0 0 16px' }}>
                Deal Breakdown
              </h3>
              {[
                { label: 'Original Price', value: `$${parseFloat(originalPrice).toLocaleString()}` },
                { label: 'Sale Price', value: `$${parseFloat(salePrice).toLocaleString()}` },
                { label: 'Your Savings', value: `$${result.savings.toLocaleString()}` },
                { label: 'Real Discount', value: `${result.realDiscount}%` },
                { label: 'Advertised Discount', value: advertisedDiscount ? `${result.advertised}%` : 'Not entered' },
                { label: 'Discount Inflation', value: result.discrepancy > 0 && advertisedDiscount ? `${result.discrepancy}%` : 'None detected' },
              ].map((row, i) => (
                <div key={row.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: i < 5 ? '1px solid #0d1b2a' : 'none'
                }}>
                  <span style={{ color: '#a8a8b3', fontSize: '14px' }}>{row.label}</span>
                  <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: '#0d1b2a',
              borderRadius: '12px',
              padding: '20px 24px',
              marginBottom: '24px',
              borderLeft: '4px solid #a8a8b3'
            }}>
              <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', margin: '0 0 8px' }}>
                Opportunity Cost
              </p>
              <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                If you invested ${parseFloat(salePrice).toLocaleString()} instead of spending it,
                at 7% annual return it would grow to{' '}
                <strong style={{ color: '#ffffff' }}>
                  ${result.opportunityCost10yr.toLocaleString()}
                </strong>
                {' '}in 10 years. Only buy this if the value to you exceeds that future amount.
              </p>
            </div>

            {financeIt && result.monthlyPayment > 0 && (
              <div style={{
                background: '#0d1b2a',
                borderRadius: '12px',
                padding: '20px 24px',
                marginBottom: '24px',
                borderLeft: '4px solid #e94560'
              }}>
                <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', margin: '0 0 8px' }}>
                  ⚠️ Financing Warning
                </p>
                {[
                  { label: 'Monthly payment', value: `$${result.monthlyPayment.toFixed(2)}` },
                  { label: 'Total you will pay', value: `$${result.totalFinancedCost.toLocaleString()}` },
                  { label: 'Interest charged', value: `$${result.financingOvercharge.toLocaleString()}` },
                  { label: 'True item cost', value: `$${result.totalFinancedCost.toLocaleString()} (not $${parseFloat(salePrice).toLocaleString()})` },
                ].map((row, i) => (
                  <div key={row.label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: i < 3 ? '1px solid #1e2d4a' : 'none'
                  }}>
                    <span style={{ color: '#a8a8b3', fontSize: '13px' }}>{row.label}</span>
                    <span style={{ color: i === 2 ? '#e94560' : '#ffffff', fontSize: '13px', fontWeight: '600' }}>
                      {row.value}
                    </span>
                  </div>
                ))}
                <p style={{ color: '#a8a8b3', fontSize: '13px', marginTop: '12px', lineHeight: '1.6' }}>
                  Financing a Black Friday deal at {apr}% APR over {months} months adds
                  ${result.financingOvercharge.toLocaleString()} in interest — erasing most or
                  all of your savings.
                </p>
              </div>
            )}

            <div style={{
              background: '#0d1b2a',
              borderRadius: '12px',
              padding: '20px 24px',
              marginBottom: '24px',
              borderLeft: '4px solid #4ade80'
            }}>
              <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', margin: '0 0 8px' }}>
                💡 Verify With Price History
              </p>
              <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                {result.priceHistory}
              </p>
            </div>

            <ShareButtons
              text={`Is this Black Friday deal real? I used Dayblip's analyzer: ${result.verdict} — real discount is ${result.realDiscount}% (advertised ${result.advertised}%). Check your deals at Dayblip 🛍️`}
              url="https://www.dayblip.com/tools/is-it-worth-it/black-friday-deal"
              title="Black Friday Deal Analyzer — Real Deal or Fake?"
              tiktokText={`POV: you find out your Black Friday deal is ${result.verdict === 'REAL DEAL' ? 'actually real ✅' : 'inflated ❌'} — real discount: ${result.realDiscount}% #blackfriday #deals #moneytok`}
              instagramText={`Black Friday deal check: ${result.verdict} 🛍️ Real discount: ${result.realDiscount}% vs advertised ${result.advertised}%. Free analyzer at dayblip.com/tools/is-it-worth-it/black-friday-deal`}
            />
          </div>
        )}

        <FAQAccordion items={[
          {
            question: 'How do retailers inflate Black Friday prices?',
            answer: 'Retailers commonly raise the listed "original" or "regular" price in the weeks before Black Friday so the discounted price looks like a bigger deal than it is. A TV that normally sells for $700 might be listed at $1,200 in October so the $699 Black Friday price looks like a 42% discount when the real savings is only $1 off the normal price. The FTC requires that "original" prices reflect prices the item was actually sold at for a substantial period — but enforcement is limited and the practice is widespread.'
          },
          {
            question: 'What is a real Black Friday deal?',
            answer: 'A genuine Black Friday deal is a discount from the item\'s actual normal selling price — not an inflated pre-sale price. For electronics a real deal is typically 20% or more off the price the item sold for during October. For clothing 40%+ is common and expected given retail margins. The best way to verify a deal is to check the item\'s price history using tools like CamelCamelCamel for Amazon products or Honey for other retailers.'
          },
          {
            question: 'Should I finance a Black Friday purchase?',
            answer: 'Financing a Black Friday deal almost always eliminates the savings. A $699 TV financed at 28% APR (typical store card) over 12 months costs $826 total — $127 more than the sale price and potentially more than the item\'s regular price. If you cannot pay cash for a Black Friday item you likely cannot afford it. The only exception is 0% APR promotional financing where no interest is charged if paid in full before the promotional period ends.'
          },
          {
            question: 'When is the best time to buy electronics?',
            answer: 'Electronics prices are lowest during Black Friday and Cyber Monday, January (post-holiday clearance), and when new models are released (previous generation drops in price). TVs are cheapest in January and February before the Super Bowl. Laptops drop in August during back-to-school sales. The worst time to buy is in the weeks before Black Friday when retailers raise prices to manufacture the appearance of larger discounts.'
          },
          {
            question: 'What is opportunity cost in spending?',
            answer: 'Opportunity cost is what you give up by spending money instead of saving or investing it. $699 spent on a TV is $699 that cannot grow in an investment account. At a 7% average annual return — the long-term historical average of the S&P 500 — $699 grows to approximately $1,375 in 10 years. This does not mean you should never buy anything — it means every purchase should be weighed against what that money could become. Dayblip\'s calculator shows this figure to make the trade-off visible.'
          },
          {
            question: 'How do I check if a Black Friday price is real?',
            answer: 'Three tools: CamelCamelCamel.com tracks Amazon price history — paste any Amazon URL to see the price over time. Honey browser extension tracks prices across multiple retailers and alerts you to price drops. Google Shopping shows current prices from multiple retailers for easy comparison. If the item was selling for close to the "sale" price before November the Black Friday discount is manufactured. This Dayblip calculator flags when the advertised discount does not match the real price difference.'
          }
        ]} />

        <RelatedTools tools={[
          { emoji: '📺', title: 'Cable vs Streaming', desc: 'Is cutting the cord worth it?', href: '/tools/is-it-worth-it/cable-vs-streaming' },
          { emoji: '💪', title: 'Gym Membership', desc: 'Is your gym worth the cost?', href: '/tools/is-it-worth-it/gym-membership' },
          { emoji: '🛒', title: 'Days Until Black Friday', desc: 'How many days until Black Friday?', href: '/days-until/black-friday' },
          { emoji: '💰', title: 'Compound Interest', desc: 'What your savings could grow to', href: '/finance/compound-interest' }
        ]} />

        <LastUpdated date="June 2026" />
        <MethodologyNote text="Deal authenticity assessed by comparing advertised discount to calculated real discount from prices entered. Inflation flagged when discrepancy exceeds 5 percentage points. Category thresholds (electronics 20%, appliances 25%, clothing 40%, toys 30%, furniture 35%, tools 25%) based on typical Black Friday deal quality benchmarks from Consumer Reports and NerdWallet annual Black Friday analysis. Opportunity cost calculated at 7% annual return — the long-term historical average annual return of the S&P 500 (source: NYU Stern School of Business). Financing calculated using standard amortization formula. Average store card APR of 28–32% from Federal Reserve Consumer Credit data 2024. This tool provides estimates for informational purposes — actual deal value depends on individual circumstances and normal price history of specific items." />
      </div>
    </main>
  )
}
