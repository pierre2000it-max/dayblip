import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Smoking Cost Calculator — Financial Cost of Smoking | Dayblip",
  description: "Calculate the true financial cost of smoking and what investing instead could build. Shows future value if you quit today. Educational calculator only.",
  alternates: { canonical: "https://www.dayblip.com/curiosity/smoking-investment" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
