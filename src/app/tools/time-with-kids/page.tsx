'use client'
import { useState } from 'react'
import ShareButtons from '@/components/ShareButtons'
import FAQAccordion from '@/components/FAQAccordion'
import AuthorByline from '@/components/AuthorByline'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedTools from '@/components/RelatedTools'
import LastUpdated from '@/components/LastUpdated'
import MethodologyNote from '@/components/MethodologyNote'

export default function TimeWithKidsPage() {
  const [kidAge, setKidAge] = useState('')
  const [result, setResult] = useState<{
    yearsLeft: number
    summersLeft: number
    weekendsLeft: number
    weeknightsLeft: number
    holidaysLeft: number
  } | null>(null)

  function calculate() {
    const age = parseInt(kidAge)
    if (isNaN(age) || age < 0 || age > 17) return

    const yearsLeft = Math.max(0, 18 - age)
    const summersLeft = yearsLeft
    const weekendsLeft = Math.round(yearsLeft * 52)
    const weeknightsLeft = Math.round(yearsLeft * 260)
    const holidaysLeft = Math.round(yearsLeft * 6)

    setResult({ yearsLeft, summersLeft, weekendsLeft, weeknightsLeft, holidaysLeft })
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
      question: 'How many summers does my child have left at home?',
      answer: 'Simply subtract your child\'s current age from 18 — the typical age children leave home for college or independence. A 5-year-old has 13 summers left. A 12-year-old has 6. A 15-year-old has just 3. Each summer is approximately 10 weeks of concentrated time together.'
    },
    {
      question: 'Why does the calculator use age 18 as the leaving age?',
      answer: '18 is the conventional age of high school graduation and the most common transition point to college or independence in the United States. Some children leave earlier for boarding school or work, others stay closer to home through college. The calculator uses 18 as a standard baseline — adjust your interpretation based on your family\'s circumstances.'
    },
    {
      question: 'How many weekends do parents spend with their kids?',
      answer: 'The calculator assumes 52 weekends per year at home — a full-count baseline. In reality weekends are shared with activities, sports, friends, and other commitments. A 10-year-old child has approximately 416 weekends before leaving home. Used fully, that is 416 Saturday mornings and 416 Sunday evenings.'
    },
    {
      question: 'What counts as quality time with kids?',
      answer: 'Research from the Journal of Marriage and Family found that the quantity of engaged time matters more than activities. The most impactful time tends to be unstructured — car rides, meals, and casual conversation — rather than scheduled activities. The goal is presence, not programming.'
    },
    {
      question: 'Does this work for children of any age?',
      answer: 'This calculator is designed for children ages 0 through 17 who are still living at home. For children who have already left home, the time-with-parents calculator applies the same framework in reverse — calculating how many visits and hours remain now that the living situation has changed.'
    },
    {
      question: 'How can I make the most of the time left?',
      answer: 'Create rituals that are hard to break — a weekly dinner, a monthly outing, an annual trip. Research on family memory formation shows that repeated rituals create more lasting memories than one-off events. Schedule the time before it disappears into busyness.'
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
                name: 'How many summers does my child have left at home?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Subtract your child\'s current age from 18. A 5-year-old has 13 summers left. A 12-year-old has 6. A 15-year-old has just 3.'
                }
              },
              {
                '@type': 'Question',
                name: 'Why does the calculator use age 18 as the leaving age?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '18 is the conventional age of high school graduation and the most common transition point to college or independence in the United States.'
                }
              },
              {
                '@type': 'Question',
                name: 'How can I make the most of the time left?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Create rituals that are hard to break — a weekly dinner, a monthly outing, an annual trip. Repeated rituals create more lasting memories than one-off events.'
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
            name: 'Time Left With Your Kids at Home Calculator',
            url: 'https://www.dayblip.com/tools/time-with-kids',
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: 'Calculate how many summers, weekends, and years you have left with your kids before they leave home. Free, no signup required.'
          })
        }}
      />

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'Time With Kids' }
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
          Time Left With Your Kids at Home
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px', lineHeight: '1.6' }}>
          The years before your child leaves home feel endless when they are young. They are not. Here is exactly how many summers, weekends, and holidays you have left.
        </p>

        {/* Quick Answer */}
        <div style={{ background: '#1e2d4a', borderLeft: '4px solid #e94560', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }}>
          <div style={{ color: '#e94560', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: '600' }}>
            Quick Answer
          </div>
          {result ? (
            <p style={{ color: '#e2e8f0', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>
              You have <strong style={{ color: '#ffffff' }}>{result.summersLeft} summers</strong>,{' '}
              <strong style={{ color: '#ffffff' }}>{result.weekendsLeft.toLocaleString()} weekends</strong>, and approximately{' '}
              <strong style={{ color: '#ffffff' }}>{result.holidaysLeft} holidays</strong> left before your child leaves home.
            </p>
          ) : (
            <p style={{ color: '#e2e8f0', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>
              If your child is 8 years old, you have 10 summers, 520 weekends, and approximately 60 holidays left together before they leave for college or independence. Enter your child&apos;s age to see your number.
            </p>
          )}
        </div>

        <AuthorByline variant="tool" />

        {/* Input */}
        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '32px 0 16px' }}>
          Calculate Your Time
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Your child&apos;s current age
          </label>
          <input
            type="number"
            min="0"
            max="17"
            placeholder="e.g. 8"
            value={kidAge}
            onChange={e => setKidAge(e.target.value)}
            style={inputStyle}
          />
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

        {/* Result */}
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
                You have
              </p>
              <div style={{ color: '#e94560', fontSize: '64px', fontWeight: '800', lineHeight: 1, margin: '0 0 8px' }}>
                {result.yearsLeft}
              </div>
              <p style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: '0 0 24px' }}>
                years left before they leave home
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                borderTop: '1px solid #0d1b2a',
                paddingTop: '24px'
              }}>
                <div>
                  <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700' }}>{result.summersLeft}</div>
                  <div style={{ color: '#a8a8b3', fontSize: '13px' }}>summers together</div>
                </div>
                <div>
                  <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700' }}>{result.weekendsLeft.toLocaleString()}</div>
                  <div style={{ color: '#a8a8b3', fontSize: '13px' }}>weekends at home</div>
                </div>
                <div>
                  <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700' }}>{result.weeknightsLeft.toLocaleString()}</div>
                  <div style={{ color: '#a8a8b3', fontSize: '13px' }}>weeknight dinners</div>
                </div>
                <div>
                  <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700' }}>{result.holidaysLeft}</div>
                  <div style={{ color: '#a8a8b3', fontSize: '13px' }}>major holidays</div>
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
                {result.yearsLeft <= 3
                  ? 'The countdown is real. These final years are not a rehearsal — they are the thing itself.'
                  : result.yearsLeft <= 8
                  ? 'You are past the halfway point. The time that remains is precious and finite. Use it deliberately.'
                  : 'You have real time left. The question is not whether you have time — it is what you do with it.'
                }
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
                Share this with someone you love
              </p>
              <ShareButtons
                text={`My child has ${result.summersLeft} summers left at home before they leave. ${result.weekendsLeft} weekends. This calculator made me put down my phone. Calculate yours at Dayblip 💙`}
                url="https://www.dayblip.com/tools/time-with-kids"
                title="How many summers do you have left with your kids?"
                tiktokText={`POV: you calculate how many summers your kid has left at home 💙 Mine has ${result.summersLeft}. #parenting #lifecalculator #perspective`}
                instagramText={`${result.summersLeft} summers left with my kid at home 💙 This calculator hit hard. dayblip.com/tools/time-with-kids`}
              />
            </div>
          </div>
        )}

        {/* Context */}
        <div style={{ margin: '40px 0' }}>
          <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>
            The Summers You Cannot Get Back
          </h2>
          <p style={{ color: '#a8a8b3', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
            When your child is young, summer feels infinite. School lets out and the weeks stretch ahead. But each summer is one of a fixed and finite number — and they pass faster than any other time in a parent&apos;s life.
          </p>
          <p style={{ color: '#a8a8b3', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
            A child who is 8 years old has exactly 10 summers left at home. A child who is 14 has 4. By the time most parents realize this, several of those summers are already gone.
          </p>
          <p style={{ color: '#a8a8b3', fontSize: '15px', lineHeight: '1.8' }}>
            This calculator is not meant to create pressure. It is meant to transform ordinary Tuesday dinners and lazy Saturday mornings into what they actually are — part of a numbered and irreplaceable set.
          </p>
        </div>

        <FAQAccordion items={faqItems} />

        <RelatedTools tools={[
          { emoji: '👴', title: 'Time With Your Parents', desc: 'How many visits remain', href: '/tools/time-with-parents' },
          { emoji: '🐾', title: 'Time With Your Pet', desc: 'Precious years remaining together', href: '/tools/time-with-pet' },
          { emoji: '📅', title: 'Life in Weeks', desc: 'Your entire life on one grid', href: '/tools/life-in-weeks' },
          { emoji: '🏖️', title: 'Weekends Left', desc: 'How many weekends until retirement', href: '/weekends-left' }
        ]} />

        <LastUpdated date="June 2026" />

        <MethodologyNote text="Leaving-home age of 18 is based on US Census Bureau data showing the median age of first independent living for American children. Weekend and weeknight calculations assume full-year residence. Holiday count of 6 per year includes Thanksgiving, Christmas/Hanukkah, New Year, Spring Break, Summer, and one additional family holiday. Individual family circumstances vary significantly." />
      </div>
    </main>
  )
}
