import { TOOL_COUNT } from "@/data/tool-count"

export const DAYBLIP_ORG = {
  "@id": "https://www.dayblip.com/#organization",
  "@type": "Organization",
  name: "Dayblip",
  url: "https://www.dayblip.com",
  logo: "https://www.dayblip.com/logo.png",
  description: `Free tools for curious minds — ${TOOL_COUNT} calculators for personal finance, career, life visualization, and historical curiosity.`,
  foundingDate: "2026",
  foundingLocation: {
    "@type": "Place",
    address: { "@type": "PostalAddress", addressRegion: "WI", addressCountry: "US" },
  },
  founder: { "@type": "Person", name: "Pierre" },
  sameAs: [
    "https://twitter.com/dayblip365",
    "https://www.producthunt.com/posts/dayblip",
    "https://pinterest.com/dayblip365",
  ],
}

export const DAYBLIP_AUTHOR = {
  "@type": "Organization",
  name: "The Dayblip Team",
  url: "https://www.dayblip.com/about",
}
