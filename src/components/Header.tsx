"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Countdowns", href: "/days-until/christmas" },
  { label: "Born In", href: "/born-in" },
  { label: "Finance", href: "/finance" },
  { label: "Curiosity", href: "/curiosity" },
  { label: "Health", href: "/health" },
  { label: "On This Day", href: "/on-this-day" },
  { label: "Tools", href: "/age-calculator" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#e94560] bg-[#1a1a2e]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          <span className="text-white">day</span>
          <span className="text-[#e94560]">blip</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white transition-colors duration-200 hover:text-[#e94560]"
            >
              {link.label}
            </Link>
          ))}

          {/* Live — pulsing dot */}
          <Link
            href="/world-counters"
            className="flex items-center gap-1.5 text-white transition-colors duration-200 hover:text-[#e94560]"
          >
            <span className="h-2 w-2 rounded-full bg-[#e94560] animate-pulse shrink-0" />
            Live
          </Link>
        </nav>

        {/* Hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className="h-0.5 w-6 bg-white transition-all duration-200" />
          <span className="h-0.5 w-6 bg-white transition-all duration-200" />
          <span className="h-0.5 w-6 bg-white transition-all duration-200" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="border-t border-[#e94560]/30 bg-[#1a1a2e] md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 text-white transition-colors duration-200 hover:text-[#e94560]"
            >
              {link.label}
            </Link>
          ))}

          {/* Live — mobile */}
          <Link
            href="/world-counters"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-6 py-3 text-white transition-colors duration-200 hover:text-[#e94560]"
          >
            <span className="h-2 w-2 rounded-full bg-[#e94560] animate-pulse shrink-0" />
            Live
          </Link>
        </nav>
      )}
    </header>
  );
}
