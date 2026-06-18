import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import AuthorByline from '@/components/AuthorByline'

const tools = [
  {
    emoji: '🏠',
    title: 'Buy vs Rent',
    desc: 'Is buying a home actually better than renting? The answer depends on how long you stay.',
    href: '/tools/is-it-worth-it/buy-vs-rent'
  },
  {
    emoji: '🚗',
    title: 'Lease vs Buy a Car',
    desc: 'Should you lease or buy your next car? The true cost difference over 5 years.',
    href: '/tools/is-it-worth-it/lease-vs-buy-car'
  },
  {
    emoji: '🎓',
    title: 'Degree vs Bootcamp',
    desc: 'Is a 4-year degree worth it compared to a coding bootcamp? ROI by career path.',
    href: '/tools/is-it-worth-it/degree-vs-bootcamp'
  },
  {
    emoji: '💪',
    title: 'Gym Membership',
    desc: 'Is your gym membership worth the cost? Calculate your real cost per visit.',
    href: '/tools/is-it-worth-it/gym-membership'
  },
  {
    emoji: '📺',
    title: 'Cable vs Streaming',
    desc: 'Is cutting the cord worth it? Compare your total streaming bill to cable.',
    href: '/tools/is-it-worth-it/cable-vs-streaming'
  },
  {
    emoji: '🛍️',
    title: 'Black Friday Deal Analyzer',
    desc: 'Is that deal actually real or did they inflate the price? Find out in seconds.',
    href: '/tools/is-it-worth-it/black-friday-deal'
  }
]

export default function IsItWorthItHub() {
  return (
    <main style={{ background: '#0d1b2a', minHeight: '100vh', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'Is It Worth It?' }
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
          Is It Worth It?
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px' }}>
          Clear yes or no answers to life&apos;s biggest financial decisions — with the exact numbers behind them.
        </p>

        <AuthorByline variant="tool" />

        <div style={{
          background: '#1e2d4a',
          borderLeft: '4px solid #e94560',
          borderRadius: '8px',
          padding: '16px 20px',
          margin: '24px 0 40px'
        }}>
          <p style={{ color: '#e94560', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>QUICK ANSWER</p>
          <p style={{ color: '#ffffff', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
            Most financial decisions look obvious until you run the actual numbers.
            A gym membership costs $1,200 per year — but only $4 per visit if you go 3 times a week.
            A home purchase beats renting in most markets after 5-7 years.
            These calculators show you the exact breakeven point for your specific situation.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          margin: '0 0 48px'
        }}>
          {tools.map(tool => (
            <Link
              key={tool.href}
              href={tool.href}
              style={{
                background: '#1e2d4a',
                borderRadius: '12px',
                padding: '24px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '32px' }}>{tool.emoji}</div>
              <div style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700' }}>{tool.title}</div>
              <div style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.6', flexGrow: 1 }}>{tool.desc}</div>
              <div style={{
                background: '#e94560',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '700',
                textAlign: 'center',
                marginTop: 'auto'
              }}>
                Calculate →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
