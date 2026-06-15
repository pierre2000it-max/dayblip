// Cost of Living Index data — C2ER (Council for Community & Economic Research) COLI 2024
// National average = 100. Updated annually; next update due January 2026.
// Sources: C2ER Cost of Living Index Q4 2024; Zillow Observed Rent Index Dec 2024;
//          Zillow Home Value Index Dec 2024; US Census Bureau ACS 2023 5-year estimates.

export interface CityData {
  name: string
  state: string
  slug: string
  coliIndex: number      // overall COLI, national avg = 100
  groceriesIndex: number
  housingIndex: number
  utilitiesIndex: number
  transportIndex: number
  healthcareIndex: number
  medRent1br: number     // median 1BR rent, USD/month (Zillow Dec 2024)
  medHomePrice: number   // median home value, USD (Zillow Dec 2024)
  medHouseholdIncome: number // USD/year (Census ACS 2023)
}

export const cities: CityData[] = [
  { name: "New York City", state: "NY", slug: "new-york-city", coliIndex: 187, groceriesIndex: 115, housingIndex: 340, utilitiesIndex: 131, transportIndex: 109, healthcareIndex: 103, medRent1br: 3_700, medHomePrice: 750_000, medHouseholdIncome: 70_663 },
  { name: "San Francisco", state: "CA", slug: "san-francisco", coliIndex: 225, groceriesIndex: 119, housingIndex: 435, utilitiesIndex: 125, transportIndex: 118, healthcareIndex: 108, medRent1br: 3_200, medHomePrice: 1_290_000, medHouseholdIncome: 136_689 },
  { name: "Los Angeles", state: "CA", slug: "los-angeles", coliIndex: 173, groceriesIndex: 113, housingIndex: 308, utilitiesIndex: 122, transportIndex: 115, healthcareIndex: 106, medRent1br: 2_400, medHomePrice: 880_000, medHouseholdIncome: 71_358 },
  { name: "Boston", state: "MA", slug: "boston", coliIndex: 162, groceriesIndex: 112, housingIndex: 280, utilitiesIndex: 140, transportIndex: 113, healthcareIndex: 112, medRent1br: 2_900, medHomePrice: 720_000, medHouseholdIncome: 81_744 },
  { name: "Seattle", state: "WA", slug: "seattle", coliIndex: 150, groceriesIndex: 111, housingIndex: 248, utilitiesIndex: 89, transportIndex: 114, healthcareIndex: 107, medRent1br: 2_100, medHomePrice: 755_000, medHouseholdIncome: 105_391 },
  { name: "Washington DC", state: "DC", slug: "washington-dc", coliIndex: 152, groceriesIndex: 110, housingIndex: 252, utilitiesIndex: 115, transportIndex: 112, healthcareIndex: 105, medRent1br: 2_400, medHomePrice: 640_000, medHouseholdIncome: 93_511 },
  { name: "San Jose", state: "CA", slug: "san-jose", coliIndex: 210, groceriesIndex: 118, housingIndex: 398, utilitiesIndex: 120, transportIndex: 116, healthcareIndex: 107, medRent1br: 2_850, medHomePrice: 1_380_000, medHouseholdIncome: 130_890 },
  { name: "San Diego", state: "CA", slug: "san-diego", coliIndex: 163, groceriesIndex: 113, housingIndex: 295, utilitiesIndex: 121, transportIndex: 114, healthcareIndex: 106, medRent1br: 2_350, medHomePrice: 870_000, medHouseholdIncome: 83_454 },
  { name: "Portland", state: "OR", slug: "portland", coliIndex: 133, groceriesIndex: 110, housingIndex: 198, utilitiesIndex: 86, transportIndex: 112, healthcareIndex: 105, medRent1br: 1_650, medHomePrice: 495_000, medHouseholdIncome: 82_795 },
  { name: "Sacramento", state: "CA", slug: "sacramento", coliIndex: 140, groceriesIndex: 111, housingIndex: 215, utilitiesIndex: 118, transportIndex: 113, healthcareIndex: 105, medRent1br: 1_750, medHomePrice: 480_000, medHouseholdIncome: 73_198 },
  { name: "Denver", state: "CO", slug: "denver", coliIndex: 118, groceriesIndex: 105, housingIndex: 168, utilitiesIndex: 96, transportIndex: 110, healthcareIndex: 106, medRent1br: 1_750, medHomePrice: 545_000, medHouseholdIncome: 72_173 },
  { name: "Salt Lake City", state: "UT", slug: "salt-lake-city", coliIndex: 110, groceriesIndex: 103, housingIndex: 145, utilitiesIndex: 92, transportIndex: 108, healthcareIndex: 104, medRent1br: 1_450, medHomePrice: 460_000, medHouseholdIncome: 72_408 },
  { name: "Minneapolis", state: "MN", slug: "minneapolis", coliIndex: 113, groceriesIndex: 104, housingIndex: 148, utilitiesIndex: 105, transportIndex: 108, healthcareIndex: 107, medRent1br: 1_450, medHomePrice: 335_000, medHouseholdIncome: 70_715 },
  { name: "Chicago", state: "IL", slug: "chicago", coliIndex: 107, groceriesIndex: 105, housingIndex: 130, utilitiesIndex: 112, transportIndex: 108, healthcareIndex: 103, medRent1br: 1_750, medHomePrice: 310_000, medHouseholdIncome: 62_097 },
  { name: "Milwaukee", state: "WI", slug: "milwaukee", coliIndex: 95, groceriesIndex: 101, housingIndex: 105, utilitiesIndex: 106, transportIndex: 104, healthcareIndex: 101, medRent1br: 1_050, medHomePrice: 195_000, medHouseholdIncome: 45_389 },
  { name: "Hartford", state: "CT", slug: "hartford", coliIndex: 117, groceriesIndex: 107, housingIndex: 152, utilitiesIndex: 138, transportIndex: 106, healthcareIndex: 109, medRent1br: 1_450, medHomePrice: 240_000, medHouseholdIncome: 43_900 },
  { name: "Providence", state: "RI", slug: "providence", coliIndex: 115, groceriesIndex: 106, housingIndex: 148, utilitiesIndex: 132, transportIndex: 105, healthcareIndex: 108, medRent1br: 1_650, medHomePrice: 345_000, medHouseholdIncome: 50_240 },
  { name: "Buffalo", state: "NY", slug: "buffalo", coliIndex: 88, groceriesIndex: 100, housingIndex: 85, utilitiesIndex: 119, transportIndex: 98, healthcareIndex: 102, medRent1br: 975, medHomePrice: 185_000, medHouseholdIncome: 42_071 },
  { name: "Pittsburgh", state: "PA", slug: "pittsburgh", coliIndex: 89, groceriesIndex: 101, housingIndex: 82, utilitiesIndex: 110, transportIndex: 98, healthcareIndex: 104, medRent1br: 1_100, medHomePrice: 215_000, medHouseholdIncome: 47_303 },
  { name: "Philadelphia", state: "PA", slug: "philadelphia", coliIndex: 113, groceriesIndex: 106, housingIndex: 145, utilitiesIndex: 120, transportIndex: 110, healthcareIndex: 105, medRent1br: 1_700, medHomePrice: 240_000, medHouseholdIncome: 49_127 },
  { name: "Baltimore", state: "MD", slug: "baltimore", coliIndex: 107, groceriesIndex: 105, housingIndex: 138, utilitiesIndex: 115, transportIndex: 107, healthcareIndex: 104, medRent1br: 1_550, medHomePrice: 195_000, medHouseholdIncome: 55_198 },
  { name: "Richmond", state: "VA", slug: "richmond", coliIndex: 98, groceriesIndex: 102, housingIndex: 112, utilitiesIndex: 100, transportIndex: 103, healthcareIndex: 102, medRent1br: 1_400, medHomePrice: 310_000, medHouseholdIncome: 55_766 },
  { name: "Miami", state: "FL", slug: "miami", coliIndex: 120, groceriesIndex: 108, housingIndex: 170, utilitiesIndex: 110, transportIndex: 112, healthcareIndex: 104, medRent1br: 2_350, medHomePrice: 595_000, medHouseholdIncome: 47_861 },
  { name: "Tampa", state: "FL", slug: "tampa", coliIndex: 104, groceriesIndex: 105, housingIndex: 128, utilitiesIndex: 108, transportIndex: 110, healthcareIndex: 103, medRent1br: 1_750, medHomePrice: 360_000, medHouseholdIncome: 57_906 },
  { name: "Orlando", state: "FL", slug: "orlando", coliIndex: 102, groceriesIndex: 104, housingIndex: 122, utilitiesIndex: 109, transportIndex: 109, healthcareIndex: 103, medRent1br: 1_700, medHomePrice: 345_000, medHouseholdIncome: 53_052 },
  { name: "Jacksonville", state: "FL", slug: "jacksonville", coliIndex: 95, groceriesIndex: 103, housingIndex: 108, utilitiesIndex: 108, transportIndex: 106, healthcareIndex: 102, medRent1br: 1_500, medHomePrice: 290_000, medHouseholdIncome: 56_763 },
  { name: "New Orleans", state: "LA", slug: "new-orleans", coliIndex: 98, groceriesIndex: 103, housingIndex: 112, utilitiesIndex: 113, transportIndex: 102, healthcareIndex: 103, medRent1br: 1_400, medHomePrice: 250_000, medHouseholdIncome: 45_615 },
  { name: "Atlanta", state: "GA", slug: "atlanta", coliIndex: 103, groceriesIndex: 104, housingIndex: 128, utilitiesIndex: 108, transportIndex: 109, healthcareIndex: 103, medRent1br: 1_850, medHomePrice: 390_000, medHouseholdIncome: 64_179 },
  { name: "Charlotte", state: "NC", slug: "charlotte", coliIndex: 97, groceriesIndex: 103, housingIndex: 112, utilitiesIndex: 100, transportIndex: 106, healthcareIndex: 102, medRent1br: 1_600, medHomePrice: 370_000, medHouseholdIncome: 65_359 },
  { name: "Raleigh", state: "NC", slug: "raleigh", coliIndex: 105, groceriesIndex: 104, housingIndex: 132, utilitiesIndex: 101, transportIndex: 107, healthcareIndex: 102, medRent1br: 1_600, medHomePrice: 390_000, medHouseholdIncome: 72_428 },
  { name: "Nashville", state: "TN", slug: "nashville", coliIndex: 108, groceriesIndex: 105, housingIndex: 140, utilitiesIndex: 104, transportIndex: 108, healthcareIndex: 103, medRent1br: 1_750, medHomePrice: 415_000, medHouseholdIncome: 65_734 },
  { name: "Memphis", state: "TN", slug: "memphis", coliIndex: 83, groceriesIndex: 100, housingIndex: 75, utilitiesIndex: 105, transportIndex: 100, healthcareIndex: 100, medRent1br: 1_050, medHomePrice: 175_000, medHouseholdIncome: 42_982 },
  { name: "Louisville", state: "KY", slug: "louisville", coliIndex: 87, groceriesIndex: 101, housingIndex: 82, utilitiesIndex: 105, transportIndex: 100, healthcareIndex: 102, medRent1br: 1_100, medHomePrice: 210_000, medHouseholdIncome: 52_439 },
  { name: "Columbus", state: "OH", slug: "columbus", coliIndex: 90, groceriesIndex: 101, housingIndex: 90, utilitiesIndex: 106, transportIndex: 101, healthcareIndex: 101, medRent1br: 1_200, medHomePrice: 245_000, medHouseholdIncome: 56_776 },
  { name: "Cleveland", state: "OH", slug: "cleveland", coliIndex: 85, groceriesIndex: 100, housingIndex: 75, utilitiesIndex: 108, transportIndex: 99, healthcareIndex: 101, medRent1br: 975, medHomePrice: 130_000, medHouseholdIncome: 34_981 },
  { name: "Detroit", state: "MI", slug: "detroit", coliIndex: 88, groceriesIndex: 101, housingIndex: 85, utilitiesIndex: 112, transportIndex: 101, healthcareIndex: 102, medRent1br: 1_100, medHomePrice: 90_000, medHouseholdIncome: 34_762 },
  { name: "Indianapolis", state: "IN", slug: "indianapolis", coliIndex: 90, groceriesIndex: 100, housingIndex: 90, utilitiesIndex: 104, transportIndex: 101, healthcareIndex: 101, medRent1br: 1_100, medHomePrice: 220_000, medHouseholdIncome: 54_261 },
  { name: "Kansas City", state: "MO", slug: "kansas-city", coliIndex: 90, groceriesIndex: 101, housingIndex: 90, utilitiesIndex: 105, transportIndex: 102, healthcareIndex: 101, medRent1br: 1_150, medHomePrice: 240_000, medHouseholdIncome: 58_649 },
  { name: "St. Louis", state: "MO", slug: "st-louis", coliIndex: 88, groceriesIndex: 101, housingIndex: 80, utilitiesIndex: 107, transportIndex: 100, healthcareIndex: 102, medRent1br: 1_050, medHomePrice: 205_000, medHouseholdIncome: 48_438 },
  { name: "Omaha", state: "NE", slug: "omaha", coliIndex: 91, groceriesIndex: 101, housingIndex: 88, utilitiesIndex: 104, transportIndex: 102, healthcareIndex: 101, medRent1br: 1_100, medHomePrice: 240_000, medHouseholdIncome: 60_687 },
  { name: "Dallas", state: "TX", slug: "dallas", coliIndex: 103, groceriesIndex: 104, housingIndex: 125, utilitiesIndex: 110, transportIndex: 107, healthcareIndex: 102, medRent1br: 1_550, medHomePrice: 320_000, medHouseholdIncome: 57_537 },
  { name: "Houston", state: "TX", slug: "houston", coliIndex: 95, groceriesIndex: 103, housingIndex: 105, utilitiesIndex: 112, transportIndex: 104, healthcareIndex: 101, medRent1br: 1_350, medHomePrice: 265_000, medHouseholdIncome: 56_019 },
  { name: "Austin", state: "TX", slug: "austin", coliIndex: 119, groceriesIndex: 106, housingIndex: 168, utilitiesIndex: 110, transportIndex: 108, healthcareIndex: 103, medRent1br: 1_800, medHomePrice: 510_000, medHouseholdIncome: 80_954 },
  { name: "San Antonio", state: "TX", slug: "san-antonio", coliIndex: 91, groceriesIndex: 102, housingIndex: 92, utilitiesIndex: 110, transportIndex: 103, healthcareIndex: 101, medRent1br: 1_250, medHomePrice: 245_000, medHouseholdIncome: 54_091 },
  { name: "El Paso", state: "TX", slug: "el-paso", coliIndex: 82, groceriesIndex: 99, housingIndex: 70, utilitiesIndex: 106, transportIndex: 99, healthcareIndex: 99, medRent1br: 950, medHomePrice: 185_000, medHouseholdIncome: 47_568 },
  { name: "Phoenix", state: "AZ", slug: "phoenix", coliIndex: 103, groceriesIndex: 104, housingIndex: 128, utilitiesIndex: 110, transportIndex: 107, healthcareIndex: 103, medRent1br: 1_600, medHomePrice: 385_000, medHouseholdIncome: 64_882 },
  { name: "Tucson", state: "AZ", slug: "tucson", coliIndex: 96, groceriesIndex: 102, housingIndex: 108, utilitiesIndex: 107, transportIndex: 104, healthcareIndex: 102, medRent1br: 1_250, medHomePrice: 285_000, medHouseholdIncome: 48_393 },
  { name: "Albuquerque", state: "NM", slug: "albuquerque", coliIndex: 93, groceriesIndex: 101, housingIndex: 98, utilitiesIndex: 100, transportIndex: 103, healthcareIndex: 101, medRent1br: 1_150, medHomePrice: 270_000, medHouseholdIncome: 52_338 },
  { name: "Las Vegas", state: "NV", slug: "las-vegas", coliIndex: 111, groceriesIndex: 106, housingIndex: 148, utilitiesIndex: 108, transportIndex: 109, healthcareIndex: 104, medRent1br: 1_550, medHomePrice: 400_000, medHouseholdIncome: 60_266 },
  { name: "Oklahoma City", state: "OK", slug: "oklahoma-city", coliIndex: 86, groceriesIndex: 100, housingIndex: 78, utilitiesIndex: 107, transportIndex: 100, healthcareIndex: 100, medRent1br: 1_050, medHomePrice: 215_000, medHouseholdIncome: 56_199 },
]
