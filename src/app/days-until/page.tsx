import Link from 'next/link'

// ── Sports data (from sports-events.ts — hardcoded for server render perf) ───

const SPORTS = [
  {
    slug: 'world-cup',
    emoji: '⚽',
    name: 'FIFA World Cup Final',
    date: 'July 19, 2026',
    confirmed: true,
  },
  {
    slug: 'super-bowl',
    emoji: '🏈',
    name: 'Super Bowl LXI',
    date: 'February 14, 2027',
    confirmed: true,
  },
  {
    slug: 'world-series',
    emoji: '⚾',
    name: 'World Series 2026',
    date: '~October 27, 2026',
    confirmed: false,
  },
  {
    slug: 'march-madness',
    emoji: '🏀',
    name: 'NCAA March Madness',
    date: '~March 16, 2027',
    confirmed: false,
  },
  {
    slug: 'nba-finals',
    emoji: '🏀',
    name: 'NBA Finals 2027',
    date: '~June 5, 2027',
    confirmed: false,
  },
]

// ── Holidays (slugs that exist in holidays.json) ─────────────────────────────

const HOLIDAYS = [
  { slug: 'christmas',        emoji: '🎄', name: 'Christmas' },
  { slug: 'halloween',        emoji: '🎃', name: 'Halloween' },
  { slug: 'new-years',        emoji: '🎆', name: "New Year's Day" },
  { slug: 'thanksgiving',     emoji: '🦃', name: 'Thanksgiving' },
  { slug: 'valentines-day',   emoji: '💝', name: "Valentine's Day" },
  { slug: 'independence-day', emoji: '🇺🇸', name: 'Independence Day' },
  { slug: 'easter',           emoji: '🐣', name: 'Easter' },
  { slug: 'mothers-day',      emoji: '💐', name: "Mother's Day" },
  { slug: 'black-friday',     emoji: '🛍️', name: 'Black Friday' },
  { slug: 'st-patricks-day',  emoji: '☘️', name: "St. Patrick's Day" },
  { slug: 'summer-break',     emoji: '☀️', name: 'First Day of Summer' },
]

export default function DaysUntilHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Countdown Timers — Days Until Holidays and Sports Events",
            "url": "https://www.dayblip.com/days-until",
            "description": "Free live countdown timers to every major holiday and sports event. Updated in real time.",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.dayblip.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Countdowns",
                  "item": "https://www.dayblip.com/days-until"
                }
              ]
            }
          })
        }}
      />

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 64px' }}>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: 24, fontSize: 14, color: '#6b7280' }}>
          <Link href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#111827' }}>Countdowns</span>
        </nav>

        {/* Hero */}
        <header style={{ marginBottom: 48, textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, margin: '0 0 12px', lineHeight: 1.2 }}>
            Countdown Timers
          </h1>
          <p style={{ fontSize: 18, color: '#6b7280', margin: 0, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Live countdowns to every major holiday and sports event. Free, no sign-up.
          </p>
        </header>

        {/* Sports section */}
        <section aria-labelledby="sports-heading" style={{ marginBottom: 56 }}>
          <h2
            id="sports-heading"
            style={{ fontSize: 22, fontWeight: 700, margin: '0 0 20px', borderBottom: '2px solid #e5e7eb', paddingBottom: 10 }}
          >
            🏆 Sports Events
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 16,
            }}
          >
            {SPORTS.map((event) => (
              <Link
                key={event.slug}
                href={`/days-until/${event.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    padding: '20px 20px 16px',
                    background: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{event.emoji}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                      {event.name}
                    </h3>
                    {event.confirmed && (
                      <span
                        style={{
                          flexShrink: 0,
                          fontSize: 11,
                          fontWeight: 600,
                          background: '#dcfce7',
                          color: '#166534',
                          borderRadius: 4,
                          padding: '2px 6px',
                          lineHeight: 1.4,
                        }}
                      >
                        Confirmed
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 12px' }}>{event.date}</p>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#6366f1' }}>
                    See Countdown →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Holidays section */}
        <section aria-labelledby="holidays-heading">
          <h2
            id="holidays-heading"
            style={{ fontSize: 22, fontWeight: 700, margin: '0 0 20px', borderBottom: '2px solid #e5e7eb', paddingBottom: 10 }}
          >
            🗓️ Holidays
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {HOLIDAYS.map((h) => (
              <Link
                key={h.slug}
                href={`/days-until/${h.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 9999,
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#374151',
                  textDecoration: 'none',
                  background: '#f9fafb',
                }}
              >
                <span>{h.emoji}</span>
                <span>{h.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
