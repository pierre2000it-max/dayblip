"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";
import { supabase, type Countdown } from "@/lib/supabase";
import { generateShareImage } from "@/utils/generateShareImage";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }

function calcTimeLeft(eventDate: string): TimeLeft {
  const target = new Date(eventDate + "T00:00:00");
  const now = new Date();
  const diff = Math.max(0, target.getTime() - now.getTime());
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} (${DAY_NAMES[d.getDay()]})`;
}

interface Props { countdown: Countdown }

export default function CountdownClient({ countdown }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(countdown.event_date));
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const viewTracked = useRef(false);

  const hasPhoto = Boolean(countdown.photo_url);
  const isDark = !hasPhoto && countdown.theme !== "light";

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft(countdown.event_date)), 1000);
    return () => clearInterval(id);
  }, [countdown.event_date]);

  useEffect(() => {
    if (viewTracked.current) return;
    viewTracked.current = true;
    supabase.rpc("increment_view_count", { countdown_slug: countdown.slug }).then(() => {});
  }, [countdown.slug]);

  const pageUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://www.dayblip.com/countdown/${countdown.slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await generateShareImage({
        title: countdown.event_name,
        primaryStat: String(timeLeft.days),
        primaryLabel: "days to go",
        stats: [
          { label: "Hours",   value: String(timeLeft.hours) },
          { label: "Minutes", value: String(timeLeft.minutes) },
          { label: "Date",    value: formatEventDate(countdown.event_date) },
        ],
        tagline: countdown.message ?? `Counting down to ${countdown.event_name}`,
        toolUrl: "dayblip.com/countdown",
        filename: `countdown-${countdown.slug}.png`,
        backgroundImageUrl: countdown.photo_url ?? undefined,
      });
    } finally {
      setDownloading(false);
    }
  };

  const isOver = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  // ── Theme tokens ───────────────────────────────────────────────
  // When a photo is set: force dark overlay; ignore theme toggle
  const pageBg = hasPhoto
    ? undefined // handled via inline backgroundImage style
    : isDark
      ? "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)"
      : "linear-gradient(135deg, #f0f4ff 0%, #dce8ff 100%)";

  const cardBg     = hasPhoto ? "rgba(0,0,0,0.45)"   : isDark ? "#16213e"  : "#ffffff";
  const cardBorder = hasPhoto ? "rgba(255,255,255,0.15)" : isDark ? "#0f3460" : "#d0ddf0";
  const textMain   = (hasPhoto || isDark) ? "#ffffff" : "#1a1a2e";
  const textMuted  = (hasPhoto || isDark) ? "#c8c8d3" : "#5a6a85";
  const accentColor = "#e94560";
  const unitBg     = hasPhoto ? "rgba(0,0,0,0.5)"    : isDark ? "#1a1a2e"  : "#f5f8ff";

  const pageStyle: React.CSSProperties = hasPhoto
    ? {
        minHeight: "100vh",
        backgroundImage: `url(${countdown.photo_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }
    : { minHeight: "100vh", background: pageBg };

  return (
    <div style={pageStyle}>
      {/* Dark overlay for photo mode */}
      {hasPhoto && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Confetti */}
      {!isOver && (
        <>
          <style>{`
            @keyframes confetti-fall{0%{transform:translateY(-100px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
            .conf{position:fixed;top:-20px;width:10px;height:10px;border-radius:2px;animation:confetti-fall linear infinite;pointer-events:none;z-index:50;}
          `}</style>
          {[...Array(12)].map((_, i) => (
            <div key={i} className="conf" style={{
              left: `${(i * 8.5) % 100}%`,
              background: ["#e94560","#FFD700","#4FC3F7","#9b59b6","#27ae60"][i % 5],
              animationDuration: `${3 + (i % 4)}s`,
              animationDelay: `${(i * 0.3) % 2}s`,
            }} />
          ))}
        </>
      )}

      {/* Content wrapper — sits above the fixed overlay */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Hero */}
        <section className="px-6 py-16 text-center">
          <div className="mx-auto max-w-2xl">
            <div className="mb-2 text-5xl">⏳</div>
            <h1 className="mb-2 text-4xl font-bold md:text-5xl" style={{ color: textMain }}>
              {countdown.event_name}
            </h1>
            {countdown.message && (
              <p className="mt-2 text-lg italic" style={{ color: accentColor }}>
                &ldquo;{countdown.message}&rdquo;
              </p>
            )}
            <p className="mt-3 text-sm" style={{ color: textMuted }}>
              {formatEventDate(countdown.event_date)}
            </p>
          </div>
        </section>

        {/* Countdown units */}
        <section className="px-6 pb-12">
          <div className="mx-auto max-w-2xl">
            {isOver ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-3xl font-bold" style={{ color: textMain }}>The day is here!</p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { label: "Days",    val: timeLeft.days },
                  { label: "Hours",   val: timeLeft.hours },
                  { label: "Minutes", val: timeLeft.minutes },
                  { label: "Seconds", val: timeLeft.seconds },
                ].map(u => (
                  <div
                    key={u.label}
                    className="flex flex-col items-center rounded-xl px-6 py-5 min-w-[110px]"
                    style={{ background: unitBg, border: `1px solid ${cardBorder}` }}
                  >
                    <span
                      className="text-6xl font-black tabular-nums leading-none"
                      style={{ color: accentColor }}
                    >
                      {String(u.val).padStart(2, "0")}
                    </span>
                    <span
                      className="mt-2 text-sm uppercase tracking-wider"
                      style={{ color: textMuted }}
                    >
                      {u.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Share + download + create */}
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-2xl space-y-4">
            {/* Share card */}
            <div
              className="rounded-2xl p-6"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <h3 className="mb-4 font-bold text-lg" style={{ color: textMain }}>
                Share this countdown!
              </h3>
              <div className="flex flex-col gap-3 sm:flex-row mb-4">
                <input
                  readOnly
                  value={pageUrl}
                  className="flex-1 rounded-lg px-4 py-2 text-sm"
                  style={{
                    background: unitBg,
                    border: `1px solid ${cardBorder}`,
                    color: textMain,
                  }}
                />
                <button
                  onClick={copyLink}
                  className="rounded-lg px-4 py-2 font-semibold text-sm text-white transition-opacity hover:opacity-90"
                  style={{ background: accentColor }}
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
              <ShareButtons
                text={`${timeLeft.days} days until ${countdown.event_name}! ⏳`}
                url={pageUrl}
                title={`Countdown to ${countdown.event_name}`}
              />
            </div>

            {/* Download card */}
            <div
              className="rounded-2xl p-6 text-center"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: accentColor }}
              >
                <span>📸</span>
                <span>{downloading ? "Generating…" : "Download Countdown Card"}</span>
              </button>
              <p className="mt-2 text-xs" style={{ color: textMuted }}>
                Saves a 1080×1080 image{countdown.photo_url ? " with your photo" : ""}
              </p>
            </div>

            {/* View count */}
            {countdown.view_count > 1 && (
              <p className="text-center text-sm" style={{ color: textMuted }}>
                👁 {countdown.view_count.toLocaleString()} people have viewed this countdown
              </p>
            )}

            {/* Create your own */}
            <div
              className="rounded-2xl p-6 text-center"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <p className="mb-4 font-medium" style={{ color: textMain }}>
                Want your own countdown?
              </p>
              <Link
                href="/countdown/create"
                className="inline-block rounded-xl px-6 py-3 font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: accentColor }}
              >
                Create My Countdown →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
