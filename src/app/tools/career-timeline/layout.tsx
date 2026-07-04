import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Career Timeline Calculator — Your Financial Future",
  description: "Project your salary growth, savings and net worth over your entire career. See when you can retire and how much you'll have.",
  keywords: "career earnings calculator, salary growth projection, when can I retire calculator",
  alternates: { canonical: "https://www.dayblip.com/tools/career-timeline" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
