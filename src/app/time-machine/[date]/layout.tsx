import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params
  const parts = date.split("-")
  const year = parts[0] ?? ""
  const month = parts[1] ?? ""
  const day = parts[2] ?? ""
  const months = ["","January","February","March","April","May","June","July","August","September","October","November","December"]
  const monthName = months[parseInt(month, 10)] ?? month
  const label = `${monthName} ${parseInt(day, 10)}, ${year}`
  return {
    title: `What Happened on ${label}? — Historical Time Machine | Dayblip`,
    description: `See what life was like on ${label}. Gas prices, food costs, world events, #1 songs and more. Free historical date lookup.`,
    alternates: { canonical: `https://www.dayblip.com/time-machine/${date}` },
    openGraph: {
      title: `${label} — Historical Time Machine | Dayblip`,
      description: `Travel back to ${label} and see what the world looked like.`,
      url: `https://www.dayblip.com/time-machine/${date}`,
    },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
