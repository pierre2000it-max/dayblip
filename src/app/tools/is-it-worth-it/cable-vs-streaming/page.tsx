'use client'
import { useState } from 'react'
import ShareButtons from '@/components/ShareButtons'
import FAQAccordion from '@/components/FAQAccordion'
import AuthorByline from '@/components/AuthorByline'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedTools from '@/components/RelatedTools'
import LastUpdated from '@/components/LastUpdated'
import MethodologyNote from '@/components/MethodologyNote'

export default function CableVsStreamingPage() {
  const [cableBill, setCableBill] = useState('')
  const [netflix, setNetflix] = useState('0')
  const [hulu, setHulu] = useState('0')
  const [disney, setDisney] = useState('0')
  const [hbo, setHbo] = useState('0')
  const [amazon, setAmazon] = useState('0')
  const [apple, setApple] = useState('0')
  const [youtube, setYoutube] = useState('0')
  const [other, setOther] = useState('0')
  const [internetCost, setInternetCost] = useState('60')
  const [currentInternetCost] = useState('60')
  const [result, setResult] = useState<{
    verdict: 'CUT THE CORD' | 'KEEP CABLE'
    totalStreaming: number
    totalCable: number
    monthlySavings: number
    annualSavings: number
    streamingServices: number
  } | null>(null)

  function calculate() {
    const cable = parseFloat(cableBill)
    if (!cable) return

    const streamingTotal =
      parseFloat(netflix) +
      parseFloat(hulu) +
      parseFloat(disney) +
      parseFloat(hbo) +
      parseFloat(amazon) +
      parseFloat(apple) +
      parseFloat(youtube) +
      parseFloat(other)

    const internetDiff = parseFloat(internetCost) - parseFloat(currentInternetCost)
    const totalStreamingWithInternet = streamingTotal + Math.max(0, internetDiff)

    const services = [netflix, hulu, disney, hbo, amazon, apple, youtube, other]
      .filter(s => parseFloat(s) > 0).length

    const monthlySavings = cable - totalStreamingWithInternet
    const verdict = monthlySavings > 0 ? 'CUT THE CORD' : 'KEEP CABLE'

    setResult({
      verdict,
      totalStreaming: Math.round(totalStreamingWithInternet * 100) / 100,
      totalCable: Math.round(cable * 100) / 100,
      monthlySavings: Math.round(Math.abs(monthlySavings) * 100) / 100,
      annualSavings: Math.round(Math.abs(monthlySavings) * 12 * 100) / 100,
      streamingServices: services
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
      question: 'Is cutting the cord worth it in 2026?',
      answer: 'It depends on how many streaming services you subscribe to. The average American household now pays for 4.5 streaming services at a combined cost of approximately $60-80 per month — often rivaling cable costs. If you have Netflix, Hulu, HBO Max, Disney+, and Amazon Prime the combined monthly cost is approximately $65 before any internet upgrade costs. Cable bundles average $85-120 per month. The savings depend heavily on your specific subscriptions.'
    },
    {
      question: 'How much does the average person spend on streaming services?',
      answer: 'The average American household spends approximately $61 per month on streaming services according to a 2024 JD Power survey — up from $47 in 2022. With an average of 4-5 active subscriptions households are experiencing what researchers call subscription creep — the gradual accumulation of streaming services that collectively approach or exceed cable costs.'
    },
    {
      question: 'What do I need to cut the cord from cable?',
      answer: 'To cut cable you need a reliable internet connection (at least 25 Mbps for streaming, 100 Mbps for 4K or multiple simultaneous streams), a streaming device (Roku, Fire TV, Apple TV, or smart TV), and your chosen streaming subscriptions. For live TV including local channels and sports you may need YouTube TV, Hulu Live, or an over-the-air antenna for free local channels.'
    },
    {
      question: 'Can I still watch live sports without cable?',
      answer: 'Yes — but it requires planning. YouTube TV ($72.99/month) and Hulu + Live TV ($82.99/month) include most major sports networks including ESPN, Fox Sports, and local channels. ESPN+ ($10.99/month) streams some live events. The NFL, NBA, and MLB all have direct streaming options. However blackout restrictions for local games can be frustrating. For comprehensive sports coverage live TV streaming services are the closest cable replacement.'
    },
    {
      question: 'What is subscription creep?',
      answer: 'Subscription creep is the gradual accumulation of small monthly subscriptions that collectively become a significant expense. Each individual subscription seems reasonable — $10 here, $15 there — but 5-6 services add up to $60-90 per month or $720-1,080 per year. This calculator is designed to make subscription creep visible by adding up all your services at once and comparing them to your current cable bill.'
    },
    {
      question: 'Should I keep cable or switch to streaming?',
      answer: 'Use this calculator to find out based on your actual subscriptions. If your total streaming bill including internet upgrade costs is lower than your cable bill, cutting the cord makes financial sense. If you watch a lot of live sports or local news cable may still offer better value. Many households find that a hybrid approach — keeping internet only and choosing 2-3 streaming services strategically — saves the most money.'
    }
  ]

  const streamingServices = [
    { label: 'Netflix', value: netflix, set: setNetflix, placeholder: '$15.49' },
    { label: 'Hulu', value: hulu, set: setHulu, placeholder: '$7.99' },
    { label: 'Disney+', value: disney, set: setDisney, placeholder: '$13.99' },
    { label: 'HBO Max', value: hbo, set: setHbo, placeholder: '$15.99' },
    { label: 'Amazon Prime Video', value: amazon, set: setAmazon, placeholder: '$8.99' },
    { label: 'Apple TV+', value: apple, set: setApple, placeholder: '$9.99' },
    { label: 'YouTube TV', value: youtube, set: setYoutube, placeholder: '$72.99' },
    { label: 'Other services', value: other, set: setOther, placeholder: '$0' },
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
            name: 'Cable vs Streaming Cost Calculator — Is It Worth It?',
            url: 'https://www.dayblip.com/tools/is-it-worth-it/cable-vs-streaming',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: 'Compare your total streaming services cost to cable TV and find out if cutting the cord saves money.'
          })
        }}
      />

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'Is It Worth It?', href: '/tools/is-it-worth-it' },
          { label: 'Cable vs Streaming' }
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
          Cable vs Streaming Calculator
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px', lineHeight: '1.6' }}>
          Add up all your streaming services and find out if cutting the cord actually saves money
        </p>

        <div style={{ background: '#1e2d4a', borderLeft: '4px solid #e94560', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }}>
          <div style={{ color: '#e94560', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: '700' }}>QUICK ANSWER</div>
          {result ? (
            <p style={{ color: '#ffffff', fontSize: '15px', margin: 0, lineHeight: '1.7' }}>
              Your {result.streamingServices} streaming services cost <strong>${result.totalStreaming}/month</strong> vs cable at <strong>${result.totalCable}/month</strong>.{' '}
              {result.verdict === 'CUT THE CORD'
                ? `Cutting the cord saves you $${result.monthlySavings}/month — $${result.annualSavings}/year.`
                : `Cable is actually cheaper by $${result.monthlySavings}/month — $${result.annualSavings}/year.`
              }
            </p>
          ) : (
            <p style={{ color: '#ffffff', fontSize: '15px', margin: 0, lineHeight: '1.7' }}>
              The average household pays $61/month across 4-5 streaming services — nearly matching a cable bill. Enter your cable bill and streaming subscriptions to see if you&apos;re actually saving by cutting the cord.
            </p>
          )}
        </div>

        <AuthorByline variant="tool" />

        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '32px 0 16px' }}>Your Current Cable Bill</h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Monthly cable + internet bundle</label>
          <input type="number" placeholder="$150" value={cableBill} onChange={e => setCableBill(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Internet-only cost if you cut cable</label>
          <input type="number" placeholder="$60" value={internetCost} onChange={e => setInternetCost(e.target.value)} style={inputStyle} />
          <p style={{ color: '#a8a8b3', fontSize: '12px', margin: '4px 0 0' }}>If your internet is already separate, set this to match your current internet cost</p>
        </div>

        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '0 0 16px' }}>Your Streaming Services</h2>
        <p style={{ color: '#a8a8b3', fontSize: '13px', margin: '0 0 20px' }}>Enter $0 for services you don&apos;t have</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {streamingServices.map(svc => (
            <div key={svc.label}>
              <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>{svc.label}</label>
              <input type="number" placeholder={svc.placeholder} value={svc.value} onChange={e => svc.set(e.target.value)} style={inputStyle} />
            </div>
          ))}
        </div>

        <button
          onClick={calculate}
          style={{ width: '100%', background: '#e94560', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' }}
        >
          Is Cutting the Cord Worth It?
        </button>

        {result && (
          <div style={{ margin: '40px 0' }}>
            <div style={{
              background: '#1e2d4a',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              marginBottom: '24px',
              borderTop: `4px solid ${result.verdict === 'CUT THE CORD' ? '#4ade80' : '#e94560'}`
            }}>
              <div style={{ color: result.verdict === 'CUT THE CORD' ? '#4ade80' : '#e94560', fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>
                {result.verdict === 'CUT THE CORD' ? '✅ CUT THE CORD' : '❌ KEEP CABLE'}
              </div>
              <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px' }}>
                {result.verdict === 'CUT THE CORD'
                  ? `You save $${result.annualSavings}/year by switching to streaming`
                  : `Cable is cheaper by $${result.annualSavings}/year with your current streaming lineup`
                }
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', borderTop: '1px solid #0d1b2a', paddingTop: '24px' }}>
                {[
                  { label: 'Total streaming cost', value: `$${result.totalStreaming}/mo` },
                  { label: 'Cable cost', value: `$${result.totalCable}/mo` },
                  { label: 'Monthly difference', value: `$${result.monthlySavings}/mo` },
                  { label: 'Annual difference', value: `$${result.annualSavings}/yr` },
                  { label: 'Streaming services', value: `${result.streamingServices} services` },
                ].map(stat => (
                  <div key={stat.label}>
                    <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700' }}>{stat.value}</div>
                    <div style={{ color: '#a8a8b3', fontSize: '13px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <ShareButtons
              text={`Is cutting the cord worth it? My ${result.streamingServices} streaming services cost $${result.totalStreaming}/mo vs cable at $${result.totalCable}/mo. ${result.verdict === 'CUT THE CORD' ? `Saving $${result.annualSavings}/year` : `Cable is cheaper by $${result.annualSavings}/year`}. Calculate yours at Dayblip 📺`}
              url="https://www.dayblip.com/tools/is-it-worth-it/cable-vs-streaming"
              title="Cable vs Streaming Calculator — Is It Worth It?"
            />
          </div>
        )}

        <FAQAccordion items={faqItems} />

        <RelatedTools tools={[
          { emoji: '💪', title: 'Gym Membership', desc: 'Is your gym worth the cost?', href: '/tools/is-it-worth-it/gym-membership' },
          { emoji: '☕', title: 'Latte Factor', desc: 'Small daily costs, big impact', href: '/curiosity/latte-factor' },
          { emoji: '🚬', title: 'Smoking Cost Calculator', desc: 'True cost of a daily habit', href: '/tools/smoking-cost' },
          { emoji: '💰', title: 'Compound Interest', desc: 'What saved money grows to', href: '/finance/compound-interest' }
        ]} />

        <LastUpdated date="June 2026" />
        <MethodologyNote text="Average streaming service costs reflect published pricing as of June 2026. Streaming service prices change frequently — verify current pricing at each provider's website. Internet cost differential accounts for the potential need to upgrade from a bundled internet+cable package to a standalone internet plan. Average American streaming spend from JD Power 2024 Streaming Video Services Satisfaction Study. Not financial advice." />
      </div>
    </main>
  )
}
