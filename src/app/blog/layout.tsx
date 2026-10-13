import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dayblip Blog — Personal Finance and Life Tools Explained",
  description:
    "Practical articles on personal finance, career decisions, and life tools from the team behind Dayblip.com. Free to read — no signup required.",
  alternates: { canonical: "https://www.dayblip.com/blog" },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
