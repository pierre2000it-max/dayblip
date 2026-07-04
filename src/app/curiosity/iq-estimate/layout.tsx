import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "IQ Estimate — Quick Intelligence Estimate Quiz",
  description: "Get a quick IQ estimate with this 10-question logical reasoning quiz. Pattern recognition, spatial reasoning, and logic. Free tool.",
  alternates: { canonical: "https://www.dayblip.com/curiosity/iq-estimate" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
