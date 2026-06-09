"use client"
import { useState, useMemo } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

const COMMON_PASSWORDS = new Set([
  "password","123456","qwerty","abc123","password1","111111","iloveyou","admin",
  "welcome","monkey","login","pass","test","master","dragon","baseball",
  "football","shadow","superman","michael",
])

function calcCrackTime(password: string): {
  combinations: number
  secondsToCrack: number
  charsetSize: number
  hasLower: boolean
  hasUpper: boolean
  hasNumber: boolean
  hasSymbol: boolean
  isCommon: boolean
  score: number
} {
  const lower  = /[a-z]/.test(password)
  const upper  = /[A-Z]/.test(password)
  const number = /[0-9]/.test(password)
  const symbol = /[^a-zA-Z0-9]/.test(password)
  const isCommon = COMMON_PASSWORDS.has(password.toLowerCase())

  let charset = 0
  if (lower)  charset += 26
  if (upper)  charset += 26
  if (number) charset += 10
  if (symbol) charset += 32

  if (charset === 0) charset = 26

  const combinations = Math.pow(charset, password.length)
  const guessesPerSec = 1e11 // 100 billion
  const secondsToCrack = isCommon ? 0 : combinations / guessesPerSec

  // Score 0-4
  let score = 0
  if (password.length >= 8)  score++
  if (password.length >= 12) score++
  if ((lower ? 1 : 0) + (upper ? 1 : 0) + (number ? 1 : 0) + (symbol ? 1 : 0) >= 3) score++
  if (password.length >= 16) score++
  if (isCommon) score = 0

  return { combinations, secondsToCrack, charsetSize: charset, hasLower: lower, hasUpper: upper, hasNumber: number, hasSymbol: symbol, isCommon, score }
}

function fmtCrackTime(seconds: number): string {
  if (seconds <= 0) return "Instant"
  if (seconds < 1)  return "Instant"
  if (seconds < 60) return "Seconds"
  if (seconds < 3600) return "Minutes"
  if (seconds < 86400) return "Hours"
  if (seconds < 2592000) return "Days"
  if (seconds < 31536000) return "Months"
  if (seconds < 315360000) return "Years"
  if (seconds < 3153600000) return "Decades"
  if (seconds < 31536000000) return "Centuries"
  return "Millennia"
}

