import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Brain Chaos Calculator — How Loud Is Your Head on a Typical Day?",
  description: "7 questions. Find out how much mental noise you are carrying and whether your current system is built for how your brain actually works. Free tool.",
  keywords: "brain chaos quiz, mental noise calculator, racing thoughts quiz, brain overload test, busy brain quiz",
  alternates: { canonical: "https://www.dayblip.com/tools/brain-chaos-calculator" },
  openGraph: {
    title: "Brain Chaos Calculator — How Loud Is Your Head on a Typical Day?",
    description: "7 questions. Find out how much mental noise you are carrying and whether your current system is built for how your brain actually works.",
    url: "https://www.dayblip.com/tools/brain-chaos-calculator",
    siteName: "Dayblip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brain Chaos Calculator — How Loud Is Your Head on a Typical Day?",
    description: "7 questions. Find out how much mental noise you are carrying and whether your current system is built for how your brain actually works.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
