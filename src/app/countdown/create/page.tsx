"use client";
import { useState, useRef } from "react";
import Link from "next/link";
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

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1200;
      let w = img.width;
      let h = img.height;
      if (w > h && w > MAX) { h = Math.round((h * MAX) / w); w = MAX; }
      else if (h >= w && h > MAX) { w = Math.round((w * MAX) / h); h = MAX; }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        blob => { if (blob) { resolve(blob); } else { reject(new Error("Compression failed")); } },
        "image/jpeg",
        0.85,
      );
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => { URL.revokeObjectURL(img.src); reject(new Error("Image load failed")); };
    img.src = URL.createObjectURL(file);
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type PageState = "form" | "success";

export default function CreateCountdownPage() {
  const [pageState, setPageState] = useState<PageState>("form");

  // Form fields
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Submit state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Success state
  const [createdSlug, setCreatedSlug] = useState("");
  const [deleteToken, setDeleteToken] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedMgmt, setCopiedMgmt] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];

  function handlePhotoChange(file: File | null) {
    if (!file) {
      setPhotoFile(null);
      setPhotoPreview(null);
      setError("");
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be under 5MB. Please choose a smaller image.");
      return;
    }
    setError("");
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = e => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0] ?? null;
    handlePhotoChange(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!eventName.trim()) { setError("Please enter an event name."); return; }
    if (!eventDate) { setError("Please pick an event date."); return; }
    if (eventDate <= today) { setError("Event date must be in the future."); return; }

    setLoading(true);
    try {
      const slug = generateSlug(eventName.trim());
      const token = crypto.randomUUID();

      // Upload photo if provided — failure is non-blocking
      let photoUrl: string | null = null;
      if (photoFile) {
        try {
          const compressed = await compressImage(photoFile);
          const filename = `${slug}-${Date.now()}.jpg`;
          const { error: uploadError } = await supabase.storage
            .from("countdown-photos")
            .upload(filename, compressed, { contentType: "image/jpeg", upsert: false });
          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from("countdown-photos")
              .getPublicUrl(filename);
            photoUrl = urlData.publicUrl;
          } else {
            console.error("Photo upload error:", uploadError);
          }
        } catch (photoErr) {
          console.error("Photo processing error:", photoErr);
        }
      }

      const { error: dbError } = await supabase.from("countdowns").insert({
        slug,
        event_name: eventName.trim(),
        event_date: eventDate,
        message: message.trim() || null,
        theme,
        photo_url: photoUrl,
        delete_token: token,
      });

      if (dbError) {
        console.error("Supabase error:", JSON.stringify(dbError));
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setCreatedSlug(slug);
      setDeleteToken(token);
      setPageState("success");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function copyToClipboard(text: string, which: "url" | "mgmt") {
    try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
    if (which === "url") {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedMgmt(true);
      setTimeout(() => setCopiedMgmt(false), 2000);
    }
  }

  const countdownUrl = `https://www.dayblip.com/countdown/${createdSlug}`;
  const mgmtUrl = `https://www.dayblip.com/countdown/${createdSlug}/delete?token=${deleteToken}`;

  // ── Success screen ─────────────────────────────────────────────
  if (pageState === "success") {
    return (
      <div
        className="min-h-screen px-4 py-16"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}
      >
        <div className="mx-auto max-w-lg">
          <div className="mb-8 text-center">
            <div className="mb-3 text-5xl">🎉</div>
            <h1 className="text-3xl font-bold text-white">Your countdown is live!</h1>
          </div>

          <div className="rounded-2xl border border-[#0f3460] bg-[#16213e] p-8 space-y-6">
            {/* Share URL */}
            <div>
              <p className="mb-2 text-sm font-semibold text-white">Share your countdown:</p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={countdownUrl}
                  className="flex-1 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-sm text-white"
                />
                <button
                  onClick={() => copyToClipboard(countdownUrl, "url")}
                  className="rounded-lg bg-[#e94560] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 whitespace-nowrap"
                >
                  {copiedUrl ? "✓ Copied!" : "Copy Link"}
                </button>
              </div>
            </div>

            {/* Management / delete link — amber warning box */}
            <div
              className="rounded-lg p-4 space-y-3"
              style={{ border: "1px solid #f59e0b", background: "rgba(245,158,11,0.08)" }}
            >
              <p className="font-semibold text-sm" style={{ color: "#f59e0b" }}>
                ⚠️ Save this — you won&apos;t see it again
              </p>
              <p className="text-sm text-[#a8a8b3]">
                To delete this countdown later, use this private link:
              </p>
              <div
                className="rounded px-3 py-2 text-xs break-all"
                style={{ background: "rgba(0,0,0,0.3)", color: "#a8a8b3" }}
              >
                {mgmtUrl}
              </div>
              <button
                onClick={() => copyToClipboard(mgmtUrl, "mgmt")}
                className="w-full rounded-lg py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: copiedMgmt ? "#22c55e" : "#f59e0b" }}
              >
                {copiedMgmt ? "✓ Copied!" : "Copy Management Link"}
              </button>
              <p className="text-xs text-[#a8a8b3]">
                We don&apos;t collect your email, so we can&apos;t send this later.
                Bookmark it now if you think you&apos;ll need it.
              </p>
            </div>

            {/* View CTA */}
            <Link
              href={`/countdown/${createdSlug}`}
              className="block w-full rounded-xl bg-[#e94560] py-4 text-center text-base font-bold text-white transition-opacity hover:opacity-90"
            >
              View My Countdown →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Creation form ──────────────────────────────────────────────
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

          {/* Photo upload */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Add a photo <span className="text-[#a8a8b3] font-normal">(optional)</span>
            </label>

            {photoPreview && (
              <div className="mb-3">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full rounded-lg object-cover"
                  style={{ maxHeight: 200 }}
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-[#a8a8b3]">
                    {photoFile?.name} · {formatBytes(photoFile?.size ?? 0)}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setPhotoFile(null); setPhotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="text-xs text-[#e94560] hover:underline"
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            )}

            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="cursor-pointer rounded-lg border-2 border-dashed border-[#0f3460] bg-[#1a1a2e] px-4 py-8 text-center transition-colors hover:border-[#e94560]/50"
            >
              <p className="text-2xl mb-2">📷</p>
              <p className="text-sm font-medium text-white">Click to upload a photo</p>
              <p className="text-xs text-[#a8a8b3] mt-1">or drag and drop here</p>
              <p className="text-xs text-[#a8a8b3] mt-2">JPG, PNG, WebP · Max 5MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={e => handlePhotoChange(e.target.files?.[0] ?? null)}
            />
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
