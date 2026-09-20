// JSON-LD schema generators for AI search engines (Google AI Overviews, ChatGPT,
// Perplexity, etc.). These produce plain objects that are serialized into
// <script type="application/ld+json"> tags via the SchemaMarkup component.

import { DAYBLIP_AUTHOR, DAYBLIP_ORG } from "@/lib/authorSchema"

// Reference the canonical org by @id only — avoids duplicating the full entity
// on every tool/article page. Google resolves the @id back to the root layout block.
const DAYBLIP_ORG_REF = { "@id": DAYBLIP_ORG["@id"] }

export function webApplicationSchema(
  name: string,
  description: string,
  url: string,
  category: string,
  dateModified = "2026-06-13"
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory: category,
    operatingSystem: "Web",
    dateModified,
    author: DAYBLIP_AUTHOR,
    publisher: DAYBLIP_ORG_REF,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: DAYBLIP_ORG_REF,
  }
}

export function faqSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function howToSchema(
  name: string,
  description: string,
  steps: string[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
  }
}

export function articleSchema(
  headline: string,
  description: string,
  url: string,
  datePublished: string,
  dateModified?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: DAYBLIP_AUTHOR,
    publisher: DAYBLIP_ORG_REF,
  }
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
