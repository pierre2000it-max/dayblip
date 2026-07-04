"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 55);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export default function CreateCountdownPage() {
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!eventName.trim()) { setError("Please enter an event name."); return; }
    if (!eventDate) { setError("Please pick an event date."); return; }
    if (eventDate <= today) { setError("Event date must be in the future."); return; }

    setLoading(true);
    try {
      const slug = generateSlug(eventName.trim());
      const { error: dbError } = await supabase.from("countdowns").insert({
        slug,
        event_name: eventName.trim(),
        event_date: eventDate,
        message: message.trim() || null,
        theme,
      });

      if (dbError) throw dbError;
      router.push(`/countdown/${slug}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-[#1a1a2e] px-4 py-16"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}
    >
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">⏳</div>
          <h1 className="text-3xl font-bold text-white">Create Your Countdown</h1>
          <p className="mt-2 text-[#a8a8b3]">Fill in the details below — takes under a minute.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#0f3460] bg-[#16213e] p-8 space-y-6"
        >
          {/* Event name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Event name <span className="text-[#e94560]">*</span>
            </label>
            <input
              type="text"
              value={eventName}
              onChange={e => setEventName(e.target.value)}
              placeholder="e.g. Our Wedding Day"
              maxLength={80}
              className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white placeholder:text-[#a8a8b3]/50 focus:border-[#e94560] focus:outline-none"
            />
          </div>

          {/* Event date */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Event date <span className="text-[#e94560]">*</span>
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={e => setEventDate(e.target.value)}
              min={today}
              className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
            />
          </div>

          {/* Message */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Personal message <span className="text-[#a8a8b3] font-normal">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="e.g. Can't wait to celebrate with you all! 🎉"
              maxLength={200}
              rows={3}
              className="w-full resize-none rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white placeholder:text-[#a8a8b3]/50 focus:border-[#e94560] focus:outline-none"
            />
            <p className="mt-1 text-right text-xs text-[#a8a8b3]">{message.length}/200</p>
          </div>

          {/* Theme */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-white">Theme</label>
            <div className="flex gap-4">
              {(["dark", "light"] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`flex-1 rounded-lg border py-3 text-sm font-semibold capitalize transition-colors ${
                    theme === t
                      ? "border-[#e94560] bg-[#e94560]/10 text-white"
                      : "border-[#0f3460] text-[#a8a8b3] hover:border-[#a8a8b3]"
                  }`}
                >
                  {t === "dark" ? "🌙 Dark" : "☀️ Light"}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-[#e94560]/10 border border-[#e94560]/30 px-4 py-3 text-sm text-[#e94560]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#e94560] py-4 text-base font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create My Countdown →"}
          </button>
        </form>
      </div>
    </div>
  );
}