function fmtCombinations(n: number): string {
  if (!isFinite(n)) return "∞"
  if (n >= 1e24) return `${(n / 1e24).toFixed(1)} septillion`
  if (n >= 1e21) return `${(n / 1e21).toFixed(1)} sextillion`
  if (n >= 1e18) return `${(n / 1e18).toFixed(1)} quintillion`
  if (n >= 1e15) return `${(n / 1e15).toFixed(1)} quadrillion`
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)} trillion`
  if (n >= 1e9)  return `${(n / 1e9).toFixed(1)} billion`
  if (n >= 1e6)  return `${(n / 1e6).toFixed(1)} million`
  return n.toLocaleString()
}

const STRENGTH_LEVELS = [
  { label: "Very Weak", color: "#ef4444", bar: 1 },
  { label: "Weak",      color: "#f97316", bar: 2 },
  { label: "Fair",      color: "#eab308", bar: 3 },
  { label: "Strong",    color: "#4FC3F7", bar: 4 },
  { label: "Very Strong", color: "#22c55e", bar: 5 },
]

export default function PasswordStrengthPage() {
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)

  const analysis = useMemo(() => {
    if (!password) return null
    return calcCrackTime(password)
  }, [password])

  const level = analysis ? STRENGTH_LEVELS[Math.min(analysis.score, 4)] : null
  const crackTime = analysis ? fmtCrackTime(analysis.secondsToCrack) : null

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Password Strength Checker", "Check password strength and crack time estimate — all analysis happens in your browser", "https://www.dayblip.com/tools/password-strength", "UtilitiesApplication"),
        faqSchema([
          { question: "How long does it take to crack a password?", answer: "Crack time depends entirely on length and character variety. An 8-character lowercase password is cracked in under 1 hour. The same length with mixed case numbers and symbols takes about 22 hours. A 12-character password with all character types takes over 34000 years at 100 billion guesses per second — the speed of modern offline cracking hardware." },
          { question: "What makes a password strong?", answer: "Length is the most important factor — each additional character multiplies possible combinations exponentially. A 16-character lowercase passphrase is stronger than an 8-character complex password. The best approach is length plus variety: 12+ characters with uppercase lowercase numbers and at least one symbol. Avoid dictionary words dates and keyboard patterns." },
          { question: "Is my password safe to enter here?", answer: "Yes. This checker analyzes your password entirely within your browser using JavaScript. Your password is never sent to any server and is not stored anywhere. You can verify this by disconnecting from the internet before testing — the tool still works because all analysis is local." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Password Strength Checker", url: "https://www.dayblip.com/tools/password-strength" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-3 text-4xl">🔐</div>
          <h1 className="mb-3 text-4xl font-bold text-white">Password Strength Checker — How Long Would It Take to Crack Your Password?</h1>
          <p className="text-[#a8a8b3]">All analysis happens in your browser — nothing is stored or transmitted</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Password Strength Checker" }]} />

          {/* Privacy notice */}
          <div className="rounded-xl border border-green-500/40 bg-green-900/10 p-4 flex gap-3">
            <span className="text-green-400 text-xl shrink-0">🔒</span>
            <div>
              <div className="font-bold text-green-300 text-sm mb-1">Your password never leaves your browser</div>
              <p className="text-xs text-[#a8a8b3]">All analysis happens locally on your device using JavaScript. Nothing is stored or transmitted to any server. You can disconnect from the internet and this tool still works.</p>
            </div>
          </div>

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>An 8-character lowercase password has 208 billion possible combinations and is crackable in under 1 hour. Adding numbers and mixed case creates 218 trillion combinations — crackable in about 22 hours. A 12-character password with uppercase, lowercase, numbers and symbols has 475 trillion trillion combinations — estimated crack time of over 34,000 years at current computing speeds.</p>
          </div>

          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>Password strength is measured by entropy — the number of possible combinations a cracker must try. Each additional character and each new character type (uppercase, lowercase, numbers, symbols) multiplies the number of combinations exponentially. This checker analyzes your password entirely in your browser — your password is never transmitted to any server and is immediately discarded when you leave the page.</p>

          {/* Password input */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Enter a password to analyze</span>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Type a password..."
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 pr-12 text-white focus:border-[#e94560] focus:outline-none font-mono"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                <button onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8a8b3] hover:text-white text-lg"
                  title={show ? "Hide password" : "Show password"}>
                  {show ? "🙈" : "👁️"}
                </button>
              </div>
            </label>

            {/* Strength meter */}
            {analysis && level && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#a8a8b3]">Strength</span>
                  <span className="font-bold" style={{ color: level.color }}>{level.label}</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex-1 h-2 rounded-full transition-all"
                      style={{ background: i <= level.bar ? level.color : "#0f3460" }} />
                  ))}
                </div>
              </div>
            )}

            {/* Common password warning */}
            {analysis?.isCommon && (
              <div className="rounded-xl border border-[#FF6B6B]/50 bg-red-900/20 p-4 flex gap-2">
                <span className="text-xl shrink-0">🚨</span>
                <p className="text-sm text-[#FF6B6B] font-semibold">This is one of the most commonly used passwords and would be cracked INSTANTLY by any password cracker.</p>
              </div>
            )}

            {/* Analysis */}
            {analysis && !analysis.isCommon && (
              <div className="space-y-3">
                {/* Crack time */}
                <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-4 text-center">
                  <div className="text-xs text-[#a8a8b3] uppercase tracking-wider mb-1">Estimated Crack Time</div>
                  <div className="text-3xl font-black" style={{ color: level?.color }}>{crackTime}</div>
                  <div className="text-xs text-[#a8a8b3] mt-1">Offline fast hash attack (100 billion guesses/sec)</div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-3">
                    <div className="text-xs text-[#a8a8b3] mb-1">Length</div>
                    <div className="font-bold text-white">{password.length} characters</div>
                  </div>
                  <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-3">
                    <div className="text-xs text-[#a8a8b3] mb-1">Possible combinations</div>
                    <div className="font-bold text-white text-sm">{fmtCombinations(analysis.combinations)}</div>
                  </div>
                </div>

                {/* Character types */}
                <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-4">
                  <div className="text-xs text-[#a8a8b3] uppercase tracking-wider mb-3">Character types</div>
                  <div className="space-y-2">
                    {[
                      { label: "Lowercase letters (a-z)", has: analysis.hasLower },
                      { label: "Uppercase letters (A-Z)", has: analysis.hasUpper },
                      { label: "Numbers (0-9)", has: analysis.hasNumber },
                      { label: "Symbols (!@#$%^&*)", has: analysis.hasSymbol },
                    ].map(({ label, has }) => (
                      <div key={label} className="flex items-center gap-2 text-sm">
                        <span>{has ? "✅" : "❌"}</span>
                        <span className={has ? "text-white" : "text-[#a8a8b3]"}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                {(password.length < 12 || !analysis.hasUpper || !analysis.hasNumber || !analysis.hasSymbol) && (
                  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/10 p-4 space-y-2">
                    <div className="text-xs font-bold text-yellow-300 uppercase tracking-wider mb-2">Improvement Tips</div>
                    {password.length < 12 && (
                      <p className="text-sm text-[#a8a8b3]">⚠️ Add {12 - password.length} more characters. Length is the single most important factor in password strength.</p>
                    )}
                    {!analysis.hasUpper && (
                      <p className="text-sm text-[#a8a8b3]">⚠️ Add at least one uppercase letter (A–Z) to multiply combinations by 26.</p>
                    )}
                    {!analysis.hasNumber && (
                      <p className="text-sm text-[#a8a8b3]">⚠️ Add at least one number (0–9).</p>
                    )}
                    {!analysis.hasSymbol && (
                      <p className="text-sm text-[#a8a8b3]">⚠️ Add a symbol (!@#$%^&*) for maximum strength.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tips section */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-3">
            <h2 className="font-bold text-white">Tips for a Strong Password</h2>
            <ul className="space-y-2">
              {[
                "Use at least 12 characters — longer is always stronger",
                "Mix uppercase, lowercase, numbers and at least one symbol",
                'Use a passphrase: 4 random words joined (correct-horse-battery-staple) is stronger than a complex 8-char password',
                "Never reuse passwords across sites — one breach exposes all",
                "Consider a password manager like Bitwarden (free) or 1Password",
              ].map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-[#a8a8b3]">
                  <span className="text-[#4FC3F7] shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <ShareButtons
            text="A 12-character password with mixed characters would take 34000+ years to crack. Check your password strength free — nothing is stored: www.dayblip.com/tools/password-strength"
            url="https://www.dayblip.com/tools/password-strength"
            title="Password Strength Checker"
          />

          <RelatedTools tools={[
            { emoji: "🌐", title: "Time Zone Converter", desc: "Convert time zones for remote work", href: "/tools/timezone-converter" },
            { emoji: "📊", title: "Percentage Calculator", desc: "Calculate any percentage instantly", href: "/tools/percentage-calculator" },
            { emoji: "🤖", title: "AI Job Score", desc: "How safe is your job from automation?", href: "/tools/ai-job-score" },
            { emoji: "💻", title: "Screen Time Calculator", desc: "What your screen time costs you", href: "/tools/time-wasted" },
          ]} />
        </div>
      </section>
    </div>
  )
}
