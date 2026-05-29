"use client";

import { useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ShareCardProps {
  year: number;
  number1Song: string;
  number1Movie: string;
  gasPrice: string;
  population: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function trunc(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ShareCard({
  year,
  number1Song,
  number1Movie,
  gasPrice,
  population,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const pageUrl  = `https://dayblip.com/born-in/${year}`;
  const fbUrl    = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
  const xText    = encodeURIComponent(
    `Born in ${year} — ${number1Song} was #1, gas cost ${gasPrice}!\nCheck yours 👇 ${pageUrl}`,
  );
  const xUrl = `https://twitter.com/intent/tweet?text=${xText}`;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
    const link   = document.createElement("a");
    link.download = `my-birth-year-${year}.png`;
    link.href     = canvas.toDataURL("image/png");
    link.click();
  };

  const stats = [
    { emoji: "🎵", label: "Song",  value: trunc(number1Song,  38) },
    { emoji: "🎬", label: "Movie", value: trunc(number1Movie, 38) },
    { emoji: "⛽", label: "Gas",   value: gasPrice },
    { emoji: "🌍", label: "Pop",   value: population },
  ];

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-white">Your Birth Year Card</h2>

      {/* Scroll wrapper so card doesn't break mobile layout */}
      <div className="overflow-x-auto">
        {/* ── THE CARD (fixed 600×400, captured by html2canvas) ─────── */}
        <div
          ref={cardRef}
          style={{
            width: "600px",
            height: "400px",
            background: "#1a1a2e",
            padding: "40px 40px 36px",
            boxSizing: "border-box",
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#ffffff",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* Top accent bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "6px", background: "#e94560" }} />

          {/* Headline */}
          <div style={{ fontSize: "52px", fontWeight: 900, lineHeight: 1.1, marginBottom: "6px" }}>
            Born in{" "}
            <span style={{ color: "#e94560" }}>{year}</span>
          </div>
          <div style={{ fontSize: "15px", color: "#a8a8b3", marginBottom: "28px" }}>
            Here&apos;s what the world looked like
          </div>

          {/* Stats grid — 2 columns using flex */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
            {stats.map(({ emoji, label, value }) => (
              <div
                key={label}
                style={{
                  width: "258px",
                  background: "#16213e",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  borderLeft: "3px solid #e94560",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ fontSize: "11px", color: "#a8a8b3", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {emoji} {label}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff", lineHeight: 1.4 }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Branding */}
          <div style={{ position: "absolute", bottom: "18px", right: "24px", fontSize: "13px", color: "#a8a8b3", letterSpacing: "0.02em" }}>
            dayblip.com
          </div>

          {/* Bottom accent bar */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "#e94560" }} />
        </div>
      </div>

      {/* ── Buttons ─────────────────────────────────────────────────── */}
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={handleDownload}
          className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
        >
          Download Card →
        </button>
        <a
          href={fbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-[#1877f2] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
        >
          Share on Facebook →
        </a>
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-[#333] bg-black px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
        >
          Share on X →
        </a>
      </div>
    </div>
  );
}
