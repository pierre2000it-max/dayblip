import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Is It Worth It to Cut the Cord? Cable vs Streaming Calculator',
  description: 'Compare your total monthly streaming bill to cable TV. Find out if cutting the cord actually saves money when you add up all your subscriptions. Free.',
  alternates: { canonical: 'https://www.dayblip.com/tools/is-it-worth-it/cable-vs-streaming' },
  openGraph: {
    title: 'Cable vs Streaming Cost Calculator',
    description: 'Is cutting the cord worth it? Add up all your streaming services and compare to cable.',
    url: 'https://www.dayblip.com/tools/is-it-worth-it/cable-vs-streaming',
    images: [{ url: 'https://www.dayblip.com/api/og/tools', width: 1200, height: 630, alt: 'Cable vs Streaming Calculator' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cable vs Streaming Cost Calculator',
    description: 'Is cutting the cord worth it? Add up all your streaming services and compare to cable.',
    images: ['https://www.dayblip.com/api/og/tools']
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
