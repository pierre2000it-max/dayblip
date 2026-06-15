import type { Metadata } from "next"
import EmbedGallery from "./EmbedGallery"

export const metadata: Metadata = {
  title: "Free Embeddable Tools — Add Dayblip Calculators to Your Website",
  description: "Add any Dayblip calculator to your website for free. One line of HTML, no API key needed. Embed finance, life, and health tools instantly.",
  alternates: { canonical: "https://www.dayblip.com/embed" },
}

export default function EmbedPage() {
  return <EmbedGallery />
}
