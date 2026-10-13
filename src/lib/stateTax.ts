// Single source of truth for 2026 state income tax estimates.
//
// Source: Tax Foundation, "State Individual Income Tax Rates and Brackets, 2026"
// (rates as of Jan 1 2026, single filer). Verified Oct 2026.
//
// Model (an estimate, not a tax return):
// - Brackets are single-filer. Married filing jointly doubles every threshold and
//   deduction (exact for most states, close for the rest). Head of household uses single.
// - Standard deductions and deduction-style personal exemptions are applied. Credit-style
//   exemptions are subtracted from tax. Phase-outs, local taxes and state disability or
//   family-leave payroll taxes are not modeled.
// - Washington taxes capital gains only, so wages are untaxed.
//
// Annual update: edit this file only, then run `npm test`.

import type { Filing } from "./tax2026"

export type StateBracket = readonly [start: number, rate: number]

export interface StateTaxInfo {
  code: string
  name: string
  /** Single-filer brackets: income above `start` is taxed at `rate`. First start is 0. */
  brackets: readonly StateBracket[]
  /** Standard deduction plus deduction-style personal exemption, single filer. */
  deduction: number
  /** Credit-style exemption subtracted from tax, single filer. */
  credit: number
}

const flat = (rate: number): readonly StateBracket[] => [[0, rate]]
const NONE: readonly StateBracket[] = [[0, 0]]

function s(
  code: string,
  name: string,
  brackets: readonly StateBracket[],
  deduction = 0,
  credit = 0,
): StateTaxInfo {
  return { code, name, brackets, deduction, credit }
}

export const STATE_TAX: readonly StateTaxInfo[] = [
  s("AL", "Alabama", [[0, 0.02], [500, 0.04], [3000, 0.05]], 3000 + 1500),
  s("AK", "Alaska", NONE),
  s("AZ", "Arizona", flat(0.025), 8350),
  s("AR", "Arkansas", [[0, 0.02], [4600, 0.039]], 2470, 29),
  s("CA", "California", [[0, 0.01], [11079, 0.02], [26264, 0.04], [41452, 0.06], [57542, 0.08], [72724, 0.093], [371479, 0.103], [445771, 0.113], [742953, 0.123], [1000000, 0.133]], 5540, 153),
  s("CO", "Colorado", flat(0.044), 16100),
  s("CT", "Connecticut", [[0, 0.02], [10000, 0.045], [50000, 0.055], [100000, 0.06], [200000, 0.065], [250000, 0.069], [500000, 0.0699]]),
  s("DE", "Delaware", [[0, 0], [2000, 0.022], [5000, 0.039], [10000, 0.048], [20000, 0.052], [25000, 0.0555], [60000, 0.066]], 3250, 110),
  s("FL", "Florida", NONE),
  s("GA", "Georgia", flat(0.0519), 12000),
  s("HI", "Hawaii", [[0, 0.014], [9600, 0.032], [14400, 0.055], [19200, 0.064], [24000, 0.068], [36000, 0.072], [48000, 0.076], [125000, 0.079], [175000, 0.0825], [225000, 0.09], [275000, 0.10], [325000, 0.11]], 4400 + 1144),
  s("ID", "Idaho", flat(0.053), 16100),
  s("IL", "Illinois", flat(0.0495), 2925),
  s("IN", "Indiana", flat(0.0295), 1000),
  s("IA", "Iowa", flat(0.038), 16100, 40),
  s("KS", "Kansas", [[0, 0.052], [23000, 0.0558]], 3605 + 9160),
  s("KY", "Kentucky", flat(0.035), 3360),
  s("LA", "Louisiana", flat(0.03), 12875),
  s("ME", "Maine", [[0, 0.058], [27399, 0.0675], [64849, 0.0715]], 8350 + 5300),
  s("MD", "Maryland", [[0, 0.02], [1000, 0.03], [2000, 0.04], [3000, 0.0475], [100000, 0.05], [125000, 0.0525], [150000, 0.055], [250000, 0.0575], [500000, 0.0625], [1000000, 0.065]], 3350 + 3200),
  s("MA", "Massachusetts", [[0, 0.05], [1083150, 0.09]], 4400),
  s("MI", "Michigan", flat(0.0425), 5900),
  s("MN", "Minnesota", [[0, 0.0535], [33310, 0.068], [109430, 0.0785], [203150, 0.0985]], 15300),
  s("MS", "Mississippi", flat(0.04), 2300 + 6000),
  s("MO", "Missouri", [[0, 0], [1348, 0.02], [2696, 0.025], [4044, 0.03], [5392, 0.035], [6740, 0.04], [8088, 0.045], [9436, 0.047]], 16100),
  s("MT", "Montana", [[0, 0.047], [47500, 0.0565]], 16100),
  s("NE", "Nebraska", [[0, 0.0246], [4130, 0.0351], [24760, 0.0455]], 8850, 176),
  s("NV", "Nevada", NONE),
  s("NH", "New Hampshire", NONE),
  s("NJ", "New Jersey", [[0, 0.014], [20000, 0.0175], [35000, 0.035], [40000, 0.0553], [75000, 0.0637], [500000, 0.0897], [1000000, 0.1075]], 1000),
  s("NM", "New Mexico", [[0, 0.015], [5500, 0.032], [16500, 0.043], [33500, 0.047], [66500, 0.049], [210000, 0.059]], 16100),
  s("NY", "New York", [[0, 0.039], [8500, 0.044], [11700, 0.0515], [13900, 0.054], [80650, 0.059], [215400, 0.0685], [1077550, 0.0965], [5000000, 0.103], [25000000, 0.109]], 8000),
  s("NC", "North Carolina", flat(0.0399), 12750),
  s("ND", "North Dakota", [[0, 0], [48475, 0.0195], [244825, 0.025]], 16100),
  s("OH", "Ohio", flat(0.0275), 2400),
  s("OK", "Oklahoma", [[0, 0], [3750, 0.025], [4900, 0.035], [7200, 0.045]], 6350 + 1000),
  s("OR", "Oregon", [[0, 0.0475], [4550, 0.0675], [11400, 0.0875], [125000, 0.099]], 2910, 256),
  s("PA", "Pennsylvania", flat(0.0307)),
  s("RI", "Rhode Island", [[0, 0.0375], [82050, 0.0475], [186450, 0.0599]], 11200 + 5250),
  s("SC", "South Carolina", [[0, 0], [3640, 0.03], [18230, 0.06]], 8350),
  s("SD", "South Dakota", NONE),
  s("TN", "Tennessee", NONE),
  s("TX", "Texas", NONE),
  s("UT", "Utah", flat(0.045)),
  s("VT", "Vermont", [[0, 0.0335], [49400, 0.066], [119700, 0.076], [249700, 0.0875]], 7650 + 5300),
  s("VA", "Virginia", [[0, 0.02], [3000, 0.03], [5000, 0.05], [17000, 0.0575]], 8750 + 930),
  s("WA", "Washington", NONE),
  s("WV", "West Virginia", [[0, 0.0222], [10000, 0.0296], [25000, 0.0333], [40000, 0.0444], [60000, 0.0482]], 2000),
  s("WI", "Wisconsin", [[0, 0.035], [15110, 0.044], [51950, 0.053], [332720, 0.0765]], 13960 + 700),
  s("WY", "Wyoming", NONE),
]

