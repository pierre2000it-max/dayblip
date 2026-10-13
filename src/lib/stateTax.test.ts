import { describe, it, expect } from 'vitest'
import { STATE_TAX, getState, stateIncomeTax, stateMarginalRate, stateTopRate } from './stateTax'

// Top marginal rates, tax year 2026, Tax Foundation (as of Jan 1 2026).
const TOP: Record<string, number> = {
  AL: 0.05, AZ: 0.025, AR: 0.039, CA: 0.133, CO: 0.044, CT: 0.0699, DE: 0.066, GA: 0.0519, HI: 0.11,
  ID: 0.053, IL: 0.0495, IN: 0.0295, IA: 0.038, KS: 0.0558, KY: 0.035, LA: 0.03, ME: 0.0715, MD: 0.065,
  MA: 0.09, MI: 0.0425, MN: 0.0985, MS: 0.04, MO: 0.047, MT: 0.0565, NE: 0.0455, NJ: 0.1075, NM: 0.059,
  NY: 0.109, NC: 0.0399, ND: 0.025, OH: 0.0275, OK: 0.045, OR: 0.099, PA: 0.0307, RI: 0.0599,
  SC: 0.06, UT: 0.045, VT: 0.0875, VA: 0.0575, WV: 0.0482, WI: 0.0765,
}
const NO_TAX = ['AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY']

describe('state tax table', () => {
  it('covers all 50 states once', () => {
    expect(STATE_TAX).toHaveLength(50)
    expect(new Set(STATE_TAX.map((s) => s.code)).size).toBe(50)
  })
  it('top rates match Tax Foundation 2026', () => {
    for (const [code, rate] of Object.entries(TOP)) expect(stateTopRate(code), code).toBeCloseTo(rate, 6)
  })
  it('the 9 states with no wage tax owe nothing', () => {
    for (const code of NO_TAX) expect(stateIncomeTax(code, 500000), code).toBe(0)
  })
  it('brackets start at 0, ascend, and rates never fall', () => {
    for (const s of STATE_TAX) {
      expect(s.brackets[0][0], s.code).toBe(0)
      for (let i = 1; i < s.brackets.length; i++) {
        expect(s.brackets[i][0], s.code).toBeGreaterThan(s.brackets[i - 1][0])
        expect(s.brackets[i][1], s.code).toBeGreaterThanOrEqual(s.brackets[i - 1][1])
      }
    }
  })
})

describe('stateIncomeTax', () => {
  it('California, $65,000 single: 2,140.85 bracket tax less the 153 credit', () => {
    expect(stateIncomeTax('CA', 65000)).toBeCloseTo(1987.85, 2)
  })
  it('New York, $65,000 single', () => expect(stateIncomeTax('NY', 65000)).toBeCloseTo(2913, 2))
  it('Minnesota, $65,000 single', () => expect(stateIncomeTax('MN', 65000)).toBeCloseTo(2896.6, 1))
  it('North Carolina flat 3.99% after the 12,750 deduction', () => {
    expect(stateIncomeTax('NC', 65000)).toBeCloseTo(2084.775, 2)
  })
  it('Wisconsin is graduated, not a flat 7.65%', () => {
    const tax = stateIncomeTax('WI', 100000)
    expect(tax).toBeCloseTo(3919.48, 2)
    expect(tax).toBeLessThan(100000 * 0.0765 * 0.6)
  })
  it('married filing jointly doubles thresholds and deductions', () => {
    expect(stateIncomeTax('NC', 130000, 'mfj')).toBeCloseTo(2 * stateIncomeTax('NC', 65000), 6)
    expect(stateIncomeTax('CA', 130000, 'mfj')).toBeCloseTo(2 * stateIncomeTax('CA', 65000), 6)
  })
  it('never negative and zero for zero income', () => {
    expect(stateIncomeTax('CA', 0)).toBe(0)
    expect(stateIncomeTax('CA', 3000)).toBe(0)
    expect(stateIncomeTax('ZZ', 50000)).toBe(0)
  })
  it('marginal rate follows the bracket', () => {
    expect(stateMarginalRate('CA', 65000)).toBe(0.08)
    expect(stateMarginalRate('TX', 65000)).toBe(0)
  })
  it('getState finds by code', () => expect(getState('OH')?.name).toBe('Ohio'))
})
