import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Grade Calculator: What Do You Need on the Final?",
  description: "Calculate what grade you need on your final exam to get the grade you want in the class. Also calculate weighted grades and test scores. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/education/grade-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
