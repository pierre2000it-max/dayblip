#!/usr/bin/env node
/**
 * Live-site check for www.dayblip.com.
 *
 * Reads the production sitemap and, for every URL, verifies:
 *   1. HTTP 200 (no 404s, redirects, or soft 404s on pages the sitemap lists)
 *   2. <title> is 60 characters or fewer
 *   3. <meta name="description"> is 120-155 characters and ends with . ? or !
 *   4. The canonical tag matches the sitemap URL
 *   5. The page does not carry a noindex robots meta
 *
 * Exits 1 when anything fails and prints one line per failure, so the
 * weekly GitHub Action can open an issue with the list.
 *
 * Usage: node scripts/check-live-site.mjs [--concurrency 8] [--sitemap URL]
 */

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}
const SITEMAP = flag("sitemap", "https://www.dayblip.com/sitemap.xml")
const CONCURRENCY = Number(flag("concurrency", "8"))
const UA = "Dayblip-LiveCheck/1.0 (+https://www.dayblip.com)"

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim()

async function fetchText(url) {
  const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "manual" })
  return { status: res.status, location: res.headers.get("location"), body: res.status === 200 ? await res.text() : "" }
}

function checkPage(url, { status, location, body }) {
  const problems = []
  if (status !== 200) {
    problems.push(`HTTP ${status}${location ? ` -> ${location}` : ""}`)
    return problems
  }
  const title = decode(body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "")
  const desc = decode(
    body.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i)?.[1] ??
      body.match(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']description["']/i)?.[1] ??
      "",
  )
  const canonical = body.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] ?? ""
  const robots = body.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i)?.[1] ?? ""

  if (!title) problems.push("missing <title>")
  else if (title.length > 60) problems.push(`title ${title.length} chars: "${title}"`)

  if (!desc) problems.push("missing meta description")
  else {
    if (desc.length < 120 || desc.length > 155) problems.push(`description ${desc.length} chars`)
    if (!/[.?!]$/.test(desc)) problems.push("description does not end with a sentence")
  }

  if (!canonical) problems.push("missing canonical")
  else if (canonical.replace(/\/$/, "") !== url.replace(/\/$/, "")) problems.push(`canonical mismatch: ${canonical}`)

  if (/noindex/i.test(robots)) problems.push(`noindex on a sitemap URL (${robots})`)

  if (/<h1[^>]*>\s*<\/h1>/i.test(body) || !/<h1[\s>]/i.test(body)) problems.push("no h1 in server HTML")

  return problems
}

async function main() {
  const sm = await fetchText(SITEMAP)
  if (sm.status !== 200) {
    console.error(`sitemap: HTTP ${sm.status}`)
    process.exit(1)
  }
  const urls = [...sm.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => decode(m[1]))
  if (urls.length === 0) {
    console.error("sitemap: no <loc> entries found")
    process.exit(1)
  }

  const failures = []
  let done = 0
  const queue = [...urls]
  async function worker() {
    while (queue.length) {
      const url = queue.shift()
      try {
        const page = await fetchText(url)
        const problems = checkPage(url, page)
        if (problems.length) failures.push({ url, problems })
      } catch (err) {
        failures.push({ url, problems: [`fetch error: ${err.message}`] })
      }
      done++
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  console.log(`Checked ${done} sitemap URLs. ${failures.length} with problems.`)
  for (const f of failures.sort((a, b) => a.url.localeCompare(b.url))) {
    for (const p of f.problems) console.log(`FAIL ${f.url} :: ${p}`)
  }
  process.exit(failures.length ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
