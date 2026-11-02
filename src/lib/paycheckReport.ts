/**
 * Single source of truth for the 2026 American Paycheck Report
 * (/research/paycheck-report-2026) and the blog article
 * /blog/paycheck-by-state-2026.
 *
 * Every dollar figure on those pages is derived here from tax2026.ts and
 * stateTax.ts, so the pages can never drift from the calculators. Change the
 * benchmark or the tax tables and both pages, their metadata, and their
 * share text update together. paycheckReport.test.ts pins the invariants.
 */

import {
  BRACKETS,
  STANDARD_DEDUCTION,
  SS_RATE,
  MEDICARE_RATE,
  TAX_YEAR,
  federalTax,
  taxableAfterStandardDeduction,
  socialSecurityTax,
  medicareTax,
  type Filing,
} from "./tax2026"
import { STATE_TAX, stateIncomeTax, getState, type StateTaxInfo } from "./stateTax"

export const BENCHMARK_SALARY = 75000
export const FILING: Filing = "single"
export const REPORT_YEAR = TAX_YEAR
export const GROWTH_RATE = 0.07
export const CAREER_YEARS = 30

// ── Federal layer (identical in every state) ─────────────────────────────────

export const STANDARD_DED = STANDARD_DEDUCTION[FILING]
export const TAXABLE_INCOME = taxableAfterStandardDeduction(BENCHMARK_SALARY, FILING)
export const FEDERAL_INCOME_TAX = Math.round(federalTax(TAXABLE_INCOME, FILING))
export const SOCIAL_SECURITY_TAX = Math.round(socialSecurityTax(BENCHMARK_SALARY))
export const MEDICARE_TAX = Math.round(medicareTax(BENCHMARK_SALARY))
export const FICA_TAX = Math.round(socialSecurityTax(BENCHMARK_SALARY) + medicareTax(BENCHMARK_SALARY))
export const FEDERAL_TOTAL = FEDERAL_INCOME_TAX + FICA_TAX
/** Take-home in a state with no income tax. */
export const AFTER_FEDERAL = BENCHMARK_SALARY - FEDERAL_TOTAL

export interface FederalBracketRow {
  lo: number
  hi: number
  rate: number
  income: number
  tax: number
}

/** Federal brackets the benchmark salary passes through, with tax owed in each. */
export const FEDERAL_BRACKET_ROWS: FederalBracketRow[] = (() => {
  const rows: FederalBracketRow[] = []
  let prev = 0
  for (const [limit, rate] of BRACKETS[FILING]) {
    if (TAXABLE_INCOME <= prev) break
    const hi = Math.min(TAXABLE_INCOME, limit)
    const income = hi - prev
    rows.push({ lo: prev, hi, rate, income, tax: Math.round(income * rate) })
    prev = limit
  }
  return rows
})()

/** Highest federal bracket the benchmark reaches, e.g. 0.22. */
export const TOP_FEDERAL_RATE = FEDERAL_BRACKET_ROWS[FEDERAL_BRACKET_ROWS.length - 1].rate
/** Dollars of taxable income that land in that top bracket. */
export const INCOME_IN_TOP_FEDERAL_BRACKET = FEDERAL_BRACKET_ROWS[FEDERAL_BRACKET_ROWS.length - 1].income

// ── State layer ──────────────────────────────────────────────────────────────

export interface StateRow {
  code: string
  name: string
  stateTax: number
  takeHome: number
  /** Total effective rate (federal + FICA + state), percent, 1 decimal. */
  effective: number
  noIncomeTax: boolean
}

/** All 50 states, sorted highest to lowest take-home (ties alphabetical). */
export const STATE_ROWS: StateRow[] = STATE_TAX.map((s) => {
  const stateTax = Math.round(stateIncomeTax(s.code, BENCHMARK_SALARY, FILING))
  const takeHome = BENCHMARK_SALARY - FEDERAL_TOTAL - stateTax
  return {
    code: s.code,
    name: s.name,
    stateTax,
    takeHome,
    effective: Math.round(((BENCHMARK_SALARY - takeHome) / BENCHMARK_SALARY) * 1000) / 10,
    noIncomeTax: stateTax === 0,
  }
}).sort((a, b) => b.takeHome - a.takeHome || a.name.localeCompare(b.name))

export const NO_TAX_STATES = STATE_ROWS.filter((r) => r.noIncomeTax)
export const TAXED_STATES = STATE_ROWS.filter((r) => !r.noIncomeTax)

export const HIGHEST = STATE_ROWS[0]
export const LOWEST = STATE_ROWS[STATE_ROWS.length - 1]
/** Worst 5 states for this salary, worst first. */
export const BOTTOM_FIVE = STATE_ROWS.slice(-5).reverse()
/** Codes of the 2 lowest take-home states, for row highlighting. */
export const HIGHLIGHT_LOW = new Set(STATE_ROWS.slice(-2).map((r) => r.code))

