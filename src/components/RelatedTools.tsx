"use client"
import Link from "next/link"
import { useState } from "react"

export interface RelatedTool {
  emoji: string
  title: string
  desc: string
  href: string
}

interface Props {
  title?: string
  tools: RelatedTool[]
}

function RelatedCard({ tool }: { tool: RelatedTool }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={tool.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-start gap-3 rounded-xl border bg-[#1a1a2e] p-4 transition-colors"
      style={{ borderColor: hovered ? "#e94560" : "#0f3460" }}
    >
      <span className="text-2xl leading-none mt-0.5">{tool.emoji}</span>
      <div className="min-w-0">
        <div className="font-semibold text-white text-sm">{tool.title}</div>
        <div className="text-xs text-[#a8a8b3] mt-0.5 leading-snug">{tool.desc}</div>
      </div>
    </Link>
  )
}

export default function RelatedTools({ title = "Explore Related Tools", tools }: Props) {
  return (
    <div className="mt-10 pt-8 border-t border-[#0f3460]">
      <h2 className="mb-4 text-lg font-bold text-white">{title}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tools.map(tool => (
          <RelatedCard key={tool.href} tool={tool} />
        ))}
      </div>
    </div>
  )
}
