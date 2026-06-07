"use client"
import Link from "next/link"
import { useState } from "react"

export interface Crumb {
  label: string
  href?: string
}

function CrumbLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ color: hovered ? "#e94560" : "#a8a8b3" }}
      className="transition-colors hover:underline"
    >
      {label}
    </Link>
  )
}

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-[#a8a8b3]">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-[#0f3460] select-none">/</span>}
          {crumb.href ? (
            <CrumbLink href={crumb.href} label={crumb.label} />
          ) : (
            <span className="text-white font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
