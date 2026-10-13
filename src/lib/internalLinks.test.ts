import { describe, it, expect } from "vitest"
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"

// Fails when any internal href in src/ points to a route that does not exist.
// A route exists if it has a page/route file, matches a dynamic segment,
// is a 301 source in next.config.mjs, or is a file in public/.

const ROOT = process.cwd()
const SRC = join(ROOT, "src")
const APP = join(SRC, "app")

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

const PAGE_FILE = /^(page|route)\.(tsx|ts|jsx|js)$/
const routes = new Set<string>()
const dynamic: string[][] = []

for (const file of walk(APP)) {
  const base = file.split(sep).pop() as string
  if (!PAGE_FILE.test(base)) continue
  const rel = relative(APP, join(file, ".."))
  const segs = (rel === "" ? [] : rel.split(sep)).filter((s) => !(s.startsWith("(") && s.endsWith(")")))
  if (segs.some((s) => s.startsWith("["))) dynamic.push(segs)
  else routes.add("/" + segs.join("/"))
}

const config = readFileSync(join(ROOT, "next.config.mjs"), "utf8")
const redirectSources = new Set<string>()
{
  const re = /source:\s*"(\/[^"]*)"/g
  let m: RegExpExecArray | null
  while ((m = re.exec(config)) !== null) redirectSources.add(m[1])
}

function exists(href: string): boolean {
  const path = href.split("#")[0].split("?")[0].replace(/\/$/, "") || "/"
  if (routes.has(path) || redirectSources.has(path)) return true
  if (existsSync(join(ROOT, "public", path))) return true
  const segs = path.split("/").filter(Boolean)
  return dynamic.some((d) => {
    const catchAll = d.length > 0 && d[d.length - 1].startsWith("[...")
    if (catchAll) {
      return segs.length >= d.length - 1 && d.slice(0, -1).every((a, i) => a.startsWith("[") || a === segs[i])
    }
    return d.length === segs.length && d.every((a, i) => a.startsWith("[") || a === segs[i])
  })
}

const HREF = /(?:href|url)\s*[:=]\s*\{?\s*["'`](\/[a-zA-Z0-9][^"'`\s{}$]*)["'`]/g

describe("internal links", () => {
  it("finds the app routes", () => {
    expect(routes.size).toBeGreaterThan(200)
  })

  it("every hardcoded internal href points to a real route", () => {
    const broken: string[] = []
    for (const file of walk(SRC)) {
      if (!/\.(tsx|ts)$/.test(file) || /\.test\.ts$/.test(file)) continue
      const lines = readFileSync(file, "utf8").split("\n")
      lines.forEach((line, i) => {
        const re = new RegExp(HREF.source, "g")
        let m: RegExpExecArray | null
        while ((m = re.exec(line)) !== null) {
          const href = m[1]
          if (href.startsWith("/api/") || href.startsWith("/_next")) continue
          if (!exists(href)) broken.push(`${relative(ROOT, file)}:${i + 1} ${href}`)
        }
      })
    }
    expect(broken).toEqual([])
  })
})
