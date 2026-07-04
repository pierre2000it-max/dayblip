import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What Generation Am I? Quiz — Find Out Which Generation You Really Belong To",
  description: "Take the generation quiz to find out if you are really Gen X Millennial or Gen Z based on your attitudes and experiences — not just your birth year. Free quiz.",
  keywords: "what generation am I quiz, millennial gen x gen z quiz, generational identity quiz",
  alternates: { canonical: "https://www.dayblip.com/tools/generation-quiz" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
