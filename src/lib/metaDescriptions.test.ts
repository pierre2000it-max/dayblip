import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fitsMeta } from './metaFit'
import { SALARY_DATA, getAllSalarySlugs, getSalaryBySlug } from '@/data/salary-data'
import { cities } from '@/data/cost-of-living'
import { DATASETS } from '@/data/datasets'
import { BORN_IN_DESCRIPTIONS } from '@/data/bornInDescriptions'
import seoPages from '@/data/seo-pages.json'
import {
  salaryDescription, cityPairDescription, jobPairDescription, marketDescription,
  timeMachineDescription, onThisDayDescription, countdownDescription, holidayFallbackDescription,
} from './metaDescriptions'

type MarketRow = { zip: string; state_name: string; category_display: string; band_low: number; band_high: number }

const bad = (arr: string[]) => arr.filter((s) => !fitsMeta(s))

function walk(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/(layout|page)\.tsx$/.test(f)) out.push(p)
  }
  return out
}

describe('static metadata descriptions', () => {
  const found: { file: string; text: string }[] = []
  for (const file of walk('src/app')) {
    const src = readFileSync(file, 'utf8')
    const i = src.indexOf('export const metadata')
    if (i === -1) continue
    const rest = src.slice(i)
    const j = rest.indexOf('description:')
    if (j === -1) continue
    const m = /^description:\s*(["'`])((?:\\.|(?!\1)[^\\])*)\1/.exec(rest.slice(j))
    if (!m || (m[1] === '`' && m[2].includes('${'))) continue
    found.push({ file, text: m[2] })
  }
  it('finds a meaningful number of pages', () => expect(found.length).toBeGreaterThan(100))
  it('all fit 120-155 chars and end with . ? or !', () => {
    expect(found.filter((f) => !fitsMeta(f.text)).map((f) => `${f.file}: ${f.text.length}`)).toEqual([])
  })
  it('are unique', () => {
    const seen = new Map<string, string>()
    const dupes: string[] = []
    for (const f of found) {
      const other = seen.get(f.text)
      if (other && dirname(other) !== dirname(f.file)) dupes.push(`${f.file} = ${other}`)
      seen.set(f.text, f.file)
    }
    expect(dupes).toEqual([])
  })
})

describe('dynamic metadata descriptions', () => {
  it('salary pages', () => {
    const all = getAllSalarySlugs().map((s) => { const { entry, state, stateSalary } = getSalaryBySlug(s)!; return salaryDescription(entry.job, state.name, '$' + stateSalary.toLocaleString(), entry.national) })
    expect(bad(all)).toEqual([])
    expect(new Set(all).size).toBe(all.length)
  })
  it('compare pages', () => {
    const c: string[] = [], j: string[] = []
    for (const a of cities) for (const b of cities) if (a.slug < b.slug) c.push(cityPairDescription(a.name, a.coliIndex, b.name, b.coliIndex))
    for (const a of SALARY_DATA) for (const b of SALARY_DATA) if (a.slug < b.slug) j.push(jobPairDescription(a.job, a.national, b.job, b.national))
    expect(bad(c)).toEqual([]); expect(bad(j)).toEqual([])
    expect(new Set(c).size).toBe(c.length); expect(new Set(j).size).toBe(j.length)
  })
  it('market pages', () => {
    const all = (seoPages as MarketRow[]).map((p) => marketDescription(p.zip, p.state_name, p.category_display, p.band_low, p.band_high))
    expect(bad(all)).toEqual([]); expect(new Set(all).size).toBe(all.length)
  })
  it('born-in pages', () => {
    const all = Object.values(BORN_IN_DESCRIPTIONS)
    expect(all.length).toBeGreaterThanOrEqual(51)
    expect(bad(all)).toEqual([]); expect(new Set(all).size).toBe(all.length)
  })
  it('datasets', () => expect(bad(DATASETS.map((d) => d.metaDescription))).toEqual([]))
  it('time machine and on-this-day, longest and shortest labels', () => {
    const labels = ['May 1, 1900', 'September 30, 2026', 'December 31, 1999', 'February 29, 2024']
    expect(bad(labels.map(timeMachineDescription))).toEqual([])
    expect(bad(['May 1st', 'September 30th', 'December 31st', 'February 29th'].map(onThisDayDescription))).toEqual([])
  })
  it('countdown with short and very long event names', () => {
    const names = ['X', 'Mom Birthday', 'Pierre and Jane Wedding Anniversary Celebration Weekend Getaway Trip 2027 Edition']
    expect(bad(names.map((n) => countdownDescription(n, '2027-01-01')))).toEqual([])
  })
  it('holiday fallback', () => {
    expect(bad(["New Year's Day", 'Independence Day', 'Mother Day', 'Cinco de Mayo'].map((n) => holidayFallbackDescription(n, 2026)))).toEqual([])
  })
})
