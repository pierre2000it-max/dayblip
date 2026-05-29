// ── Date calculation helpers (server-safe, no browser APIs) ──────────────────

function getEaster(year: number): Date {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day   = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function getThanksgiving(year: number): Date {
  const nov1 = new Date(year, 10, 1);
  const daysToFirstThu = (4 - nov1.getDay() + 7) % 7;
  return new Date(year, 10, 1 + daysToFirstThu + 21);
}

function getBlackFriday(year: number): Date {
  const tg = getThanksgiving(year);
  return new Date(tg.getFullYear(), tg.getMonth(), tg.getDate() + 1);
}

function getMothersDay(year: number): Date {
  const may1 = new Date(year, 4, 1);
  const daysToFirstSun = (7 - may1.getDay()) % 7;
  return new Date(year, 4, 1 + daysToFirstSun + 7);
}

function getHolidayDate(date: string, year: number): Date {
  switch (date) {
    case "dynamic-thanksgiving": return getThanksgiving(year);
    case "dynamic-easter":       return getEaster(year);
    case "dynamic-blackfriday":  return getBlackFriday(year);
    case "dynamic-mothersday":   return getMothersDay(year);
    default: {
      const parts = date.split("-").map(Number);
      return new Date(year, parts[0] - 1, parts[1]);
    }
  }
}

export function getNextHolidayDate(date: string): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  let target = getHolidayDate(date, year);
  target.setHours(0, 0, 0, 0);
  if (target.getTime() <= today.getTime()) {
    target = getHolidayDate(date, year + 1);
    target.setHours(0, 0, 0, 0);
  }
  return target;
}

// ── Schema generators ─────────────────────────────────────────────────────────

export function generateCountdownSchema(holiday: {
  name: string;
  description: string;
  date: string;
}) {
  const nextDate = getNextHolidayDate(holiday.date);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `${holiday.name} ${nextDate.getFullYear()}`,
    "startDate": nextDate.toISOString().split("T")[0],
    "description": holiday.description,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "organizer": { "@type": "Organization", "name": "Dayblip", "url": "https://dayblip.com" },
  };
}

export function generateBornInSchema(year: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Born in ${year}: What Was The World Like?`,
    "description": `Discover what the world looked like in ${year}. The #1 song, top movies, gas prices and major events from the year you were born.`,
    "datePublished": `${year}-01-01`,
    "author":    { "@type": "Organization", "name": "Dayblip", "url": "https://dayblip.com" },
    "publisher": { "@type": "Organization", "name": "Dayblip", "url": "https://dayblip.com" },
  };
}

export function generateOnThisDaySchema(formattedDate: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `On This Day: ${formattedDate} in History`,
    "description": description,
    "author":    { "@type": "Organization", "name": "Dayblip", "url": "https://dayblip.com" },
    "publisher": { "@type": "Organization", "name": "Dayblip", "url": "https://dayblip.com" },
  };
}

export function generateToolSchema(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "author": { "@type": "Organization", "name": "Dayblip", "url": "https://dayblip.com" },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Dayblip",
    "url": "https://dayblip.com",
    "description": "Free countdown timers, date calculators and curiosity tools",
    "sameAs": [],
  };
}

export function generateWebPageSchema(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": name,
    "description": description,
    "url": url,
    "author": { "@type": "Organization", "name": "Dayblip", "url": "https://dayblip.com" },
  };
}
