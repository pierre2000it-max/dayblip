import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Earthquakes Today — Live Counter",
  description: "See every earthquake happening right now worldwide. Live data from USGS updated every 60 seconds. Magnitude, location, and count of today's earthquakes. Free.",
  alternates: { canonical: "https://www.dayblip.com/world-counters/earthquakes-today" },
  openGraph: {
    title: "Earthquakes Today — Live Counter",
    description: "Live USGS earthquake data updated every 60 seconds. Today's count, largest magnitude, and recent quake list.",
    url: "https://www.dayblip.com/world-counters/earthquakes-today",
  },
  twitter: { card: "summary_large_image" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
