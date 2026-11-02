/**
 * Single source of truth for the 2 "finite time" research reports:
 *   /research/how-many-mondays-left
 *   /research/weekends-you-have-left
 *
 * Every figure on those pages (tables, prose, metadata, share text) is derived
 * from the constants and functions here. finiteTime.test.ts pins the math.
 *
 * Annual update: BLS_MEDIAN_WEEKLY_EARNINGS and BLS_EARNINGS_PERIOD each
 * quarter from bls.gov/news.release/wkyeng.t01.htm; CDC_LIFE_EXPECTANCY and
 * CDC_LIFE_EXPECTANCY_YEAR when NCHS publishes the next "Mortality in the
 * United States" data brief.
 */

// ── Shared data points ───────────────────────────────────────────────────────

/** BLS median usual weekly earnings, full-time wage and salary workers. */
export const BLS_MEDIAN_WEEKLY_EARNINGS = 1251
export const BLS_EARNINGS_PERIOD = "Q2 2026"

/** NCHS/CDC US life expectancy at birth, both sexes, in years. */
export const CDC_LIFE_EXPECTANCY = 78.4
export const CDC_LIFE_EXPECTANCY_YEAR = 2023

// ── Career Mondays ───────────────────────────────────────────────────────────

export const RETIREMENT_AGE = 65
export const WORK_WEEKS_PER_YEAR = 50
export const MONDAY_TABLE_AGES = [22, 25, 30, 35, 40, 45, 50, 55, 60, 62, 64] as const
/** Example raise used in the per-Monday section. */
export const EXAMPLE_RAISE = 5000
/** Early-retirement example used in the buyback section. */
export const EARLY_RETIREMENT_AGE = 55

export function yearsToRetirement(age: number): number {
  return Math.max(0, RETIREMENT_AGE - age)
}
export function mondaysLeft(age: number): number {
  return yearsToRetirement(age) * WORK_WEEKS_PER_YEAR
}
/** Gross earnings remaining in a career at median wages. */
export function careerValue(age: number): number {
  return mondaysLeft(age) * BLS_MEDIAN_WEEKLY_EARNINGS
}
/** What an annual raise adds to each remaining work week. */
export const RAISE_PER_WEEK = EXAMPLE_RAISE / WORK_WEEKS_PER_YEAR
/** Total a raise pays out over the rest of a career starting at `age`. */
export function raiseLifetimeValue(age: number): number {
  return EXAMPLE_RAISE * yearsToRetirement(age)
}

export interface MondayRow {
  age: number
  mondays: number
  years: number
  valuePerMonday: number
  totalValue: number
}
export const MONDAY_ROWS: MondayRow[] = MONDAY_TABLE_AGES.map((age) => ({
  age,
  mondays: mondaysLeft(age),
  years: yearsToRetirement(age),
  valuePerMonday: BLS_MEDIAN_WEEKLY_EARNINGS,
  totalValue: careerValue(age),
}))

// ── Weekends ─────────────────────────────────────────────────────────────────

/** Planning horizon the report assumes, above the CDC average on purpose. */
export const PLANNING_AGE = 80
export const WEEKENDS_PER_YEAR = 52
/** Free, unscheduled hours in a typical weekend. An estimate, labeled as such on the page. */
export const FREE_HOURS_PER_WEEKEND = 11
export const FREE_HOURS_RANGE: readonly [number, number] = [8, 14]
export const WEEKEND_TABLE_AGES = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75] as const
/** Retirement weekend-spending example. */
export const RETIRE_AT = 65
export const LIVE_TO = 85
export const WEEKEND_SPEND = 200

export function yearsRemaining(age: number): number {
  return Math.max(0, PLANNING_AGE - age)
}
export function weekendsLeft(age: number): number {
  return yearsRemaining(age) * WEEKENDS_PER_YEAR
}
export function freeHoursLeft(age: number): number {
  return weekendsLeft(age) * FREE_HOURS_PER_WEEKEND
}
export const RETIREMENT_WEEKENDS = (LIVE_TO - RETIRE_AT) * WEEKENDS_PER_YEAR
export const RETIREMENT_WEEKEND_SPEND = RETIREMENT_WEEKENDS * WEEKEND_SPEND

export interface WeekendRow {
  age: number
  weekends: number
  years: number
  freeHours: number
  totalFreeHours: number
}
export const WEEKEND_ROWS: WeekendRow[] = WEEKEND_TABLE_AGES.map((age) => ({
  age,
  weekends: weekendsLeft(age),
  years: yearsRemaining(age),
  freeHours: FREE_HOURS_PER_WEEKEND,
  totalFreeHours: freeHoursLeft(age),
}))

// ── Formatting ───────────────────────────────────────────────────────────────

export const n = (v: number): string => Math.round(v).toLocaleString("en-US")
export const usd = (v: number): string => "$" + n(v)
export const usdM = (v: number): string => "$" + (v / 1_000_000).toFixed(2) + " million"

// ── Metadata (finiteTime.test.ts keeps descriptions at 120-155 chars) ────────

export const MONDAYS_META_DESCRIPTION = `At 35 you have about ${n(mondaysLeft(35))} Mondays left before retirement at ${RETIREMENT_AGE}. At 45 you have ${n(mondaysLeft(45))}. See the data behind the number and your own count.`
export const MONDAYS_OG_DESCRIPTION = `At 35 you have roughly ${n(mondaysLeft(35))} Mondays left before retirement at ${RETIREMENT_AGE}. At 45 you have ${n(mondaysLeft(45))}. The data behind the number that reframes every work week.`
export const MONDAYS_SHARE_TEXT = `How many Mondays do you have left in your career? At 35 you have roughly ${n(mondaysLeft(35))}. The data: www.dayblip.com/research/how-many-mondays-left`

export const WEEKENDS_META_DESCRIPTION = `At 40 you have about ${n(weekendsLeft(40))} weekends left if you live to ${PLANNING_AGE}. At 50 you have ${n(weekendsLeft(50))}. See the data behind the number and your own count.`
export const WEEKENDS_OG_DESCRIPTION = `At 40 you have roughly ${n(weekendsLeft(40))} weekends left if you live to ${PLANNING_AGE}. At 50 you have ${n(weekendsLeft(50))}. The data behind the number that changes Saturday morning.`
export const WEEKENDS_SHARE_TEXT = `How many weekends do you have left? At 40 you have roughly ${n(weekendsLeft(40))}. The data: www.dayblip.com/research/weekends-you-have-left`