export const ANNUAL_GAP = HIGHEST.takeHome - LOWEST.takeHome
export const MONTHLY_GAP = Math.round(ANNUAL_GAP / 12)
export const LOWEST_EFFECTIVE = HIGHEST.effective
export const HIGHEST_EFFECTIVE = LOWEST.effective

/** Future value of investing the annual gap every year at GROWTH_RATE. */
export function gapCompounded(years: number): number {
  return ANNUAL_GAP * ((Math.pow(1 + GROWTH_RATE, years) - 1) / GROWTH_RATE)
}
/** Annuity factor used in the formula line, e.g. 94.46 for 30 years at 7%. */
export const ANNUITY_FACTOR_30 = (Math.pow(1 + GROWTH_RATE, CAREER_YEARS) - 1) / GROWTH_RATE
export const GAP_30_YEARS = gapCompounded(CAREER_YEARS)

/** The middle of the pack: every taxed state except the 2 lowest. */
export const MIDDLE_STATES = TAXED_STATES.filter((r) => !HIGHLIGHT_LOW.has(r.code))
export const MIDDLE_MIN = MIDDLE_STATES[MIDDLE_STATES.length - 1].takeHome
export const MIDDLE_MAX = MIDDLE_STATES[0].takeHome
export const MIDDLE_BAND = MIDDLE_MAX - MIDDLE_MIN

// ── Per-state facts used in prose ────────────────────────────────────────────

export interface StateFacts {
  code: string
  name: string
  deduction: number
  /** Rate applied to the benchmark earner's last dollar. */
  marginalRate: number
  /** Taxable-income threshold where that marginal bracket begins. */
  marginalStart: number
  topRate: number
  /** Taxable-income threshold where the top bracket begins. */
  topStart: number
  /** Start of the first bracket above the benchmark earner's marginal bracket, or null. */
  nextBracketStart: number | null
  nextBracketRate: number | null
}

export function stateFacts(code: string): StateFacts {
  const info = getState(code) as StateTaxInfo
  const taxable = Math.max(0, BENCHMARK_SALARY - info.deduction)
  let idx = 0
  for (let i = 0; i < info.brackets.length; i++) if (taxable > info.brackets[i][0]) idx = i
  const [marginalStart, marginalRate] = info.brackets[idx]
  const [topStart, topRate] = info.brackets[info.brackets.length - 1]
  const next = info.brackets[idx + 1]
  return {
    code,
    name: info.name,
    deduction: info.deduction,
    marginalRate,
    marginalStart,
    topRate,
    topStart,
    nextBracketStart: next ? next[0] : null,
    nextBracketRate: next ? next[1] : null,
  }
}

export function stateRow(code: string): StateRow {
  return STATE_ROWS.find((r) => r.code === code) as StateRow
}

// ── Formatting ───────────────────────────────────────────────────────────────

export const usd = (n: number): string => "$" + Math.round(n).toLocaleString("en-US")
export const usdK = (n: number): string => "$" + Math.round(n / 1000) + "K"
export const pct = (rate: number, decimals = 0): string => (rate * 100).toFixed(decimals).replace(/\.0+$/, "") + "%"
export const approxThousands = (n: number): string => "$" + (Math.round(n / 1000) * 1000).toLocaleString("en-US")

export const SS_RATE_LABEL = pct(SS_RATE, 1)
export const MEDICARE_RATE_LABEL = pct(MEDICARE_RATE, 2)

export function listNames(rows: StateRow[]): string {
  const names = rows.map((r) => r.name)
  if (names.length <= 1) return names.join("")
  return names.slice(0, -1).join(", ") + ", and " + names[names.length - 1]
}

// ── Shared copy used in metadata on both pages ───────────────────────────────

/** The no-tax state named in headlines and share text. */
export const EXAMPLE_NO_TAX = stateRow("TX")

export const HEADLINE_SENTENCE = `A ${usd(BENCHMARK_SALARY)} salary takes home ${usd(AFTER_FEDERAL)} in ${EXAMPLE_NO_TAX.name} and ${usd(LOWEST.takeHome)} in ${LOWEST.name}.`

/** Meta descriptions for the 2 pages. paycheckReport.test.ts keeps them at 120-155 chars. */
export const REPORT_META_DESCRIPTION = `${HEADLINE_SENTENCE} Full 50-state ${REPORT_YEAR} take-home pay breakdown using IRS and Tax Foundation data.`
export const BLOG_META_DESCRIPTION = `${HEADLINE_SENTENCE} Full 50-state ${REPORT_YEAR} take-home breakdown with IRS and Tax Foundation sources. No signup.`
export const BLOG_OG_DESCRIPTION = `The same ${usd(BENCHMARK_SALARY)} salary takes home ${usd(ANNUAL_GAP)} more per year in ${EXAMPLE_NO_TAX.name} than ${LOWEST.name}. Here is what state income tax actually costs you.`
export const BLOG_CARD_DESCRIPTION = `${HEADLINE_SENTENCE.replace(/\.$/, "")}, a ${usd(ANNUAL_GAP)} annual gap driven entirely by state income tax. Full 50-state breakdown with IRS and Tax Foundation sources.`
