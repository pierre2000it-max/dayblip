"use client";

import { useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type AdFormat = "auto" | "rectangle" | "leaderboard" | "skyscraper";

interface AdUnitProps {
  slot: string;
  format?: AdFormat;
  className?: string;
}

// ── Height map for placeholder boxes ─────────────────────────────────────────

const PLACEHOLDER_HEIGHT: Record<AdFormat, string> = {
  auto:        "100px",
  rectangle:   "250px",
  leaderboard: "90px",
  skyscraper:  "600px",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdUnit({ slot, format = "auto", className = "" }: AdUnitProps) {
  const isDev = process.env.NEXT_PUBLIC_ENV === "development";

  useEffect(() => {
    if (!isDev) {
      try {
        const w = window as typeof window & { adsbygoogle?: object[] };
        (w.adsbygoogle = w.adsbygoogle || []).push({});
      } catch {
        // adsbygoogle not yet loaded — will retry on next render
      }
    }
  }, [isDev]);

  // ── Development placeholder ─────────────────────────────────────────────
  if (isDev) {
    return (
      <div
        className={`my-4 flex w-full items-center justify-center rounded border border-dashed border-gray-600 bg-gray-800/50 text-xs text-gray-400 ${className}`}
        style={{ minHeight: PLACEHOLDER_HEIGHT[format] }}
      >
        Ad Unit — {format} — slot: {slot}
      </div>
    );
  }

  // ── Production: real AdSense tag ────────────────────────────────────────
  return (
    <div className={`my-4 overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8231179871551744"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
