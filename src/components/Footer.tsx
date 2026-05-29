import Link from "next/link";

const countdownLinks = [
  { label: "Days Until Christmas", href: "/days-until/christmas" },
  { label: "Days Until Halloween", href: "/days-until/halloween" },
  { label: "Days Until Thanksgiving", href: "/days-until/thanksgiving" },
  { label: "Days Until New Year's", href: "/days-until/new-years" },
  { label: "Days Until Valentine's Day", href: "/days-until/valentines-day" },
];

const toolLinks = [
  { label: "Age Calculator", href: "/age-calculator" },
  { label: "Date Calculator", href: "/date-calculator" },
  { label: "Days Between Dates", href: "/days-between" },
  { label: "On This Day", href: "/on-this-day/january-1" },
  { label: "Born In Year", href: "/born-in/1990" },
];

const bottomLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f3460]">
      <div className="mx-auto max-w-[1200px] px-6 pt-12 pb-6">
        {/* Three-column grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-white">day</span>
              <span className="text-[#e94560]">blip</span>
            </Link>
            <p className="text-[#a8a8b3] text-sm">
              Countdowns, curiosity &amp; date tools
            </p>
            <p className="text-[#a8a8b3] text-sm">
              © 2026 Dayblip. All rights reserved.
            </p>
          </div>

          {/* Column 2 — Popular Countdowns */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-base">Popular Countdowns</h3>
            <ul className="flex flex-col gap-2">
              {countdownLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#a8a8b3] text-sm transition-colors duration-200 hover:text-[#e94560]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Date Tools */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-base">Date Tools</h3>
            <ul className="flex flex-col gap-2">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#a8a8b3] text-sm transition-colors duration-200 hover:text-[#e94560]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — More Tools */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-base">More Tools</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Life Progress Bar",    href: "/life-progress" },
                { label: "Days Alive",           href: "/days-alive" },
                { label: "Birthday Twins",       href: "/birthday-twins" },
                { label: "#1 Song on Birthday",  href: "/number-one-song" },
                { label: "Couples Countdown",    href: "/couples-countdown" },
                { label: "World Countdowns",     href: "/world-countdowns" },
                { label: "Fact Spinner",         href: "/fact-spinner" },
                { label: "History Quiz",         href: "/history-quiz" },
                { label: "Decade Quiz",          href: "/decade-quiz" },
                { label: "Daily Trivia",         href: "/daily-trivia" },
                { label: "Price History",        href: "/price-history" },
                { label: "Tech Nostalgia",       href: "/tech-nostalgia" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#a8a8b3] text-sm transition-colors duration-200 hover:text-[#e94560]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-[#1a3a6e] pt-6 flex flex-wrap items-center justify-center gap-6">
          {bottomLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#a8a8b3] text-sm transition-colors duration-200 hover:text-[#e94560]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
