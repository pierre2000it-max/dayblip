import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What Generation Are You Really? Quiz | Dayblip",
  description: "Take our 10-question quiz to find your true generational identity. Are you really the generation you think?",
  keywords: "what generation am I quiz, millennial gen x gen z quiz, generational identity quiz",
  alternates: { canonical: "https://www.dayblip.com/tools/generation-quiz" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
