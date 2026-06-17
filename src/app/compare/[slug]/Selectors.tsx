'use client'

import { useRouter } from 'next/navigation'
import { cities } from '@/data/cost-of-living'
import { SALARY_DATA } from '@/data/salary-data'

const selectStyle: React.CSSProperties = {
  background: '#1e2d4a',
  color: '#ffffff',
  border: '1px solid #2a3f5f',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
  flex: 1,
  minWidth: '180px',
}

export function CitySelector({ currentA, currentB }: { currentA: string; currentB: string }) {
  const router = useRouter()

  function handleChange(side: 'a' | 'b', newSlug: string) {
    if (!newSlug) return
    const a = side === 'a' ? newSlug : currentA
    const b = side === 'b' ? newSlug : currentB
    if (a === b) return
    router.push(`/compare/${a}-vs-${b}`)
  }

  const sorted = [...cities].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div style={{ margin: '24px 0 32px' }}>
      <p style={{ color: '#a8a8b3', fontSize: '13px', marginBottom: '10px' }}>
        Compare a different city:
      </p>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={currentA} onChange={e => handleChange('a', e.target.value)} style={selectStyle}>
          {sorted.map(c => (
            <option key={c.slug} value={c.slug}>{c.name}, {c.state}</option>
          ))}
        </select>
        <span style={{ color: '#a8a8b3', fontWeight: '700', fontSize: '14px' }}>VS</span>
        <select value={currentB} onChange={e => handleChange('b', e.target.value)} style={selectStyle}>
          {sorted.map(c => (
            <option key={c.slug} value={c.slug}>{c.name}, {c.state}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export function JobSelector({ currentA, currentB }: { currentA: string; currentB: string }) {
  const router = useRouter()

  function handleChange(side: 'a' | 'b', newSlug: string) {
    if (!newSlug) return
    const a = side === 'a' ? newSlug : currentA
    const b = side === 'b' ? newSlug : currentB
    if (a === b) return
    router.push(`/compare/${a}-vs-${b}`)
  }

  const sorted = [...SALARY_DATA].sort((a, b) => a.job.localeCompare(b.job))

  return (
    <div style={{ margin: '24px 0 32px' }}>
      <p style={{ color: '#a8a8b3', fontSize: '13px', marginBottom: '10px' }}>
        Compare a different job:
      </p>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={currentA} onChange={e => handleChange('a', e.target.value)} style={selectStyle}>
          {sorted.map(j => (
            <option key={j.slug} value={j.slug}>{j.job}</option>
          ))}
        </select>
        <span style={{ color: '#a8a8b3', fontWeight: '700', fontSize: '14px' }}>VS</span>
        <select value={currentB} onChange={e => handleChange('b', e.target.value)} style={selectStyle}>
          {sorted.map(j => (
            <option key={j.slug} value={j.slug}>{j.job}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
