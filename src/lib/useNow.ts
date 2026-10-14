"use client"

import { useEffect, useState } from "react"

/**
 * Current time for live counters, safe for SSR.
 *
 * The server passes `initialNow` (ms). Before mount, the hook returns a Date
 * whose local getters read as UTC, so the first client render matches the
 * server HTML exactly (the server runs in UTC) whatever the visitor's time
 * zone is. After mount it switches to the real local time and ticks each second.
 */
/** Date whose local getters read as the UTC wall clock of `ms`. */
export function utcWallClock(ms: number): Date {
  return new Date(ms + new Date(ms).getTimezoneOffset() * 60000)
}

export function useNow(initialNow: number): Date {
  const [ms, setMs] = useState(initialNow)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setMs(Date.now())
    const t = setInterval(() => setMs(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  return mounted ? new Date(ms) : utcWallClock(ms)
}
