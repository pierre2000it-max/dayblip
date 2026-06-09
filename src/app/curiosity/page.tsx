"use client"
import Link from "next/link"

const TOOLS = [
  { emoji: "📺", title: "Subscription Cost", desc: "What Netflix + Spotify could be worth", href: "/curiosity/subscriptions", featured: true },
  { emoji: "☕", title: "Latte Factor", desc: "Your daily coffee's hidden cost", href: "/curiosity/latte-factor" },
  { emoji: "🚬", title: "Smoking Cost", desc: "Financial cost of smoking", href: "/curiosity/smoking-investment" },
  { emoji: "🍽️", title: "Dining Out", desc: "Cooking vs restaurant difference", href: "/curiosity/dining-out" },
  { emoji: "🎰", title: "Lottery Tickets", desc: "What $20/week could really build", href: "/curiosity/lottery" },
  { emoji: "🚗", title: "Car Upgrade Cost", desc: "True cost of a nicer car", href: "/curiosity/car-upgrade" },
  { emoji: "🛒", title: "Impulse Shopping", desc: "What impulse buys cost your future", href: "/curiosity/impulse-shopping" },
  { emoji: "📱", title: "Phone Upgrades", desc: "The annual upgrade habit", href: "/curiosity/phone-upgrade" },
  { emoji: "💪", title: "Side Hustle", desc: "What extra income could build", href: "/curiosity/side-hustle" },
  { emoji: "🏋️", title: "Gym Membership", desc: "Your real cost per visit", href: "/curiosity/gym-membership" },
  { emoji: "🔢", title: "Numerology Calculator", desc: "Your life path number and meaning", href: "/curiosity/numerology" },
  { emoji: "🐉", title: "Chinese Zodiac", desc: "Your animal sign and personality traits", href: "/curiosity/chinese-zodiac" },
  { emoji: "❤️", title: "Love Compatibility", desc: "Numerology and zodiac compatibility", href: "/curiosity/compatibility" },
  { emoji: "🧠", title: "IQ Estimate Quiz", desc: "10-question logic and pattern quiz", href: "/curiosity/iq-estimate" },
]

export default function CuriosityPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-20 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🤔</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Opportunity Cost Calculators</h1>
          <p className="text-lg text-[#a8a8b3]">See what everyday spending could be worth if invested instead</p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-yellow-900/20 border-y border-yellow-500/30 px-6 py-4">
        <p className="mx-auto max-w-[900px] text-center text-sm text-yellow-200">
          ⚠️ <strong>All calculators on this page are for educational and entertainment purposes only.</strong> They are not investment advice.
          Past S&P 500 returns do not guarantee future results. Actual investment returns vary and can be negative.
          Consult a qualified financial advisor before making any investment decisions.
        </p>
      </section>

      <section className="bg-[#16213e] px-6 py-16">
        <div className="mx-auto max-w-[1100px]">
          {/* Featured card */}
          <Link href={TOOLS[0].href}
            className="mb-6 flex flex-col md:flex-row items-center gap-6 rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 transition-all hover:border-[#e94560]">
            <span className="text-6xl">{TOOLS[0].emoji}</span>
            <div>
              <div className="text-xs text-[#e94560] font-bold uppercase tracking-widest mb-1">Most Popular</div>
              <div className="text-2xl font-bold text-white">{TOOLS[0].title}</div>
              <div className="text-[#a8a8b3]">{TOOLS[0].desc} — the most shocking number for most people</div>
            </div>
            <span className="ml-auto text-[#e94560] text-2xl shrink-0">→</span>
          </Link>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {TOOLS.slice(1).map(t => (
              <Link key={t.href} href={t.href}
                className="flex flex-col gap-2 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center transition-all hover:border-[#e94560]">
                <span className="text-4xl">{t.emoji}</span>
                <span className="font-bold text-white">{t.title}</span>
                <span className="text-sm text-[#a8a8b3]">{t.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
