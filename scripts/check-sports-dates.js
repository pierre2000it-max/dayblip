#!/usr/bin/env node
/**
 * Local version of the sports date checker.
 * Run with: node scripts/check-sports-dates.js
 * Used to preview what the GitHub Action would report.
 *
 * GitHub labels needed for the workflows:
 *   annual-update  (color: #e11d48)
 *   sports-dates   (color: #0ea5e9)
 *   data           (color: #f59e0b)
 *
 * Create labels manually at:
 *   https://github.com/pierre2000it-max/dayblip/labels
 * Or via GitHub CLI:
 *   gh label create "annual-update" --color "e11d48" --description "Annual data update required"
 *   gh label create "sports-dates"  --color "0ea5e9" --description "Sports event date needs review"
 *   gh label create "data"          --color "f59e0b" --description "Data file update"
 */

const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../src/data/sports-events.ts')

if (!fs.existsSync(filePath)) {
  console.error('ERROR: src/data/sports-events.ts not found')
  process.exit(1)
}

const content = fs.readFileSync(filePath, 'utf8')

/**
 * Parse a string value from a line, handling both single and double quotes.
 */
function parseStr(line, key) {
  const re = new RegExp(`${key}:\\s*['"]([^'"]+)['"]`)
  const m = line.match(re)
  return m ? m[1] : null
}

/**
 * Parse all sport events from sports-events.ts.
 * Pushes each event when it sees the closing brace of the object,
 * so all fields (including confirmed, which comes after notes) are captured.
 */
function parseEvents(src) {
  const lines = src.split('\n')
  const events = []
  let cur = {}

  for (const line of lines) {
    if (line.includes('slug:'))      { const v = parseStr(line, 'slug');  if (v) cur.slug = v }
    if (line.includes('name:') && !line.includes('shortName')) {
      const v = parseStr(line, 'name'); if (v) cur.name = v
    }
    if (line.includes('date:'))      { const v = parseStr(line, 'date');  if (v) cur.date = v }
    if (line.includes('notes:'))     { const v = parseStr(line, 'notes'); if (v) cur.notes = v }
    if (line.includes('confirmed:')) {
      const m = line.match(/confirmed:\s*(true|false)/)
      if (m) cur.confirmed = m[1] === 'true'
    }
    // End of object — push when we see the closing brace
    if (/^\s*\},?\s*$/.test(line) && cur.slug && cur.date) {
      events.push({ ...cur })
      cur = {}
    }
  }
  return events
}

const today = new Date()
today.setHours(0, 0, 0, 0)

console.log('=== Dayblip Sports Date Checker ===')
console.log(`Today: ${today.toISOString().split('T')[0]}\n`)

const events = parseEvents(content)

if (events.length === 0) {
  console.error('No events parsed. Check sports-events.ts format.')
  process.exit(1)
}

const pastEvents = []
const unconfirmedEvents = []
const confirmedUpcoming = []

for (const e of events) {
  const eventDate = new Date(e.date)
  const daysUntil = Math.floor((eventDate - today) / (1000 * 60 * 60 * 24))
  if (eventDate < today) {
    pastEvents.push({ ...e, daysUntil })
  } else if (!e.confirmed) {
    unconfirmedEvents.push({ ...e, daysUntil })
  } else {
    confirmedUpcoming.push({ ...e, daysUntil })
  }
}

if (confirmedUpcoming.length > 0) {
  console.log('✅ CONFIRMED UPCOMING')
  for (const e of confirmedUpcoming) {
    console.log(`   ${e.name}`)
    console.log(`   Date: ${e.date} — ${e.daysUntil} days away\n`)
  }
}

if (unconfirmedEvents.length > 0) {
  console.log('⚠️  UNCONFIRMED DATES — check for official announcements')
  for (const e of unconfirmedEvents) {
    console.log(`   ${e.name}`)
    console.log(`   Approximate date: ${e.date} — ${e.daysUntil} days away`)
    console.log(`   Note: ${e.notes}\n`)
  }
}

if (pastEvents.length > 0) {
  console.log('❌ PAST EVENTS — update to next season')
  for (const e of pastEvents) {
    console.log(`   ${e.name}`)
    console.log(`   Date was: ${e.date} (PAST)\n`)
  }
}

const needsAction = pastEvents.length + unconfirmedEvents.length
if (needsAction === 0) {
  console.log('✅ All sports dates confirmed and current. No GitHub issue would be created.')
} else {
  console.log(`⚠️  ${needsAction} event(s) need attention. GitHub Action would create an issue.`)
}
