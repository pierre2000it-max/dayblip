/** Minutes to decimal hours, rounded to 2 places (payroll convention). */
export function minutesToDecimal(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100
}

export function hoursMinutesToDecimal(hours: number, minutes: number): number {
  return Math.round((hours + minutes / 60) * 100) / 100
}

export function decimalToHoursMinutes(decimal: number): { hours: number; minutes: number } {
  const total = Math.round(decimal * 60)
  return { hours: Math.floor(total / 60), minutes: total % 60 }
}
