import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Unit Converter — Length Weight Temperature Volume and More",
  description: "Convert between metric and imperial units instantly. Length weight temperature volume speed area and cooking measurements. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/tools/unit-converter" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
