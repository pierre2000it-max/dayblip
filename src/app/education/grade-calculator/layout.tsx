import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Grade Calculator — What Grade Do You Need on Your Final Exam? | Dayblip",
  description: "Calculate what grade you need on your final exam to get the grade you want in the class. Also calculate weighted grades and test scores. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/education/grade-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