const BY_CODE: Record<string, StateTaxInfo> = Object.fromEntries(STATE_TAX.map((st) => [st.code, st]))

export function getState(code: string): StateTaxInfo | undefined {
  return BY_CODE[code]
}

/**
 * Estimated state income tax on wages.
 * @param income wages after pre-tax deductions (401k, health insurance), before the federal standard deduction
 */
export function stateIncomeTax(code: string, income: number, filing: Filing = "single"): number {
  const info = BY_CODE[code]
  if (!info || income <= 0) return 0
  const scale = filing === "mfj" ? 2 : 1
  const taxable = Math.max(0, income - info.deduction * scale)
  let tax = 0
  const b = info.brackets
  for (let i = 0; i < b.length; i++) {
    const lo = b[i][0] * scale
    const hi = i + 1 < b.length ? b[i + 1][0] * scale : Infinity
    if (taxable > lo) tax += (Math.min(taxable, hi) - lo) * b[i][1]
  }
  return Math.max(0, tax - info.credit * scale)
}

/** Top marginal rate, for display. */
export function stateTopRate(code: string): number {
  const info = BY_CODE[code]
  return info ? info.brackets[info.brackets.length - 1][1] : 0
}

/** Rate applied to the next dollar of income, for marginal-rate displays. */
export function stateMarginalRate(code: string, income: number, filing: Filing = "single"): number {
  const info = BY_CODE[code]
  if (!info) return 0
  const scale = filing === "mfj" ? 2 : 1
  const taxable = Math.max(0, income - info.deduction * scale)
  let rate = 0
  for (const [start, r] of info.brackets) if (taxable > start * scale) rate = r
  return rate
}

/** Display label for a state picker: "California", or "Texas (no income tax)". */
export function stateLabel(st: StateTaxInfo): string {
  return st.brackets.length === 1 && st.brackets[0][1] === 0 ? `${st.name} (no income tax)` : st.name
}
