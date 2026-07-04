import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How to Read Your W-2 Form — Every Box Explained in Plain English",
  description:
    "Box 1 is not what you earned. Box 3 is not the same as Box 1. Box 12 has 30+ codes most people ignore. Here is every W-2 box explained clearly using an example.",
  alternates: { canonical: "https://www.dayblip.com/blog/how-to-read-your-w2" },
  openGraph: {
    title: "How to Read Your W-2 Form — Every Box Explained",
    description: "Box 1 is not your salary. Box 3 is often different from Box 1. Box 12 has 30+ codes. Every W-2 box explained in plain English.",
    url: "https://www.dayblip.com/blog/how-to-read-your-w2",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
