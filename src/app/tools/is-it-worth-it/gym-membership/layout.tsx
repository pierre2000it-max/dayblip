import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Is a Gym Membership Worth It? Cost Per Visit Calculator | Dayblip',
  description: 'Calculate your true cost per gym visit and find out if your membership is worth it. Compare gym vs home gym investment. Free — no signup required.',
  alternates: { canonical: 'https://www.dayblip.com/tools/is-it-worth-it/gym-membership' },
  openGraph: {
    title: 'Is a Gym Membership Worth It? | Dayblip',
    description: 'Calculate your real cost per gym visit. Find your breakeven visits per month.',
    url: 'https://www.dayblip.com/tools/is-it-worth-it/gym-membership',
    images: [{ url: 'https://www.dayblip.com/api/og/tools', width: 1200, height: 630, alt: 'Is a Gym Membership Worth It?' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Is a Gym Membership Worth It? | Dayblip',
    description: 'Calculate your real cost per gym visit. Find your breakeven visits per month.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
