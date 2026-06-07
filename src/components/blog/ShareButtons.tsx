"use client"

import { useState } from "react"

interface Props {
  shareText: string
  url: string
}

export default function ShareButtons({ shareText, url }: Props) {
  const [copied, setCopied] = useState(false)

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback silent
    }
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e2d4a] text-[#e94560] text-sm font-medium hover:bg-[#e94560] hover:text-white transition-all duration-200"
      >
        Share on X
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e2d4a] text-[#e94560] text-sm font-medium hover:bg-[#e94560] hover:text-white transition-all duration-200"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  )
}
