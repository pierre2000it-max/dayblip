'use client'
import { useState } from 'react'
import ShareButtons from '@/components/ShareButtons'
import FAQAccordion from '@/components/FAQAccordion'
import AuthorByline from '@/components/AuthorByline'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedTools from '@/components/RelatedTools'
import LastUpdated from '@/components/LastUpdated'
import MethodologyNote from '@/components/MethodologyNote'

export default function TimeWithParentsPage() {
  const [parentAge, setParentAge] = useState('')
  const [yourAge, setYourAge] = useState('')
  const [visitsPerYear, setVisitsPerYear] = useState('6')
  const [hoursPerVisit, setHoursPerVisit] = useState('8')
  const [result, setResult] = useState<{
    visitsLeft: number
    yearsLeft: number
    hoursLeft: number
    daysLeft: number
    parentCurrentAge: number
  } | null>(null)

  function calculate() {
    const pAge = parseInt(parentAge)
    const yAge = parseInt(yourAge)
    const vpy = parseFloat(visitsPerYear)
    const hpv = parseFloat(hoursPerVisit)

    if (!pAge || !yAge || !vpy || !hpv) return

    const LIFE_EXPECTANCY = 80
    const yearsLeft = Math.max(0, LIFE_EXPECTANCY - pAge)
    const visitsLeft = Math.round(yearsLeft * vpy)
    const hoursLeft = Math.round(visitsLeft * hpv)
    const daysLeft = Math.round(hoursLeft / 24)

    setResult({ visitsLeft, yearsLeft, hoursLeft, daysLeft, parentCurrentAge: pAge })
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
      question: 'How is the time with parents calculated?',
      answer: "The calculator takes your parent's current age, assumes a life expectancy of 80 years (the US average from CDC data), and multiplies the years remaining by your annual visit frequency and hours per visit. The result is a statistical estimate — not a prediction. Individual health and longevity vary significantly."
    },
    {
      question: 'Why does the number feel so small?',
      answer: 'Because of how time actually works in adulthood. When you lived at home you accumulated thousands of hours of time with your parents every year. After leaving home that collapses to a few visits per year. The cumulative hours drop dramatically. Most people have already spent more than 90% of their total in-person parent time by the time they turn 25.'
    },
    {
      question: 'What if my parents are very healthy and live past 80?',
      answer: 'The calculator uses 80 as a baseline average — the US life expectancy is approximately 78-80 years. If your parents are healthy and likely to live longer, mentally add visits for each additional year. A parent who lives to 90 instead of 80 adds 10 more years of visits at your current frequency.'
    },
    {
      question: 'How can I make the most of the time I have left?',
      answer: 'The research on deathbed regrets consistently shows that people wish they had spent more time with the people they love — not more time working. Practical steps: schedule visits in advance rather than waiting for them to happen naturally, make phone and video calls count on the weeks between visits, and consider increasing your annual visit frequency even by one additional trip per year.'
    },
    {
      question: 'Does this account for phone calls and video calls?',
      answer: 'No — this calculator measures in-person visits only. Regular phone and video calls are valuable but research on relationship quality consistently shows that in-person time creates stronger memories and deeper connection than remote communication. The calculator is designed to focus your attention on the irreplaceable in-person visits.'
    },
    {
      question: 'What if I have lost a parent already?',
      answer: 'This calculator is designed for people with living parents. If you have lost a parent, we are sorry for your loss. The same framework applies to other people you love — grandparents, siblings, close friends. The tool below for time with your kids uses the same approach for a different relationship.'
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
                name: 'How is the time with parents calculated?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "The calculator takes your parent's current age, assumes a life expectancy of 80 years, and multiplies the years remaining by your annual visit frequency and hours per visit."
                }
              },
              {
                '@type': 'Question',
                name: 'Why does the number feel so small?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Because of how time works in adulthood. After leaving home, time with parents collapses to a few visits per year. Most people have spent over 90% of their total in-person parent time by age 25.'
                }
              },
              {
                '@type': 'Question',
                name: 'How can I make the most of the time I have left?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Schedule visits in advance, make phone calls count between visits, and consider increasing your annual visit frequency even by one additional trip per year.'
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
            name: 'Time Left With Your Parents Calculator',
            url: 'https://www.dayblip.com/tools/time-with-parents',
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: 'Calculate how many visits you have left with your parents based on their age and how often you see them. Free, no signup required.'
          })
        }}
      />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 0px' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'Time With Parents' }
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
          Time Left With Your Parents
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px', lineHeight: '1.6' }}>
          By the time you left home at 18, you had already spent 93% of your
          in-person time with your parents. Here is how much is left.
        </p>

        {/* Quick Answer */}
        <div style={{ background: '#1e2d4a', borderLeft: '4px solid #e94560', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }}>
          <div style={{ color: '#e94560', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: '600' }}>
            Quick Answer
          </div>
          {result ? (
            <p style={{ color: '#e2e8f0', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>
              You have approximately <strong style={{ color: '#ffffff' }}>{result.visitsLeft.toLocaleString()} visits</strong> and{' '}
              <strong style={{ color: '#ffffff' }}>{result.hoursLeft.toLocaleString()} hours</strong> of in-person time left with your parent based on{' '}
              {result.yearsLeft} years remaining and {visitsPerYear} visits per year.
            </p>
          ) : (
            <p style={{ color: '#e2e8f0', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>
              If your parent is 65 and you visit 6 times per year for 8 hours each visit — you have approximately 90 visits and 720 hours of in-person time remaining. Enter your numbers below to see your personal result.
            </p>
          )}
        </div>

        <AuthorByline variant="tool" />

        {/* Input Section */}
        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '32px 0 16px' }}>
          Calculate Your Time
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Your parent&apos;s current age
          </label>
          <input
            type="number"
            min="40"
            max="100"
            placeholder="e.g. 65"
            value={parentAge}
            onChange={e => setParentAge(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Your current age
          </label>
          <input
            type="number"
            min="18"
            max="80"
            placeholder="e.g. 35"
            value={yourAge}
            onChange={e => setYourAge(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            How many times per year do you visit them?
          </label>
          <input
            type="number"
            min="1"
            max="52"
            placeholder="e.g. 6"
            value={visitsPerYear}
            onChange={e => setVisitsPerYear(e.target.value)}
            style={inputStyle}
          />
          <p style={{ color: '#a8a8b3', fontSize: '12px', marginTop: '4px', margin: '4px 0 0' }}>
            Include holidays, trips, and regular visits
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Average hours per visit
          </label>
          <input
            type="number"
            min="1"
            max="72"
            placeholder="e.g. 8"
            value={hoursPerVisit}
            onChange={e => setHoursPerVisit(e.target.value)}
            style={inputStyle}
          />
          <p style={{ color: '#a8a8b3', fontSize: '12px', marginTop: '4px', margin: '4px 0 0' }}>
            Include overnight stays — one overnight = ~16 hours
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
          Calculate My Time
        </button>

        {/* Result Section */}
        {result && (
          <div style={{ margin: '40px 0' }}>
            <div style={{
              background: '#1e2d4a',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              marginBottom: '24px',
              borderTop: '4px solid #e94560'
            }}>
              <p style={{ color: '#a8a8b3', fontSize: '15px', margin: '0 0 8px' }}>
                You have approximately
              </p>
              <div style={{ color: '#e94560', fontSize: '64px', fontWeight: '800', lineHeight: 1, margin: '0 0 8px' }}>
                {result.visitsLeft.toLocaleString()}
              </div>
              <p style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: '0 0 24px' }}>
                visits left with your parent
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                borderTop: '1px solid #0d1b2a',
                paddingTop: '24px'
              }}>
                <div>
                  <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700' }}>
                    {result.yearsLeft}
                  </div>
                  <div style={{ color: '#a8a8b3', fontSize: '13px' }}>years remaining</div>
                </div>
                <div>
                  <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700' }}>
                    {result.hoursLeft.toLocaleString()}
                  </div>
                  <div style={{ color: '#a8a8b3', fontSize: '13px' }}>hours together</div>
                </div>
                <div>
                  <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700' }}>
                    {result.daysLeft.toLocaleString()}
                  </div>
                  <div style={{ color: '#a8a8b3', fontSize: '13px' }}>full days together</div>
                </div>
              </div>
            </div>

            <div style={{
              background: '#0d1b2a',
              borderRadius: '12px',
              padding: '20px 24px',
              marginBottom: '24px',
              borderLeft: '4px solid #e94560'
            }}>
              <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.8', margin: 0 }}>
                {result.visitsLeft < 50
                  ? `${result.visitsLeft} visits sounds small — because it is. This is not meant to cause guilt. It is meant to make the next visit feel like what it actually is: one of the precious few you have left.`
                  : result.visitsLeft < 150
                  ? `${result.visitsLeft} visits. That is less than most people assume. The distance, the busyness, the "next time" — they add up. This number is a reminder that next time is now.`
                  : `${result.visitsLeft} visits is more than many people have. You still have real time. The question is how you choose to spend it.`
                }
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
                Share this with someone you love
              </p>
              <ShareButtons
                text={`I just calculated that I have approximately ${result.visitsLeft} visits left with my parent. This number hit different. Calculate yours at Dayblip 💛`}
                url="https://www.dayblip.com/tools/time-with-parents"
                title="How many visits do you have left with your parents?"
                tiktokText={`POV: you calculate how many times you'll see your parents before they're gone 💛 Mine was ${result.visitsLeft} visits. What's yours? #family #lifecalculator #perspective`}
                instagramText={`${result.visitsLeft} visits left with my parent 💛 This calculator made me think. Find yours at dayblip.com/tools/time-with-parents`}
              />
            </div>
          </div>
        )}

        {/* Context Section */}
        <div style={{ margin: '40px 0' }}>
          <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>
            The Math That Changes Everything
          </h2>
          <p style={{ color: '#a8a8b3', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
            Tim Urban of Wait But Why calculated something that stopped the internet: by the time you leave home at 18, you have already spent 93% of all the in-person time you will ever have with your parents. The remaining 7% plays out over the rest of their lives — compressed into holidays, visits, and occasional trips.
          </p>
          <p style={{ color: '#a8a8b3', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
            If your parents are 65 and you see them 6 times a year, you have roughly 90 visits left. That is 90 Christmas mornings, 90 Sunday dinners, 90 chances to hear their stories and tell yours.
          </p>
          <p style={{ color: '#a8a8b3', fontSize: '15px', lineHeight: '1.8' }}>
            This calculator does not exist to make you feel guilty. It exists to make the next visit feel like what it is — one of a finite and precious number of moments.
          </p>
        </div>

        <FAQAccordion items={faqItems} />

        <RelatedTools tools={[
          { emoji: '⏳', title: 'Time With Your Kids', desc: 'How long before they leave home', href: '/tools/time-with-kids' },
          { emoji: '🐾', title: 'Time With Your Pet', desc: 'Precious years remaining together', href: '/tools/time-with-pet' },
          { emoji: '📅', title: 'Life in Weeks', desc: 'Your entire life on one grid', href: '/tools/life-in-weeks' },
          { emoji: '📆', title: 'Days Alive', desc: 'How many days have you lived', href: '/days-alive' }
        ]} />

        <LastUpdated date="June 2026" />

        <MethodologyNote text="Life expectancy baseline of 80 years is based on CDC National Center for Health Statistics data for US life expectancy. Individual longevity varies significantly based on health, genetics, and lifestyle. This tool provides a statistical estimate for reflection purposes only — not a medical or actuarial prediction. Sources: CDC NCHS, Wait But Why 'Your Life in Weeks' by Tim Urban (2014)." />
      </div>
    </main>
  )
}
