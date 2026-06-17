import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import AuthorByline from '@/components/AuthorByline'
import { SALARY_DATA, STATES, getStateSlug } from '@/data/salary-data'

export default function SalaryHubPage() {
  return (
    <main style={{ background: '#0d1b2a', minHeight: '100vh', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Salary Data' }
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '36px', fontWeight: '800', margin: '0 0 12px 0', lineHeight: 1.2 }}>
          Average Salary by Job and State 2024
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '18px', margin: '0 0 24px 0' }}>
          BLS OES May 2024 data — 20 occupations across all 50 US states
        </p>

        <div style={{ background: '#1e2d4a', borderLeft: '4px solid #e94560', borderRadius: '8px', padding: '20px 24px', margin: '0 0 28px 0' }}>
          <p style={{ color: '#ffffff', fontSize: '16px', margin: 0, lineHeight: 1.6 }}>
            <strong style={{ color: '#e94560' }}>Quick answer:</strong> The average salary in the US varies widely by occupation and state. A registered nurse earns $89,010 nationally but $131,470 in California. A teacher earns $63,680 nationally but $89,240 in New York. Use the pages below to find exact figures for your job and state.
          </p>
        </div>

        <AuthorByline variant="tool" />

        <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: '40px 0 16px 0' }}>
          Browse by Occupation
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '48px' }}>
          {SALARY_DATA.map((entry) => (
            <Link
              key={entry.slug}
              href={`/salary/${entry.slug}-in-california`}
              style={{
                display: 'block',
                background: '#1e2d4a',
                border: '1px solid #2a3a5c',
                borderRadius: '8px',
                padding: '16px',
                textDecoration: 'none',
                transition: 'border-color 0.2s'
              }}
            >
              <div style={{ color: '#ffffff', fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>{entry.job}</div>
              <div style={{ color: '#a8a8b3', fontSize: '13px' }}>${entry.national.toLocaleString()}/yr national</div>
            </Link>
          ))}
        </div>

        <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: '0 0 16px 0' }}>
          Browse by State (Nurse Salary)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px', marginBottom: '48px' }}>
          {STATES.map((state) => {
            const stateSlug = getStateSlug(state.name)
            return (
              <Link
                key={state.abbreviation}
                href={`/salary/nurse-in-${stateSlug}`}
                style={{
                  display: 'block',
                  background: '#1e2d4a',
                  border: '1px solid #2a3a5c',
                  borderRadius: '6px',
                  padding: '12px',
                  textDecoration: 'none'
                }}
              >
                <div style={{ color: '#ffffff', fontWeight: '600', fontSize: '14px' }}>{state.name}</div>
                <div style={{ color: '#a8a8b3', fontSize: '12px' }}>Nurse salary</div>
              </Link>
            )
          })}
        </div>

        <p style={{ color: '#6b7280', fontSize: '13px', borderTop: '1px solid #2a3a5c', paddingTop: '20px' }}>
          Source: U.S. Bureau of Labor Statistics, Occupational Employment and Wage Statistics (OES), May 2024. Data represents mean annual wages. Individual salaries vary based on experience, education, employer, and local market conditions.
        </p>
      </div>
    </main>
  )
}
