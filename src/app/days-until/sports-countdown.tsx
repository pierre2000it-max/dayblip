'use client'

import { useState, useEffect } from 'react'
import { SportEvent, getDaysUntil } from '@/data/sports-events'
import ShareButtons from '@/components/ShareButtons'
import FAQAccordion from '@/components/FAQAccordion'
import AuthorByline from '@/components/AuthorByline'
import Breadcrumb from '@/components/Breadcrumb'

interface SportsCountdownProps {
  event: SportEvent
  faqItems: { question: string; answer: string }[]
  relatedSlugs: string[]
}

export default function SportsCountdown({ event, faqItems }: SportsCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(getDaysUntil(event.date))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getDaysUntil(event.date))
    }, 1000)
    return () => clearInterval(interval)
  }, [event.date])

  const pad = (n: number) => String(n).padStart(2, '0')
  const [year, month, day] = event.date.split('-').map(Number)
  const formattedDate = new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const allSports = [
    { slug: 'super-bowl', label: '🏈 Super Bowl' },
    { slug: 'world-cup', label: '⚽ World Cup' },
    { slug: 'world-series', label: '⚾ World Series' },
    { slug: 'march-madness', label: '🏀 March Madness' },
    { slug: 'nba-finals', label: '🏀 NBA Finals' },
  ]

  return (
    <main style={{ background: '#0d1b2a', minHeight: '100vh', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Countdowns', href: '/days-until' },
          { label: event.name }
        ]} />

        {/* Header */}
        <div style={{ textAlign: 'center', margin: '32px 0 24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>{event.emoji}</div>
          <h1 style={{ color: '#ffffff', fontSize: '36px', fontWeight: '800', margin: '0 0 8px' }}>
            Days Until {event.shortName}
          </h1>
          <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 4px' }}>
            {formattedDate}
          </p>
          <p style={{ color: '#a8a8b3', fontSize: '14px', margin: 0 }}>
            {event.venue} — {event.location}
          </p>
          {!event.confirmed && (
            <p style={{ color: '#e94560', fontSize: '12px', margin: '8px 0 0', fontStyle: 'italic' }}>
              {event.notes}
            </p>
          )}
        </div>

        {/* Quick Answer */}
        <div style={{
          background: '#1e2d4a',
          borderLeft: '4px solid #e94560',
          borderRadius: '8px',
          padding: '16px 20px',
          margin: '0 0 32px'
        }}>
          <p style={{ color: '#e94560', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>QUICK ANSWER</p>
          <p style={{ color: '#ffffff', fontSize: '16px', lineHeight: '1.7', margin: 0 }}>
            {timeLeft.isPast
              ? `${event.name} has already taken place.`
              : `There are ${timeLeft.days.toLocaleString()} days until ${event.name} on ${formattedDate} at ${event.venue} in ${event.location}.`
            }
          </p>
        </div>

        <AuthorByline variant="tool" />

        {/* Countdown display */}
        {!timeLeft.isPast && (
          <div style={{
            background: '#1e2d4a',
            borderRadius: '16px',
            padding: '40px 24px',
            textAlign: 'center',
            margin: '32px 0'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {[
                { value: timeLeft.days.toLocaleString(), label: 'Days' },
                { value: pad(timeLeft.hours), label: 'Hours' },
                { value: pad(timeLeft.minutes), label: 'Minutes' },
                { value: pad(timeLeft.seconds), label: 'Seconds' },
              ].map(item => (
                <div key={item.label} style={{
                  background: '#0d1b2a',
                  borderRadius: '12px',
                  padding: '20px 8px'
                }}>
                  <div style={{
                    color: '#e94560',
                    fontSize: item.label === 'Days' ? '42px' : '36px',
                    fontWeight: '800',
                    lineHeight: 1,
                    marginBottom: '8px',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {item.value}
                  </div>
                  <div style={{ color: '#a8a8b3', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event description */}
        <div style={{
          background: '#1e2d4a',
          borderRadius: '12px',
          padding: '24px',
          margin: '0 0 32px',
          borderLeft: '4px solid #e94560'
        }}>
          <p style={{ color: '#a8a8b3', fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
            {event.description}
          </p>
        </div>

        {/* Share buttons */}
        <ShareButtons
          text={`${timeLeft.days.toLocaleString()} days until ${event.name}! ${event.emoji} Counting down at Dayblip`}
          url={`https://www.dayblip.com/days-until/${event.slug}`}
          title={`Days Until ${event.name} — Live Countdown`}
          tiktokText={`${timeLeft.days.toLocaleString()} days until ${event.name} ${event.emoji} #sports #countdown`}
          instagramText={`${timeLeft.days.toLocaleString()} days until ${event.name} ${event.emoji} Live countdown at dayblip.com/days-until/${event.slug}`}
        />

        {/* FAQ */}
        <FAQAccordion items={faqItems} />

        {/* JSON-LD Schemas */}
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
              name: `Days Until ${event.name} — Live Countdown`,
              url: `https://www.dayblip.com/days-until/${event.slug}`,
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Web',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              description: `Live countdown to ${event.name} on ${formattedDate} at ${event.venue}.`
            })
          }}
        />

        {/* Related sports countdowns */}
        <div style={{ margin: '40px 0' }}>
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: '0 0 16px' }}>
            More Sports Countdowns
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {allSports.filter(s => s.slug !== event.slug).map(s => (
              <a
                key={s.slug}
                href={`/days-until/${s.slug}`}
                style={{
                  background: '#1e2d4a',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  color: '#a8a8b3',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Other countdowns */}
        <div style={{ margin: '0 0 40px' }}>
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: '0 0 16px' }}>
            Other Countdowns
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { href: '/days-until/christmas', label: '🎄 Christmas' },
              { href: '/days-until/thanksgiving', label: '🦃 Thanksgiving' },
              { href: '/days-until/halloween', label: '🎃 Halloween' },
              { href: '/days-until/new-years', label: "🎆 New Year's" },
            ].map(s => (
              <a
                key={s.href}
                href={s.href}
                style={{
                  background: '#1e2d4a',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  color: '#a8a8b3',
                  textDecoration: 'none',
                  fontSize: '13px'
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Methodology note for unconfirmed dates */}
        {!event.confirmed && (
          <div style={{
            background: '#1e2d4a',
            borderRadius: '8px',
            padding: '16px 20px',
            color: '#a8a8b3',
            fontSize: '13px',
            lineHeight: '1.6',
            margin: '0 0 32px'
          }}>
            <strong style={{ color: '#ffffff' }}>Note on date accuracy:</strong>{' '}
            {event.notes} This page will be updated when the official date is announced.
          </div>
        )}
      </div>
    </main>
  )
}
