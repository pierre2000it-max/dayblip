"use client"
import { useState } from "react"

interface ShareButtonsProps {
  text: string            // plain share message
  url: string             // full https:// URL
  title?: string          // for LinkedIn/Reddit title
  instagramText?: string  // custom text for Instagram copy
  tiktokText?: string     // custom text for TikTok caption
}

type CopyState = "idle" | "link" | "instagram" | "tiktok"

export default function ShareButtons({ text, url, title, instagramText, tiktokText }: ShareButtonsProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle")

  const et  = encodeURIComponent(text)
  const eu  = encodeURIComponent(url)
  const ett = encodeURIComponent(title ?? text)

  const igText  = instagramText ?? `${text}\n\nLink in bio → dayblip.com`
  const ttText  = tiktokText    ?? `${text}\n\nTry it free → dayblip.com`

  const doCopy = async (value: string, kind: CopyState) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const el = document.createElement("textarea")
      el.value = value
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopyState(kind)
    setTimeout(() => setCopyState("idle"), 3000)
  }

  const linkButtons = [
    {
      label: "Facebook",
      bg: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${eu}&quote=${et}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: "Post on X",
      bg: "#000000",
      href: `https://twitter.com/intent/tweet?text=${et}&url=${eu}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: "WhatsApp",
      bg: "#25D366",
      href: `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      bg: "#0A66C2",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${eu}&summary=${et}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      label: "Reddit",
      bg: "#FF4500",
      href: `https://reddit.com/submit?url=${eu}&title=${ett}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      ),
    },
  ]

  // Camera icon (Instagram)
  const cameraIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
  )

  // Music note icon (TikTok)
  const musicIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
    </svg>
  )

  // Check icon
  const checkIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )

  // Link icon
  const linkIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  )

  return (
    <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
      <h3 className="mb-1 font-bold text-white">Share Your Result</h3>
      <p className="mb-4 text-sm text-[#a8a8b3]">Surprised by this number? Share it with friends and family</p>

      {/* 4-column grid on desktop, 2 on mobile */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

        {/* Row 1: Facebook | X | WhatsApp | Instagram */}
        {linkButtons.slice(0, 3).map(btn => (
          <a
            key={btn.label}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-85"
            style={{ backgroundColor: btn.bg }}
          >
            {btn.icon}
            <span className="hidden sm:inline">{btn.label}</span>
            <span className="sm:hidden">{btn.label}</span>
          </a>
        ))}

        {/* Instagram — copy button */}
        <div className="relative">
          <button
            onClick={() => doCopy(igText, "instagram")}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white transition-colors"
            style={{ backgroundColor: copyState === "instagram" ? "#22c55e" : "#E1306C" }}
          >
            {copyState === "instagram" ? checkIcon : cameraIcon}
            <span>{copyState === "instagram" ? "Copied!" : "Instagram"}</span>
          </button>
          {copyState === "instagram" && (
            <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 z-10 w-52 rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2 text-center text-xs text-white shadow-lg">
              ✅ Copied!<br />Open Instagram → paste in Story or bio 📸
            </div>
          )}
        </div>

        {/* Row 2: LinkedIn | Reddit | TikTok | Copy Link */}
        {linkButtons.slice(3).map(btn => (
          <a
            key={btn.label}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-85"
            style={{ backgroundColor: btn.bg }}
          >
            {btn.icon}
            <span>{btn.label}</span>
          </a>
        ))}

        {/* TikTok — copy button */}
        <div className="relative">
          <button
            onClick={() => doCopy(ttText, "tiktok")}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-[13px] font-medium text-white transition-colors"
            style={{
              backgroundColor: copyState === "tiktok" ? "#22c55e" : "#010101",
              borderColor: copyState === "tiktok" ? "#22c55e" : "#69C9D0",
            }}
          >
            {copyState === "tiktok" ? checkIcon : musicIcon}
            <span>{copyState === "tiktok" ? "Copied!" : "TikTok"}</span>
          </button>
          {copyState === "tiktok" && (
            <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 z-10 w-52 rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2 text-center text-xs text-white shadow-lg">
              ✅ Copied!<br />Open TikTok → paste as video caption 🎵
            </div>
          )}
        </div>

        {/* Copy Link */}
        <button
          onClick={() => doCopy(url, "link")}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white transition-colors"
          style={{ backgroundColor: copyState === "link" ? "#22c55e" : "#4b5563" }}
        >
          {copyState === "link" ? checkIcon : linkIcon}
          <span>{copyState === "link" ? "Copied!" : "Copy Link"}</span>
        </button>
      </div>
    </div>
  )
}
