// JSON-LD schema generators for AI search engines (Google AI Overviews, ChatGPT,
// Perplexity, etc.). These produce plain objects that are serialized into
// <script type="application/ld+json"> tags via the SchemaMarkup component.

export function webApplicationSchema(
  name: string,
  description: string,
  url: string,
  category: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory: category,
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: "Dayblip",
      url: "https://www.dayblip.com",
    },
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
  datePublished: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    datePublished,
    publisher: {
      "@type": "Organization",
      name: "Dayblip",
      url: "https://www.dayblip.com",
    },
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
