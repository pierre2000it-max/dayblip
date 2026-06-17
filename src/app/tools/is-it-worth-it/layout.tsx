import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Is It Worth It? Financial Decision Calculators | Dayblip",
  description: "Free calculators that give you a clear yes or no on life's biggest financial decisions. Buy vs rent, lease vs buy, degree vs bootcamp, gym membership, and more.",
  alternates: {
    canonical: 'https://www.dayblip.com/tools/is-it-worth-it'
  },
  openGraph: {
    title: "Is It Worth It? Financial Decision Calculators | Dayblip",
    description: "Free calculators that give you a clear yes or no on life's biggest financial decisions.",
    url: 'https://www.dayblip.com/tools/is-it-worth-it',
    images: [{
      url: 'https://www.dayblip.com/api/og/tools',
      width: 1200,
      height: 630,
      alt: 'Is It Worth It — Dayblip'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Is It Worth It? Financial Decision Calculators | Dayblip",
    description: "Free calculators that give you a clear yes or no on life's biggest financial decisions.",
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
