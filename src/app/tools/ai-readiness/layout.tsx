import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Business Readiness Assessment — Free Score Tool",
  description: "Answer 8 questions and get a free AI readiness score for your small business. No signup, no email. See your biggest automation opportunity instantly.",
  alternates: { canonical: "https://www.dayblip.com/tools/ai-readiness" },
  openGraph: {
    title: "AI Business Readiness Assessment — Free Score Tool",
    description: "Answer 8 questions and get a free AI readiness score for your small business. No signup, no email. See your biggest automation opportunity instantly.",
    url: "https://www.dayblip.com/tools/ai-readiness",
    type: "website",
    images: [
      {
        url: "https://www.dayblip.com/api/og?title=AI+Business+Readiness+Score&emoji=🤖&subtitle=How+ready+is+your+business+for+AI%3F",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Business Readiness Assessment — Free Score Tool",
    description: "Answer 8 questions and get a free AI readiness score for your small business. No signup, no email. See your biggest automation opportunity instantly.",
    images: ["https://www.dayblip.com/api/og?title=AI+Business+Readiness+Score&emoji=🤖&subtitle=How+ready+is+your+business+for+AI%3F"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
