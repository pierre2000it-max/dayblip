// Working days = Monday to Friday minus US federal holidays (5 U.S.C. 6103).
// A holiday that falls on a Saturday is observed the Friday before; on a Sunday, the Monday after.
// A holiday counts in the year of its OBSERVED date (Jan 1 2028 is a Saturday, observed Fri Dec 31 2027).

export interface Holiday {
  name: string
  actual: string   // ISO yyyy-mm-dd
  observed: string // ISO yyyy-mm-dd
}

const pad = (n: number) => String(n).padStart(2, "0")
const iso = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`
const dow = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d)).getUTCDay()
const daysIn = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate()

function nthWeekday(y: number, m: number, weekday: number, n: number): number {
  const first = dow(y, m, 1)
  return 1 + ((weekday - first + 7) % 7) + (n - 1) * 7
}
function lastWeekday(y: number, m: number, weekday: number): number {
  const last = daysIn(y, m)
  return last - ((dow(y, m, last) - weekday + 7) % 7)
}

function observedDate(y: number, m: number, d: number): string {
  const w = dow(y, m, d)
  if (w === 6) return shift(y, m, d, -1)
  if (w === 0) return shift(y, m, d, 1)
  return iso(y, m, d)
}
function shift(y: number, m: number, d: number, by: number): string {
  const t = new Date(Date.UTC(y, m - 1, d + by))
  return iso(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate())
}

function holidaysOf(y: number): Holiday[] {
  const fixed = (name: string, m: number, d: number): Holiday => ({ name, actual: iso(y, m, d), observed: observedDate(y, m, d) })
  const floating = (name: string, m: number, d: number): Holiday => ({ name, actual: iso(y, m, d), observed: iso(y, m, d) })
  return [
    fixed("New Year's Day", 1, 1),
    floating("Martin Luther King Jr. Day", 1, nthWeekday(y, 1, 1, 3)),
    floating("Presidents' Day", 2, nthWeekday(y, 2, 1, 3)),
    floating("Memorial Day", 5, lastWeekday(y, 5, 1)),
    fixed("Juneteenth", 6, 19),
    fixed("Independence Day", 7, 4),
    floating("Labor Day", 9, nthWeekday(y, 9, 1, 1)),
    floating("Columbus Day", 10, nthWeekday(y, 10, 1, 2)),
    fixed("Veterans Day", 11, 11),
    floating("Thanksgiving Day", 11, nthWeekday(y, 11, 4, 4)),
    fixed("Christmas Day", 12, 25),
  ]
}

/** Federal holidays whose observed date falls inside `year`, sorted by observed date. */
export function federalHolidays(year: number): Holiday[] {
  return [...holidaysOf(year), ...holidaysOf(year + 1)]
    .filter(h => h.observed.startsWith(`${year}-`))
    .sort((a, b) => a.observed.localeCompare(b.observed))
}

export function weekdaysInMonth(year: number, month: number): number {
  let n = 0
  for (let d = 1; d <= daysIn(year, month); d++) {
    const w = dow(year, month, d)
    if (w !== 0 && w !== 6) n++
  }
  return n
}

export function weekdaysInYear(year: number): number {
  let n = 0
  for (let m = 1; m <= 12; m++) n += weekdaysInMonth(year, m)
  return n
}

export function workingDaysInMonth(year: number, month: number): number {
  const prefix = `${year}-${pad(month)}-`
  return weekdaysInMonth(year, month) - federalHolidays(year).filter(h => h.observed.startsWith(prefix)).length
}

export function workingDaysInYear(year: number): number {
  return weekdaysInYear(year) - federalHolidays(year).length
}

export const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"]
