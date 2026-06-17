import Link from 'next/link'
import { cities } from '@/data/cost-of-living'
import { SALARY_DATA } from '@/data/salary-data'
import Breadcrumb from '@/components/Breadcrumb'
import AuthorByline from '@/components/AuthorByline'

export default function CompareHubPage() {
  const popularCityComparisons = [
    { a: 'new-york-city', b: 'los-angeles', label: 'New York City vs Los Angeles' },
    { a: 'san-francisco', b: 'seattle', label: 'San Francisco vs Seattle' },
    { a: 'chicago', b: 'miami', label: 'Chicago vs Miami' },
    { a: 'austin', b: 'denver', label: 'Austin vs Denver' },
    { a: 'boston', b: 'washington-dc', label: 'Boston vs Washington DC' },
    { a: 'dallas', b: 'houston', label: 'Dallas vs Houston' },
    { a: 'phoenix', b: 'las-vegas', label: 'Phoenix vs Las Vegas' },
    { a: 'portland', b: 'seattle', label: 'Portland vs Seattle' },
    { a: 'nashville', b: 'charlotte', label: 'Nashville vs Charlotte' },
    { a: 'minneapolis', b: 'milwaukee', label: 'Minneapolis vs Milwaukee' },
  ]

  const popularJobComparisons = [
    { a: 'nurse', b: 'teacher', label: 'Nurse vs Teacher' },
    { a: 'software-engineer', b: 'data-analyst', label: 'Software Engineer vs Data Analyst' },
    { a: 'doctor', b: 'dentist', label: 'Doctor vs Dentist' },
    { a: 'lawyer', b: 'accountant', label: 'Lawyer vs Accountant' },
    { a: 'electrician', b: 'plumber', label: 'Electrician vs Plumber' },
    { a: 'firefighter', b: 'police-officer', label: 'Firefighter vs Police Officer' },
    { a: 'physical-therapist', b: 'occupational-therapist', label: 'Physical Therapist vs Occupational Therapist' },
    { a: 'web-developer', b: 'ux-designer', label: 'Web Developer vs UX Designer' },
    { a: 'pilot', b: 'it-manager', label: 'Pilot vs IT Manager' },
    { a: 'real-estate-agent', b: 'financial-advisor', label: 'Real Estate Agent vs Financial Advisor' },
  ]

  return (
    <main style={{ background: '#0d1b2a', minHeight: '100vh', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Compare' }
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
          Compare Cities and Jobs
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 32px' }}>
          Side by side cost of living and salary comparisons using official BLS and C2ER data.
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
            San Francisco costs 2.25x more than the national average (COLI 225) while Memphis costs 21% less (COLI 79).
            A software engineer earns $168,320 in Washington vs $88,320 in Mississippi — a $80,000 gap for the same job.
            Use these comparisons to make smarter career and relocation decisions.
          </p>
        </div>

        <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: '0 0 16px' }}>
          Popular City Comparisons
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '12px',
          margin: '0 0 48px'
        }}>
          {popularCityComparisons.map(c => (
            <Link
              key={`${c.a}-vs-${c.b}`}
              href={`/compare/${c.a}-vs-${c.b}`}
              style={{
                background: '#1e2d4a',
                borderRadius: '8px',
                padding: '16px',
                color: '#ffffff',
                textDecoration: 'none',
                display: 'block',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              🏙️ {c.label}
            </Link>
          ))}
        </div>

        <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: '0 0 16px' }}>
          Popular Job Comparisons
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '12px',
          margin: '0 0 48px'
        }}>
          {popularJobComparisons.map(c => (
            <Link
              key={`${c.a}-vs-${c.b}`}
              href={`/compare/${c.a}-vs-${c.b}`}
              style={{
                background: '#1e2d4a',
                borderRadius: '8px',
                padding: '16px',
                color: '#ffffff',
                textDecoration: 'none',
                display: 'block',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              💼 {c.label}
            </Link>
          ))}
        </div>

        <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: '0 0 16px' }}>
          Browse All Cities
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '0 0 48px' }}>
          {cities.map(city => (
            <Link
              key={city.slug}
              href={`/compare/${city.slug}-vs-chicago`}
              style={{
                background: '#1e2d4a',
                borderRadius: '6px',
                padding: '8px 14px',
                color: '#a8a8b3',
                textDecoration: 'none',
                fontSize: '13px'
              }}
            >
              {city.name}
            </Link>
          ))}
        </div>

        <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: '0 0 16px' }}>
          Browse All Jobs
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '0 0 48px' }}>
          {SALARY_DATA.map(entry => (
            <Link
              key={entry.slug}
              href={`/compare/${entry.slug}-vs-nurse`}
              style={{
                background: '#1e2d4a',
                borderRadius: '6px',
                padding: '8px 14px',
                color: '#a8a8b3',
                textDecoration: 'none',
                fontSize: '13px'
              }}
            >
              {entry.job}
            </Link>
          ))}
        </div>

        <p style={{ color: '#a8a8b3', fontSize: '13px' }}>
          City data: C2ER Cost of Living Index 2024-2025 + Zillow + Census ACS.
          Salary data: BLS OES 2024-2025. Free — no signup required.
        </p>
      </div>
    </main>
  )
}
