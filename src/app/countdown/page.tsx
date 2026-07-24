import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Custom Countdown Timer — Create & Share | Dayblip",
  description:
    "Create a free personal countdown to any event — a wedding, vacation, graduation, or anything that matters. Share the link with friends and family.",
  keywords: ["custom countdown", "countdown timer", "event countdown", "share countdown"],
  alternates: { canonical: "https://www.dayblip.com/countdown" },
  openGraph: {
    title: "Custom Countdown Timer | Dayblip",
    description: "Count down to any event and share it with the people who matter.",
    url: "https://www.dayblip.com/countdown",
    siteName: "Dayblip",
    type: "website",
  },
};

const EXAMPLES = [
  { emoji: "💍", label: "Wedding day",        href: "/countdown/create?name=Our+Wedding+Day" },
  { emoji: "🌴", label: "Dream vacation",     href: "/countdown/create?name=Our+Dream+Vacation" },
  { emoji: "🎓", label: "Graduation",         href: "/countdown/create?name=My+Graduation+Day" },
  { emoji: "🏠", label: "Moving day",         href: "/countdown/create?name=Our+Moving+Day" },
  { emoji: "👶", label: "Baby due date",      href: "/countdown/create?name=Baby%27s+Due+Date" },
  { emoji: "🎂", label: "Birthday party",     href: "/countdown/create?name=My+Birthday+Party" },
  { emoji: "🎄", label: "Holiday trip",       href: "/countdown/create?name=Our+Holiday+Trip" },
  { emoji: "🏆", label: "Race / competition", href: "/countdown/create?name=My+Race+Day" },
];

export default function CountdownHubPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      {/* Hero */}
      <section
        className="px-6 py-20 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}
      >
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 text-6xl">⏳</div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Count Down to Anything
          </h1>
          <p className="mb-8 text-lg text-[#a8a8b3]">
            Create a free personal countdown to any event — a wedding, vacation,
            graduation, or any milestone — and share the link in one click.
          </p>
          <Link
            href="/countdown/create"
            className="inline-block rounded-xl bg-[#e94560] px-8 py-4 text-lg font-bold text-white shadow-lg transition-opacity hover:opacity-90"
          >
            Create My Countdown →
          </Link>
          <p className="mt-4 text-sm text-[#a8a8b3]">Free. No sign-up required.</p>
        </div>
      </section>

      {/* What you can count down to */}
      <section className="bg-[#16213e] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">
            What can you count down to?
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {EXAMPLES.map(({ emoji, label, href }) => (
              <Link
                key={label}
                href={href}
                className="group flex flex-col items-center gap-2 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center transition-colors hover:border-[#e94560]/60"
              >
                <span className="text-3xl">{emoji}</span>
                <span className="text-sm font-medium text-[#a8a8b3] group-hover:text-white transition-colors">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-white">How it works</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: "1", icon: "✏️", title: "Name your event", desc: "Enter the event name, date, and an optional personal message." },
              { step: "2", icon: "🔗", title: "Get a shareable link", desc: "We generate a permanent link for your countdown instantly." },
              { step: "3", icon: "📤", title: "Share with everyone", desc: "Send the link to friends, family, or post it on social media." },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#0f3460] text-2xl">
                  {icon}
                </div>
                <h3 className="mb-2 font-bold text-white">{title}</h3>
                <p className="text-sm text-[#a8a8b3]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#16213e] px-6 py-16 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 text-2xl font-bold text-white">Ready to start counting?</h2>
          <p className="mb-8 text-[#a8a8b3]">
            It only takes 30 seconds. No account needed.
          </p>
          <Link
            href="/countdown/create"
            className="inline-block rounded-xl bg-[#e94560] px-8 py-4 text-lg font-bold text-white shadow-lg transition-opacity hover:opacity-90"
          >
            Create My Countdown →
          </Link>
        </div>
      </section>

      {/* Popular Countdowns */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">
            Popular Countdowns
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { emoji: "🎄", label: "Days Until Christmas",    href: "/days-until/christmas" },
              { emoji: "🎆", label: "Days Until New Year's",   href: "/days-until/new-years" },
              { emoji: "🎃", label: "Days Until Halloween",    href: "/days-until/halloween" },
              { emoji: "🦃", label: "Days Until Thanksgiving", href: "/days-until/thanksgiving" },
              { emoji: "💝", label: "Days Until Valentine's",  href: "/days-until/valentines-day" },
              { emoji: "🏖️", label: "Days Until Summer",       href: "/days-until/summer" },
            ].map(({ emoji, label, href }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-center gap-2 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center transition-colors hover:border-[#e94560]/60"
              >
                <span className="text-3xl">{emoji}</span>
                <span className="text-sm font-medium text-[#a8a8b3] group-hover:text-white transition-colors">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Countdowns */}
      <section className="bg-[#16213e] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">
            🏆 Sports Countdowns
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { emoji: "🏈", label: "Super Bowl",        href: "/days-until/super-bowl" },
              { emoji: "⚾", label: "World Series",      href: "/days-until/world-series" },
              { emoji: "🏀", label: "March Madness",     href: "/days-until/march-madness" },
              { emoji: "🏆", label: "NBA Finals",        href: "/days-until/nba-finals" },
            ].map(({ emoji, label, href }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-center gap-2 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center transition-colors hover:border-[#e94560]/60"
              >
                <span className="text-3xl">{emoji}</span>
                <span className="text-sm font-medium text-[#a8a8b3] group-hover:text-white transition-colors">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
