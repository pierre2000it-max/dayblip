// ─── SPORTS EVENTS DATA FILE ──────────────────────────────────────────────────
// Update this file annually via GitHub Action or manual update each season.
// Each event has: date (ISO string), name, venue, description, and notes.
// When a date passes update to next year's confirmed date.
// Source dates:
// - Super Bowl: NFL.com (announced ~2 years in advance)
// - World Cup: FIFA.com (announced years in advance)
// - World Series: MLB.com (announced ~October each year)
// - March Madness: NCAA.com (announced ~March each year)
// - NBA Finals: NBA.com (announced ~May each year)
// Last updated: October 2026 (World Cup moved to 2030, World Series date confirmed, March Madness dates confirmed)

export interface SportEvent {
  slug: string
  name: string
  shortName: string
  date: string        // ISO date string — UPDATE ANNUALLY
  venue: string
  location: string
  description: string
  emoji: string
  sport: string
  notes: string       // e.g. "Exact date TBD — approximate"
  confirmed: boolean  // true if date is officially confirmed
}

export const SPORTS_EVENTS: SportEvent[] = [
  {
    slug: 'super-bowl',
    name: 'Super Bowl LXI',
    shortName: 'Super Bowl',
    date: '2027-02-14',
    venue: 'SoFi Stadium',
    location: 'Inglewood, California',
    description: 'The NFL championship game — the most watched sporting event in the United States.',
    emoji: '🏈',
    sport: 'NFL Football',
    notes: "Officially confirmed. First Super Bowl on Valentine's Day. Broadcast on ESPN and ABC.",
    confirmed: true
  },
  {
    slug: 'world-cup',
    name: 'FIFA World Cup 2030',
    shortName: 'World Cup 2030',
    date: '2030-06-13',
    venue: 'Multiple venues across Spain, Portugal and Morocco',
    location: 'Spain, Portugal and Morocco',
    description: 'The next FIFA World Cup, hosted by Spain, Portugal and Morocco, with centenary matches in Uruguay, Argentina and Paraguay.',
    emoji: '⚽',
    sport: 'Soccer / Football',
    notes: 'Dates reported but not final. Centenary matches June 8 to 9 2030, opening matches June 13 2030, final July 21 2030. FIFA has not released the full match schedule.',
    confirmed: false
  },
  {
    slug: 'world-series',
    name: '2026 World Series',
    shortName: 'World Series',
    date: '2026-10-23',
    venue: 'TBD — home field of AL/NL pennant winner',
    location: 'TBD',
    description: 'The MLB championship series — the best of seven games between the American League and National League champions.',
    emoji: '⚾',
    sport: 'MLB Baseball',
    notes: 'Game 1 is Friday October 23 2026 per the MLB schedule. A Game 7, if needed, is Saturday October 31. Venue set after the League Championship Series.',
    confirmed: true
  },
  {
    slug: 'march-madness',
    name: 'NCAA March Madness 2027',
    shortName: 'March Madness',
    date: '2027-03-16',
    venue: 'Multiple venues nationwide',
    location: 'Nationwide',
    description: 'The NCAA college basketball tournament — 68 teams competing for the national championship over three weekends.',
    emoji: '🏀',
    sport: 'College Basketball',
    notes: 'First Four is March 16 and 17 2027 per the NCAA. Selection Sunday is March 14, the Final Four is April 3 and the championship game is April 5, both at Ford Field in Detroit.',
    confirmed: true
  },
  {
    slug: 'nba-finals',
    name: '2027 NBA Finals',
    shortName: 'NBA Finals',
    date: '2027-06-05',
    venue: 'TBD — home court of Eastern Conference champion',
    location: 'TBD',
    description: 'The NBA championship series — best of seven games between the Eastern and Western Conference champions.',
    emoji: '🏀',
    sport: 'NBA Basketball',
    notes: 'Approximate date — Game 1 typically first week of June. Exact date confirmed after conference finals.',
    confirmed: false
  }
]

// Helper — get event by slug
export function getSportEvent(slug: string): SportEvent | undefined {
  return SPORTS_EVENTS.find(e => e.slug === slug)
}

// Helper — calculate days until event
export function getDaysUntil(dateString: string): {
  days: number
  hours: number
  minutes: number
  seconds: number
  isPast: boolean
  totalSeconds: number
} {
  const target = new Date(dateString).getTime()
  const now = Date.now()
  const diff = target - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, totalSeconds: 0 }
  }

  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, isPast: false, totalSeconds }
}
