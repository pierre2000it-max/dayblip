import { pickMeta } from '@/lib/metaFit'

export function salaryDescription(job: string, state: string, formatted: string, national: number): string {
  const j = job.toLowerCase()
  const nat = '$' + national.toLocaleString()
  return pickMeta([
    `The average ${j} salary in ${state} is ${formatted} per year (BLS OES 2024-2025). See how ${state} compares to the national median of ${nat}.`,
    `Average ${j} salary in ${state}: ${formatted} per year, against a ${nat} national median. BLS OES 2024-2025 data. Free — no signup required.`,
    `${job} pay in ${state} averages ${formatted} a year. National median: ${nat}. Based on BLS OES 2024-2025 data. Free — no signup required.`,
    `${job} salary in ${state}: ${formatted} a year versus ${nat} nationally. BLS OES 2024-2025 data. Free — no signup required.`,
  ])
}

export function cityPairDescription(a: string, aIdx: number, b: string, bIdx: number): string {
  return pickMeta([
    `Compare cost of living between ${a} and ${b}. Housing, groceries, transport, healthcare side by side. COLI: ${a} ${aIdx} vs ${b} ${bIdx}. Free.`,
    `Cost of living in ${a} vs ${b}: housing, groceries, transport and healthcare side by side. COLI ${aIdx} vs ${bIdx}. Free — no signup required.`,
    `${a} vs ${b} cost of living, side by side. Housing, groceries, transport and healthcare. COLI ${aIdx} vs ${bIdx}. Free — no signup required.`,
    `${a} vs ${b}: cost of living index ${aIdx} vs ${bIdx}, with housing, groceries, transport and healthcare compared. Free — no signup required.`,
  ])
}

export function jobPairDescription(a: string, aNat: number, b: string, bNat: number): string {
  const an = '$' + aNat.toLocaleString()
  const bn = '$' + bNat.toLocaleString()
  return pickMeta([
    `Compare ${a} and ${b} salaries nationwide. National median: ${a} ${an} vs ${b} ${bn}. BLS 2024-2025. Free.`,
    `${a} vs ${b} salary comparison. National median pay: ${an} vs ${bn}. BLS OES 2024-2025 data. Free — no signup required.`,
    `${a} or ${b}? National median salary is ${an} vs ${bn}, per BLS OES 2024-2025 data. Free — no signup required.`,
    `${a} vs ${b}: ${an} vs ${bn} national median salary, per BLS OES 2024-2025. Free — no signup required.`,
  ])
}

export function marketDescription(zip: string, stateName: string, category: string, low: number, high: number): string {
  return pickMeta([
    `Is ZIP ${zip} in ${stateName} a good market for ${category}? Market score range ${low}-${high} from 7 criteria. Free — no signup required.`,
    `ZIP ${zip}, ${stateName}: market score ${low}-${high} for ${category} businesses, based on 7 criteria. Free — no signup required.`,
    `${category} market score for ZIP ${zip} in ${stateName}: ${low}-${high}, from 7 weighted criteria. Free — no signup required.`,
    `${category} in ZIP ${zip}, ${stateName}: score range ${low}-${high} across 7 market criteria. Free market check, no signup required.`,
    `${category} in ZIP ${zip}, ${stateName}: market score range ${low}-${high} across 7 criteria. Free market check from Dayblip, no signup or email.`,
  ])
}

export function timeMachineDescription(label: string): string {
  return pickMeta([
    `See what life was like on ${label}. Gas prices, food costs, world events, #1 songs and more. Free historical date lookup, no signup required.`,
    `What was life like on ${label}? Gas prices, food costs, #1 songs and world events. Free time machine, no signup required.`,
  ])
}

export function onThisDayDescription(label: string): string {
  return pickMeta([
    `Discover what happened on ${label} in history. Famous birthdays, major events and historical facts. Free — no signup required.`,
    `What happened on ${label} in history? Major events, famous birthdays and historical facts for the day. Free — no signup required.`,
  ])
}

export function countdownDescription(eventName: string, eventDate: string): string {
  return pickMeta([
    `See how many days, hours, and minutes are left until ${eventName} on ${eventDate}. Free live countdown, no signup required.`,
    `Live countdown to ${eventName} on ${eventDate}: days, hours, minutes and seconds remaining. Free, no signup required.`,
    `Live countdown to this event on ${eventDate}: days, hours, minutes and seconds remaining. Free countdown timer from Dayblip, no signup required.`,
  ])
}

export function holidayFallbackDescription(name: string, year: number): string {
  return pickMeta([
    `How many days until ${name}? Live countdown to ${name} ${year} with days, hours, minutes and seconds remaining. Free — no signup required.`,
    `Live countdown to ${name} ${year}: exact days, hours, minutes and seconds remaining. Updated in real time. Free — no signup required.`,
  ])
}
