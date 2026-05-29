import type { MetadataRoute } from "next";
import holidaysData from "@/data/holidays.json";
import onThisDayData from "@/data/onThisDay.json";

const BASE = "https://dayblip.com";

const holidays = holidaysData as Array<{ slug: string }>;
const otdKeys  = Object.keys(onThisDayData as Record<string, unknown>);

export default function sitemap(): MetadataRoute.Sitemap {
  const countdownUrls: MetadataRoute.Sitemap = holidays.map((h) => ({
    url:             `${BASE}/days-until/${h.slug}`,
    lastModified:    new Date(),
    changeFrequency: "daily",
    priority:        0.9,
  }));

  const bornInUrls: MetadataRoute.Sitemap = Array.from({ length: 31 }, (_, i) => ({
    url:             `${BASE}/born-in/${1980 + i}`,
    lastModified:    new Date(),
    changeFrequency: "monthly",
    priority:        0.8,
  }));

  const otdUrls: MetadataRoute.Sitemap = otdKeys.map((key) => ({
    url:             `${BASE}/on-this-day/${key}`,
    lastModified:    new Date(),
    changeFrequency: "monthly",
    priority:        0.8,
  }));

  return [
    { url: BASE,                         lastModified: new Date(), changeFrequency: "daily",   priority: 1   },
    { url: `${BASE}/age-calculator`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/date-calculator`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/days-between`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/privacy`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/terms`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/contact`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ...countdownUrls,
    ...bornInUrls,
    ...otdUrls,
  ];
}
