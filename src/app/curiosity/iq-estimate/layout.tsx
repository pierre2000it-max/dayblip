import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "IQ Estimate — Quick Intelligence Estimate Quiz | Dayblip",
  description: "Get a quick IQ estimate with this 10-question logical reasoning quiz. Pattern recognition sequences and spatial reasoning. Entertainment only. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/curiosity/iq-estimate" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
