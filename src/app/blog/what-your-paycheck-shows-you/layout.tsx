import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What Your Paycheck Actually Shows You | Dayblip",
  description:
    "Your pay stub contains more financial information than most people realize. Understanding every line tells you your true tax rate and what your benefits actually cost.",
  alternates: { canonical: "https://www.dayblip.com/blog/what-your-paycheck-shows-you" },
  openGraph: {
    title: "What Your Paycheck Actually Shows You (And the Four Numbers Most People Never Look At)",
    description: "Most people check the deposit amount and stop there. The rest of the stub contains information that directly affects how you should manage your money.",
    url: "https://www.dayblip.com/blog/what-your-paycheck-shows-you",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
