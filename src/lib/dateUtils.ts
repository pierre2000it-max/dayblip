import { differenceInDays, differenceInYears, format, parseISO } from "date-fns";

/** Days remaining from today until a future date */
export function daysUntil(target: Date): number {
  return Math.max(0, differenceInDays(target, new Date()));
}

/** Full years elapsed since a past date (i.e. current age) */
export function ageInYears(birthDate: Date): number {
  return differenceInYears(new Date(), birthDate);
}

/** Days between any two dates (absolute value) */
export function daysBetween(a: Date, b: Date): number {
  return Math.abs(differenceInDays(a, b));
}

/** Format a date as "January 1, 2025" */
export function formatLong(date: Date): string {
  return format(date, "MMMM d, yyyy");
}

/** Parse an ISO string safely, returns null on failure */
export function safeParse(iso: string): Date | null {
  try {
    return parseISO(iso);
  } catch {
    return null;
  }
}
