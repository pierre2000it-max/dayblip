import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "College Degree ROI Calculator — Was It Worth It?",
  description: "Calculate the real return on your college investment. Compare degree earnings vs student debt costs and opportunity cost. Free calculator.",
  keywords: ["college degree ROI calculator", "was college worth it calculator", "student loan ROI calculator", "is my degree worth it", "college debt calculator"],
  alternates: { canonical: "https://www.dayblip.com/tools/college-roi" },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
