import type { Metadata } from "next"
import EmbedGallery from "./EmbedGallery"

export const metadata: Metadata = {
  title: "Free Embeddable Tools — Add Dayblip Calculators to Your Website",
  description: "Add any Dayblip calculator to your website with one line of HTML. 10 free embeddable tools including compound interest, mortgage, take-home pay, age calculator and more.",
  alternates: { canonical: "https://www.dayblip.com/embed" },
}

export default function EmbedPage() {
  return <EmbedGallery />
}
