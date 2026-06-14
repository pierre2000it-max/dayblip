import type { Metadata } from "next"

export const metadata: Metadata = {
  alternates: { canonical: "https://www.dayblip.com/research" },
}

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
