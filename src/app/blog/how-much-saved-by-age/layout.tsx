import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How Much Should You Have Saved by Age? The Benchmarks Explained | Dayblip",
  description:
    "The savings benchmarks by age explained — where they come from, what they assume, and how to interpret them for your actual situation.",
  alternates: { canonical: "https://www.dayblip.com/blog/how-much-saved-by-age" },
  openGraph: {
    title: "How Much Should You Have Saved by Age? The Benchmarks and Why They Exist",
    description: "The 1x salary by 30, 10x by 67 benchmarks come from specific research. The Fed found median retirement savings for 55-64 year olds was $185,000.",
    url: "https://www.dayblip.com/blog/how-much-saved-by-age",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
