export interface StreakData {
  count: number
  lastPlayed: string      // ISO date "2026-07-04"
  longestStreak: number
  totalPlayed: number
}

function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function yesterdayISO(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function getStreak(key: string): StreakData | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as StreakData
  } catch {
    return null
  }
}

export function updateStreak(key: string): StreakData {
  const today = todayISO()
  const yesterday = yesterdayISO()
  const existing = getStreak(key)

  let count: number
  let totalPlayed: number

  if (!existing) {
    count = 1
    totalPlayed = 1
  } else if (existing.lastPlayed === today) {
    return existing
  } else if (existing.lastPlayed === yesterday) {
    count = existing.count + 1
    totalPlayed = existing.totalPlayed + 1
  } else {
    count = 1
    totalPlayed = existing.totalPlayed + 1
  }

  const longestStreak = Math.max(existing?.longestStreak ?? 0, count)
  const updated: StreakData = { count, lastPlayed: today, longestStreak, totalPlayed }

  try {
    localStorage.setItem(key, JSON.stringify(updated))
  } catch { /* ignore */ }

  return updated
}

export function isAlreadyPlayedToday(key: string): boolean {
  const data = getStreak(key)
  if (!data) return false
  return data.lastPlayed === todayISO()
}
