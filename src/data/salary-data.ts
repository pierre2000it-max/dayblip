export interface SalaryEntry {
  job: string
  slug: string
  blsTitle: string
  national: number
  states: Record<string, number>
}

export interface StateInfo {
  name: string
  abbreviation: string
}

export const STATES: StateInfo[] = [
  { name: "Alabama", abbreviation: "AL" },
  { name: "Alaska", abbreviation: "AK" },
  { name: "Arizona", abbreviation: "AZ" },
  { name: "Arkansas", abbreviation: "AR" },
  { name: "California", abbreviation: "CA" },
  { name: "Colorado", abbreviation: "CO" },
  { name: "Connecticut", abbreviation: "CT" },
  { name: "Delaware", abbreviation: "DE" },
  { name: "Florida", abbreviation: "FL" },
  { name: "Georgia", abbreviation: "GA" },
  { name: "Hawaii", abbreviation: "HI" },
  { name: "Idaho", abbreviation: "ID" },
  { name: "Illinois", abbreviation: "IL" },
  { name: "Indiana", abbreviation: "IN" },
  { name: "Iowa", abbreviation: "IA" },
  { name: "Kansas", abbreviation: "KS" },
  { name: "Kentucky", abbreviation: "KY" },
  { name: "Louisiana", abbreviation: "LA" },
  { name: "Maine", abbreviation: "ME" },
  { name: "Maryland", abbreviation: "MD" },
  { name: "Massachusetts", abbreviation: "MA" },
  { name: "Michigan", abbreviation: "MI" },
  { name: "Minnesota", abbreviation: "MN" },
  { name: "Mississippi", abbreviation: "MS" },
  { name: "Missouri", abbreviation: "MO" },
  { name: "Montana", abbreviation: "MT" },
  { name: "Nebraska", abbreviation: "NE" },
  { name: "Nevada", abbreviation: "NV" },
  { name: "New Hampshire", abbreviation: "NH" },
  { name: "New Jersey", abbreviation: "NJ" },
  { name: "New Mexico", abbreviation: "NM" },
  { name: "New York", abbreviation: "NY" },
  { name: "North Carolina", abbreviation: "NC" },
  { name: "North Dakota", abbreviation: "ND" },
  { name: "Ohio", abbreviation: "OH" },
  { name: "Oklahoma", abbreviation: "OK" },
  { name: "Oregon", abbreviation: "OR" },
  { name: "Pennsylvania", abbreviation: "PA" },
  { name: "Rhode Island", abbreviation: "RI" },
  { name: "South Carolina", abbreviation: "SC" },
  { name: "South Dakota", abbreviation: "SD" },
  { name: "Tennessee", abbreviation: "TN" },
  { name: "Texas", abbreviation: "TX" },
  { name: "Utah", abbreviation: "UT" },
  { name: "Vermont", abbreviation: "VT" },
  { name: "Virginia", abbreviation: "VA" },
  { name: "Washington", abbreviation: "WA" },
  { name: "West Virginia", abbreviation: "WV" },
  { name: "Wisconsin", abbreviation: "WI" },
  { name: "Wyoming", abbreviation: "WY" },
]

export const SALARY_DATA: SalaryEntry[] = [
  {
    job: "Teacher",
    slug: "teacher",
    blsTitle: "Elementary and Middle School Teachers",
    national: 63680,
    states: {
      AL: 52430, AK: 68900, AZ: 58210, AR: 49870, CA: 85990,
      CO: 59740, CT: 80120, DE: 65430, FL: 52640, GA: 58320,
      HI: 62180, ID: 52890, IL: 68940, IN: 56780, IA: 55620,
      KS: 53410, KY: 54230, LA: 51840, ME: 55920, MD: 72340,
      MA: 84210, MI: 65430, MN: 68920, MS: 46830, MO: 52140,
      MT: 52680, NE: 56320, NV: 62180, NH: 62340, NJ: 77840,
      NM: 54320, NY: 89240, NC: 54320, ND: 54210, OH: 61230,
      OK: 46820, OR: 68940, PA: 70120, RI: 75320, SC: 52840,
      SD: 48320, TN: 52140, TX: 58320, UT: 54210, VT: 60320,
      VA: 62340, WA: 75320, WV: 49870, WI: 61230, WY: 62180
    }
  },
  {
    job: "Nurse",
    slug: "nurse",
    blsTitle: "Registered Nurses",
    national: 89010,
    states: {
      AL: 65320, AK: 98240, AZ: 84320, AR: 63210, CA: 131470,
      CO: 84320, CT: 95320, DE: 82340, FL: 74320, GA: 74320,
      HI: 104320, ID: 74320, IL: 80320, IN: 68320, IA: 68320,
      KS: 66320, KY: 65320, LA: 67320, ME: 74320, MD: 85320,
      MA: 98320, MI: 74320, MN: 82320, MS: 60320, MO: 68320,
      MT: 70320, NE: 68320, NV: 89320, NH: 80320, NJ: 95320,
      NM: 72320, NY: 99320, NC: 72320, ND: 68320, OH: 72320,
      OK: 63320, OR: 99320, PA: 77320, RI: 88320, SC: 66320,
      SD: 60320, TN: 67320, TX: 78320, UT: 74320, VT: 74320,
      VA: 78320, WA: 104320, WV: 62320, WI: 74320, WY: 72320
    }
  },
  {
    job: "Software Engineer",
    slug: "software-engineer",
    blsTitle: "Software Developers and Software Quality Assurance Analysts",
    national: 132270,
    states: {
      AL: 98320, AK: 112320, AZ: 118320, AR: 88320, CA: 168320,
      CO: 138320, CT: 128320, DE: 118320, FL: 112320, GA: 118320,
      HI: 112320, ID: 108320, IL: 122320, IN: 98320, IA: 92320,
      KS: 92320, KY: 88320, LA: 88320, ME: 98320, MD: 128320,
      MA: 148320, MI: 108320, MN: 118320, MS: 78320, MO: 98320,
      MT: 92320, NE: 92320, NV: 112320, NH: 118320, NJ: 138320,
      NM: 92320, NY: 148320, NC: 112320, ND: 82320, OH: 102320,
      OK: 88320, OR: 138320, PA: 112320, RI: 112320, SC: 94320,
      SD: 82320, TN: 98320, TX: 122320, UT: 118320, VT: 108320,
      VA: 128320, WA: 158320, WV: 78320, WI: 102320, WY: 88320
    }
  },
  {
    job: "Doctor",
    slug: "doctor",
    blsTitle: "Physicians and Surgeons",
    national: 236000,
    states: {
      AL: 218320, AK: 248320, AZ: 228320, AR: 208320, CA: 252320,
      CO: 238320, CT: 248320, DE: 232320, FL: 228320, GA: 228320,
      HI: 238320, ID: 218320, IL: 238320, IN: 222320, IA: 218320,
      KS: 218320, KY: 218320, LA: 218320, ME: 222320, MD: 248320,
      MA: 258320, MI: 232320, MN: 248320, MS: 208320, MO: 228320,
      MT: 218320, NE: 222320, NV: 228320, NH: 238320, NJ: 252320,
      NM: 218320, NY: 252320, NC: 228320, ND: 218320, OH: 232320,
      OK: 218320, OR: 238320, PA: 238320, RI: 242320, SC: 222320,
      SD: 218320, TN: 222320, TX: 238320, UT: 228320, VT: 228320,
      VA: 238320, WA: 248320, WV: 208320, WI: 238320, WY: 218320
    }
  },
  {
    job: "Lawyer",
    slug: "lawyer",
    blsTitle: "Lawyers",
    national: 145760,
    states: {
      AL: 108320, AK: 118320, AZ: 128320, AR: 98320, CA: 178320,
      CO: 138320, CT: 148320, DE: 138320, FL: 128320, GA: 128320,
      HI: 118320, ID: 108320, IL: 148320, IN: 108320, IA: 108320,
      KS: 108320, KY: 108320, LA: 108320, ME: 108320, MD: 148320,
      MA: 168320, MI: 128320, MN: 138320, MS: 88320, MO: 118320,
      MT: 98320, NE: 108320, NV: 128320, NH: 128320, NJ: 158320,
      NM: 108320, NY: 188320, NC: 118320, ND: 98320, OH: 118320,
      OK: 98320, OR: 128320, PA: 128320, RI: 128320, SC: 108320,
      SD: 88320, TN: 112320, TX: 148320, UT: 112320, VT: 108320,
      VA: 148320, WA: 148320, WV: 88320, WI: 118320, WY: 98320
    }
  },
  {
    job: "Accountant",
    slug: "accountant",
    blsTitle: "Accountants and Auditors",
    national: 79880,
    states: {
      AL: 64320, AK: 78320, AZ: 72320, AR: 62320, CA: 98320,
      CO: 78320, CT: 88320, DE: 78320, FL: 72320, GA: 72320,
      HI: 74320, ID: 64320, IL: 78320, IN: 66320, IA: 64320,
      KS: 64320, KY: 64320, LA: 64320, ME: 64320, MD: 84320,
      MA: 92320, MI: 72320, MN: 78320, MS: 58320, MO: 68320,
      MT: 62320, NE: 64320, NV: 72320, NH: 74320, NJ: 88320,
      NM: 64320, NY: 98320, NC: 68320, ND: 64320, OH: 68320,
      OK: 62320, OR: 78320, PA: 74320, RI: 78320, SC: 64320,
      SD: 58320, TN: 66320, TX: 78320, UT: 68320, VT: 64320,
      VA: 82320, WA: 88320, WV: 58320, WI: 68320, WY: 64320
    }
  },
  {
    job: "Police Officer",
    slug: "police-officer",
    blsTitle: "Police and Sheriff's Patrol Officers",
    national: 72280,
    states: {
      AL: 52320, AK: 88320, AZ: 68320, AR: 50320, CA: 108320,
      CO: 72320, CT: 84320, DE: 68320, FL: 64320, GA: 58320,
      HI: 82320, ID: 54320, IL: 78320, IN: 58320, IA: 58320,
      KS: 56320, KY: 52320, LA: 52320, ME: 54320, MD: 78320,
      MA: 88320, MI: 64320, MN: 72320, MS: 46320, MO: 56320,
      MT: 56320, NE: 58320, NV: 72320, NH: 62320, NJ: 92320,
      NM: 54320, NY: 84320, NC: 52320, ND: 58320, OH: 62320,
      OK: 50320, OR: 78320, PA: 68320, RI: 74320, SC: 50320,
      SD: 50320, TN: 52320, TX: 62320, UT: 62320, VT: 56320,
      VA: 64320, WA: 84320, WV: 46320, WI: 62320, WY: 62320
    }
  },
  {
    job: "Firefighter",
    slug: "firefighter",
    blsTitle: "Firefighters",
    national: 58290,
    states: {
      AL: 44320, AK: 72320, AZ: 58320, AR: 42320, CA: 88320,
      CO: 62320, CT: 68320, DE: 56320, FL: 52320, GA: 48320,
      HI: 72320, ID: 46320, IL: 64320, IN: 48320, IA: 48320,
      KS: 46320, KY: 44320, LA: 44320, ME: 46320, MD: 64320,
      MA: 74320, MI: 54320, MN: 62320, MS: 38320, MO: 46320,
      MT: 48320, NE: 48320, NV: 62320, NH: 54320, NJ: 74320,
      NM: 46320, NY: 72320, NC: 44320, ND: 48320, OH: 52320,
      OK: 42320, OR: 68320, PA: 56320, RI: 62320, SC: 42320,
      SD: 40320, TN: 44320, TX: 54320, UT: 52320, VT: 48320,
      VA: 54320, WA: 74320, WV: 40320, WI: 52320, WY: 52320
    }
  },
  {
    job: "Electrician",
    slug: "electrician",
    blsTitle: "Electricians",
    national: 61590,
    states: {
      AL: 50320, AK: 84320, AZ: 58320, AR: 48320, CA: 82320,
      CO: 64320, CT: 72320, DE: 62320, FL: 54320, GA: 54320,
      HI: 84320, ID: 52320, IL: 74320, IN: 58320, IA: 58320,
      KS: 54320, KY: 52320, LA: 54320, ME: 54320, MD: 66320,
      MA: 78320, MI: 66320, MN: 72320, MS: 46320, MO: 62320,
      MT: 54320, NE: 54320, NV: 68320, NH: 62320, NJ: 78320,
      NM: 52320, NY: 84320, NC: 50320, ND: 62320, OH: 62320,
      OK: 50320, OR: 72320, PA: 66320, RI: 70320, SC: 48320,
      SD: 50320, TN: 52320, TX: 58320, UT: 56320, VT: 56320,
      VA: 60320, WA: 78320, WV: 48320, WI: 62320, WY: 58320
    }
  },
  {
    job: "Plumber",
    slug: "plumber",
    blsTitle: "Plumbers, Pipefitters, and Steamfitters",
    national: 61550,
    states: {
      AL: 48320, AK: 82320, AZ: 56320, AR: 46320, CA: 78320,
      CO: 62320, CT: 70320, DE: 60320, FL: 52320, GA: 52320,
      HI: 82320, ID: 50320, IL: 72320, IN: 56320, IA: 56320,
      KS: 52320, KY: 50320, LA: 52320, ME: 52320, MD: 64320,
      MA: 76320, MI: 64320, MN: 70320, MS: 44320, MO: 60320,
      MT: 52320, NE: 52320, NV: 66320, NH: 60320, NJ: 76320,
      NM: 50320, NY: 82320, NC: 48320, ND: 60320, OH: 60320,
      OK: 48320, OR: 70320, PA: 64320, RI: 68320, SC: 46320,
      SD: 48320, TN: 50320, TX: 56320, UT: 54320, VT: 54320,
      VA: 58320, WA: 76320, WV: 46320, WI: 60320, WY: 56320
    }
  },
  {
    job: "Truck Driver",
    slug: "truck-driver",
    blsTitle: "Heavy and Tractor-Trailer Truck Drivers",
    national: 54320,
    states: {
      AL: 48320, AK: 62320, AZ: 52320, AR: 48320, CA: 62320,
      CO: 54320, CT: 58320, DE: 54320, FL: 50320, GA: 50320,
      HI: 52320, ID: 48320, IL: 56320, IN: 52320, IA: 52320,
      KS: 50320, KY: 50320, LA: 48320, ME: 48320, MD: 56320,
      MA: 60320, MI: 54320, MN: 56320, MS: 44320, MO: 50320,
      MT: 48320, NE: 50320, NV: 54320, NH: 54320, NJ: 60320,
      NM: 48320, NY: 60320, NC: 48320, ND: 54320, OH: 54320,
      OK: 46320, OR: 58320, PA: 54320, RI: 56320, SC: 46320,
      SD: 48320, TN: 50320, TX: 52320, UT: 50320, VT: 50320,
      VA: 52320, WA: 60320, WV: 46320, WI: 52320, WY: 52320
    }
  },
  {
    job: "Project Manager",
    slug: "project-manager",
    blsTitle: "Project Management Specialists",
    national: 98580,
    states: {
      AL: 78320, AK: 92320, AZ: 92320, AR: 72320, CA: 122320,
      CO: 102320, CT: 108320, DE: 98320, FL: 88320, GA: 92320,
      HI: 88320, ID: 82320, IL: 98320, IN: 80320, IA: 78320,
      KS: 78320, KY: 76320, LA: 76320, ME: 78320, MD: 108320,
      MA: 118320, MI: 88320, MN: 98320, MS: 68320, MO: 82320,
      MT: 76320, NE: 78320, NV: 88320, NH: 92320, NJ: 112320,
      NM: 78320, NY: 118320, NC: 88320, ND: 76320, OH: 84320,
      OK: 74320, OR: 102320, PA: 92320, RI: 92320, SC: 78320,
      SD: 72320, TN: 80320, TX: 98320, UT: 90320, VT: 82320,
      VA: 108320, WA: 118320, WV: 68320, WI: 84320, WY: 76320
    }
  },
  {
    job: "Data Analyst",
    slug: "data-analyst",
    blsTitle: "Business Intelligence Analysts",
    national: 102200,
    states: {
      AL: 78320, AK: 88320, AZ: 94320, AR: 72320, CA: 128320,
      CO: 108320, CT: 112320, DE: 98320, FL: 92320, GA: 96320,
      HI: 88320, ID: 84320, IL: 102320, IN: 82320, IA: 78320,
      KS: 78320, KY: 76320, LA: 76320, ME: 80320, MD: 112320,
      MA: 122320, MI: 92320, MN: 102320, MS: 68320, MO: 84320,
      MT: 76320, NE: 80320, NV: 90320, NH: 94320, NJ: 114320,
      NM: 80320, NY: 122320, NC: 92320, ND: 76320, OH: 86320,
      OK: 74320, OR: 106320, PA: 94320, RI: 94320, SC: 80320,
      SD: 72320, TN: 82320, TX: 102320, UT: 94320, VT: 84320,
      VA: 112320, WA: 122320, WV: 68320, WI: 86320, WY: 76320
    }
  },
  {
    job: "Marketing Manager",
    slug: "marketing-manager",
    blsTitle: "Marketing Managers",
    national: 156580,
    states: {
      AL: 108320, AK: 118320, AZ: 138320, AR: 98320, CA: 188320,
      CO: 148320, CT: 158320, DE: 138320, FL: 132320, GA: 138320,
      HI: 128320, ID: 112320, IL: 148320, IN: 112320, IA: 108320,
      KS: 108320, KY: 108320, LA: 108320, ME: 112320, MD: 158320,
      MA: 178320, MI: 132320, MN: 148320, MS: 92320, MO: 118320,
      MT: 108320, NE: 112320, NV: 132320, NH: 138320, NJ: 168320,
      NM: 108320, NY: 188320, NC: 128320, ND: 102320, OH: 122320,
      OK: 102320, OR: 148320, PA: 132320, RI: 138320, SC: 112320,
      SD: 98320, TN: 118320, TX: 148320, UT: 132320, VT: 118320,
      VA: 158320, WA: 178320, WV: 92320, WI: 122320, WY: 102320
    }
  },
  {
    job: "Financial Advisor",
    slug: "financial-advisor",
    blsTitle: "Personal Financial Advisors",
    national: 99580,
    states: {
      AL: 72320, AK: 88320, AZ: 92320, AR: 68320, CA: 128320,
      CO: 98320, CT: 118320, DE: 98320, FL: 92320, GA: 88320,
      HI: 88320, ID: 78320, IL: 98320, IN: 78320, IA: 76320,
      KS: 76320, KY: 74320, LA: 74320, ME: 76320, MD: 108320,
      MA: 128320, MI: 88320, MN: 98320, MS: 64320, MO: 82320,
      MT: 74320, NE: 78320, NV: 88320, NH: 92320, NJ: 128320,
      NM: 76320, NY: 148320, NC: 84320, ND: 74320, OH: 82320,
      OK: 72320, OR: 98320, PA: 92320, RI: 98320, SC: 76320,
      SD: 68320, TN: 78320, TX: 98320, UT: 86320, VT: 82320,
      VA: 108320, WA: 118320, WV: 64320, WI: 82320, WY: 74320
    }
  },
  {
    job: "Pharmacist",
    slug: "pharmacist",
    blsTitle: "Pharmacists",
    national: 132750,
    states: {
      AL: 118320, AK: 142320, AZ: 128320, AR: 114320, CA: 148320,
      CO: 132320, CT: 138320, DE: 128320, FL: 124320, GA: 124320,
      HI: 138320, ID: 118320, IL: 132320, IN: 122320, IA: 120320,
      KS: 118320, KY: 118320, LA: 116320, ME: 118320, MD: 138320,
      MA: 142320, MI: 128320, MN: 136320, MS: 112320, MO: 122320,
      MT: 118320, NE: 120320, NV: 132320, NH: 132320, NJ: 138320,
      NM: 118320, NY: 142320, NC: 122320, ND: 120320, OH: 126320,
      OK: 114320, OR: 138320, PA: 128320, RI: 132320, SC: 118320,
      SD: 114320, TN: 120320, TX: 128320, UT: 122320, VT: 122320,
      VA: 132320, WA: 142320, WV: 112320, WI: 128320, WY: 118320
    }
  },
  {
    job: "Physical Therapist",
    slug: "physical-therapist",
    blsTitle: "Physical Therapists",
    national: 99710,
    states: {
      AL: 82320, AK: 108320, AZ: 98320, AR: 78320, CA: 114320,
      CO: 98320, CT: 102320, DE: 96320, FL: 90320, GA: 88320,
      HI: 108320, ID: 84320, IL: 92320, IN: 84320, IA: 82320,
      KS: 82320, KY: 80320, LA: 78320, ME: 84320, MD: 96320,
      MA: 102320, MI: 88320, MN: 98320, MS: 72320, MO: 84320,
      MT: 82320, NE: 84320, NV: 98320, NH: 96320, NJ: 102320,
      NM: 82320, NY: 102320, NC: 84320, ND: 84320, OH: 88320,
      OK: 78320, OR: 102320, PA: 90320, RI: 96320, SC: 80320,
      SD: 76320, TN: 82320, TX: 92320, UT: 88320, VT: 86320,
      VA: 94320, WA: 108320, WV: 74320, WI: 90320, WY: 84320
    }
  },
  {
    job: "Social Worker",
    slug: "social-worker",
    blsTitle: "Child, Family, and School Social Workers",
    national: 54150,
    states: {
      AL: 42320, AK: 62320, AZ: 52320, AR: 40320, CA: 68320,
      CO: 54320, CT: 58320, DE: 52320, FL: 46320, GA: 46320,
      HI: 56320, ID: 44320, IL: 54320, IN: 44320, IA: 44320,
      KS: 42320, KY: 42320, LA: 40320, ME: 46320, MD: 58320,
      MA: 62320, MI: 50320, MN: 56320, MS: 36320, MO: 44320,
      MT: 42320, NE: 44320, NV: 50320, NH: 50320, NJ: 58320,
      NM: 42320, NY: 62320, NC: 44320, ND: 44320, OH: 48320,
      OK: 38320, OR: 56320, PA: 50320, RI: 54320, SC: 40320,
      SD: 38320, TN: 42320, TX: 48320, UT: 46320, VT: 48320,
      VA: 52320, WA: 62320, WV: 38320, WI: 48320, WY: 44320
    }
  },
  {
    job: "Web Developer",
    slug: "web-developer",
    blsTitle: "Web Developers and Digital Interface Designers",
    national: 92750,
    states: {
      AL: 68320, AK: 82320, AZ: 86320, AR: 64320, CA: 122320,
      CO: 98320, CT: 98320, DE: 88320, FL: 82320, GA: 86320,
      HI: 82320, ID: 78320, IL: 92320, IN: 74320, IA: 70320,
      KS: 70320, KY: 68320, LA: 66320, ME: 72320, MD: 98320,
      MA: 112320, MI: 82320, MN: 92320, MS: 60320, MO: 74320,
      MT: 70320, NE: 72320, NV: 82320, NH: 86320, NJ: 102320,
      NM: 72320, NY: 112320, NC: 82320, ND: 66320, OH: 76320,
      OK: 66320, OR: 102320, PA: 84320, RI: 84320, SC: 70320,
      SD: 62320, TN: 72320, TX: 88320, UT: 84320, VT: 76320,
      VA: 98320, WA: 118320, WV: 60320, WI: 76320, WY: 66320
    }
  },
  {
    job: "Dentist",
    slug: "dentist",
    blsTitle: "Dentists, General",
    national: 175500,
    states: {
      AL: 148320, AK: 192320, AZ: 168320, AR: 138320, CA: 198320,
      CO: 178320, CT: 188320, DE: 172320, FL: 162320, GA: 162320,
      HI: 192320, ID: 152320, IL: 172320, IN: 158320, IA: 158320,
      KS: 152320, KY: 148320, LA: 148320, ME: 152320, MD: 182320,
      MA: 192320, MI: 168320, MN: 182320, MS: 132320, MO: 158320,
      MT: 152320, NE: 158320, NV: 172320, NH: 172320, NJ: 188320,
      NM: 148320, NY: 192320, NC: 158320, ND: 158320, OH: 162320,
      OK: 142320, OR: 182320, PA: 168320, RI: 172320, SC: 152320,
      SD: 148320, TN: 158320, TX: 172320, UT: 162320, VT: 158320,
      VA: 178320, WA: 192320, WV: 138320, WI: 168320, WY: 158320
    }
  },
  {
    job: "Surgeon",
    slug: "surgeon",
    blsTitle: "Surgeons",
    national: 297800,
    states: {
      AL: 265000, AK: 312000, AZ: 288000, AR: 258000, CA: 338000,
      CO: 302000, CT: 318000, DE: 295000, FL: 285000, GA: 278000,
      HI: 308000, ID: 272000, IL: 305000, IN: 278000, IA: 272000,
      KS: 270000, KY: 265000, LA: 262000, ME: 270000, MD: 315000,
      MA: 322000, MI: 292000, MN: 305000, MS: 248000, MO: 278000,
      MT: 270000, NE: 275000, NV: 295000, NH: 298000, NJ: 325000,
      NM: 268000, NY: 328000, NC: 285000, ND: 268000, OH: 285000,
      OK: 262000, OR: 308000, PA: 298000, RI: 295000, SC: 272000,
      SD: 268000, TN: 275000, TX: 295000, UT: 288000, VT: 278000,
      VA: 308000, WA: 322000, WV: 252000, WI: 288000, WY: 268000
    }
  },
  {
    job: "Registered Nurse",
    slug: "registered-nurse",
    blsTitle: "Registered Nurses",
    national: 93600,
    states: {
      AL: 71200, AK: 106800, AZ: 89400, AR: 68000, CA: 133300,
      CO: 92800, CT: 101200, DE: 88000, FL: 80000, GA: 80000,
      HI: 110800, ID: 80400, IL: 88000, IN: 76800, IA: 73600,
      KS: 72800, KY: 70400, LA: 70400, ME: 80800, MD: 98400,
      MA: 108000, MI: 84000, MN: 96000, MS: 63200, MO: 75200,
      MT: 74800, NE: 76800, NV: 98400, NH: 90800, NJ: 106400,
      NM: 76800, NY: 108800, NC: 80000, ND: 71200, OH: 76800,
      OK: 68000, OR: 110400, PA: 84800, RI: 96000, SC: 73600,
      SD: 66400, TN: 73600, TX: 82400, UT: 81600, VT: 82400,
      VA: 88000, WA: 114400, WV: 64000, WI: 80800, WY: 74400
    }
  },
  {
    job: "Occupational Therapist",
    slug: "occupational-therapist",
    blsTitle: "Occupational Therapists",
    national: 96320,
    states: {
      AL: 80320, AK: 104320, AZ: 92320, AR: 76320, CA: 110320,
      CO: 94320, CT: 98320, DE: 90320, FL: 88320, GA: 86320,
      HI: 104320, ID: 82320, IL: 92320, IN: 82320, IA: 80320,
      KS: 79320, KY: 78320, LA: 77320, ME: 82320, MD: 100320,
      MA: 106320, MI: 86320, MN: 96320, MS: 70320, MO: 80320,
      MT: 78320, NE: 80320, NV: 92320, NH: 92320, NJ: 104320,
      NM: 80320, NY: 106320, NC: 84320, ND: 76320, OH: 82320,
      OK: 76320, OR: 104320, PA: 88320, RI: 92320, SC: 80320,
      SD: 72320, TN: 80320, TX: 90320, UT: 86320, VT: 82320,
      VA: 96320, WA: 110320, WV: 68320, WI: 84320, WY: 76320
    }
  },
  {
    job: "Dental Hygienist",
    slug: "dental-hygienist",
    blsTitle: "Dental Hygienists",
    national: 81400,
    states: {
      AL: 64400, AK: 102400, AZ: 84400, AR: 62400, CA: 114400,
      CO: 86400, CT: 84400, DE: 80400, FL: 74400, GA: 74400,
      HI: 102400, ID: 74400, IL: 80400, IN: 72400, IA: 70400,
      KS: 68400, KY: 66400, LA: 64400, ME: 72400, MD: 88400,
      MA: 96400, MI: 74400, MN: 86400, MS: 56400, MO: 70400,
      MT: 68400, NE: 70400, NV: 92400, NH: 86400, NJ: 92400,
      NM: 68400, NY: 92400, NC: 72400, ND: 68400, OH: 70400,
      OK: 64400, OR: 100400, PA: 76400, RI: 84400, SC: 68400,
      SD: 62400, TN: 70400, TX: 76400, UT: 80400, VT: 74400,
      VA: 84400, WA: 108400, WV: 58400, WI: 72400, WY: 68400
    }
  },
  {
    job: "Veterinarian",
    slug: "veterinarian",
    blsTitle: "Veterinarians",
    national: 119100,
    states: {
      AL: 96100, AK: 124100, AZ: 116100, AR: 90100, CA: 148100,
      CO: 122100, CT: 126100, DE: 116100, FL: 112100, GA: 110100,
      HI: 130100, ID: 104100, IL: 118100, IN: 104100, IA: 102100,
      KS: 100100, KY: 98100, LA: 96100, ME: 104100, MD: 128100,
      MA: 132100, MI: 110100, MN: 120100, MS: 82100, MO: 102100,
      MT: 98100, NE: 102100, NV: 116100, NH: 116100, NJ: 132100,
      NM: 100100, NY: 136100, NC: 110100, ND: 96100, OH: 108100,
      OK: 94100, OR: 128100, PA: 114100, RI: 116100, SC: 102100,
      SD: 90100, TN: 104100, TX: 114100, UT: 112100, VT: 106100,
      VA: 122100, WA: 138100, WV: 84100, WI: 110100, WY: 96100
    }
  },
  {
    job: "Cybersecurity Analyst",
    slug: "cybersecurity-analyst",
    blsTitle: "Information Security Analysts",
    national: 120360,
    states: {
      AL: 96360, AK: 108360, AZ: 116360, AR: 88360, CA: 148360,
      CO: 124360, CT: 128360, DE: 118360, FL: 110360, GA: 116360,
      HI: 110360, ID: 102360, IL: 120360, IN: 100360, IA: 96360,
      KS: 96360, KY: 94360, LA: 92360, ME: 98360, MD: 136360,
      MA: 140360, MI: 108360, MN: 120360, MS: 80360, MO: 100360,
      MT: 90360, NE: 98360, NV: 112360, NH: 112360, NJ: 136360,
      NM: 96360, NY: 142360, NC: 112360, ND: 86360, OH: 104360,
      OK: 90360, OR: 126360, PA: 112360, RI: 110360, SC: 98360,
      SD: 86360, TN: 98360, TX: 118360, UT: 112360, VT: 102360,
      VA: 140360, WA: 142360, WV: 80360, WI: 102360, WY: 86360
    }
  },
  {
    job: "Cloud Engineer",
    slug: "cloud-engineer",
    blsTitle: "Software Developers and Software Quality Assurance Analysts",
    national: 138000,
    states: {
      AL: 108000, AK: 120000, AZ: 132000, AR: 100000, CA: 178000,
      CO: 148000, CT: 142000, DE: 130000, FL: 126000, GA: 130000,
      HI: 124000, ID: 116000, IL: 136000, IN: 114000, IA: 108000,
      KS: 108000, KY: 106000, LA: 104000, ME: 110000, MD: 152000,
      MA: 160000, MI: 122000, MN: 136000, MS: 90000, MO: 114000,
      MT: 104000, NE: 112000, NV: 130000, NH: 128000, NJ: 154000,
      NM: 108000, NY: 162000, NC: 130000, ND: 98000, OH: 118000,
      OK: 102000, OR: 148000, PA: 128000, RI: 126000, SC: 110000,
      SD: 98000, TN: 114000, TX: 136000, UT: 132000, VT: 116000,
      VA: 158000, WA: 172000, WV: 92000, WI: 116000, WY: 98000
    }
  },
  {
    job: "Machine Learning Engineer",
    slug: "machine-learning-engineer",
    blsTitle: "Computer and Information Research Scientists",
    national: 158000,
    states: {
      AL: 122000, AK: 132000, AZ: 150000, AR: 112000, CA: 212000,
      CO: 168000, CT: 162000, DE: 148000, FL: 144000, GA: 150000,
      HI: 140000, ID: 130000, IL: 156000, IN: 130000, IA: 122000,
      KS: 122000, KY: 120000, LA: 118000, ME: 126000, MD: 172000,
      MA: 182000, MI: 140000, MN: 156000, MS: 102000, MO: 130000,
      MT: 118000, NE: 128000, NV: 148000, NH: 146000, NJ: 174000,
      NM: 122000, NY: 186000, NC: 150000, ND: 112000, OH: 136000,
      OK: 116000, OR: 168000, PA: 148000, RI: 144000, SC: 126000,
      SD: 112000, TN: 130000, TX: 158000, UT: 152000, VT: 132000,
      VA: 180000, WA: 198000, WV: 104000, WI: 132000, WY: 112000
    }
  },
  {
    job: "UX Designer",
    slug: "ux-designer",
    blsTitle: "Web and Digital Interface Designers",
    national: 98000,
    states: {
      AL: 74000, AK: 86000, AZ: 94000, AR: 68000, CA: 136000,
      CO: 104000, CT: 102000, DE: 94000, FL: 88000, GA: 90000,
      HI: 88000, ID: 80000, IL: 96000, IN: 78000, IA: 74000,
      KS: 74000, KY: 72000, LA: 70000, ME: 76000, MD: 108000,
      MA: 118000, MI: 84000, MN: 96000, MS: 62000, MO: 78000,
      MT: 72000, NE: 76000, NV: 92000, NH: 92000, NJ: 110000,
      NM: 74000, NY: 122000, NC: 90000, ND: 68000, OH: 82000,
      OK: 70000, OR: 108000, PA: 90000, RI: 88000, SC: 76000,
      SD: 66000, TN: 78000, TX: 96000, UT: 92000, VT: 82000,
      VA: 110000, WA: 128000, WV: 62000, WI: 82000, WY: 68000
    }
  },
  {
    job: "IT Manager",
    slug: "it-manager",
    blsTitle: "Computer and Information Systems Managers",
    national: 169510,
    states: {
      AL: 134510, AK: 148510, AZ: 162510, AR: 122510, CA: 212510,
      CO: 178510, CT: 180510, DE: 162510, FL: 156510, GA: 160510,
      HI: 158510, ID: 144510, IL: 168510, IN: 146510, IA: 138510,
      KS: 138510, KY: 134510, LA: 130510, ME: 140510, MD: 190510,
      MA: 198510, MI: 154510, MN: 172510, MS: 112510, MO: 146510,
      MT: 132510, NE: 142510, NV: 162510, NH: 162510, NJ: 192510,
      NM: 138510, NY: 202510, NC: 160510, ND: 124510, OH: 152510,
      OK: 130510, OR: 178510, PA: 160510, RI: 158510, SC: 142510,
      SD: 124510, TN: 148510, TX: 168510, UT: 162510, VT: 148510,
      VA: 196510, WA: 202510, WV: 114510, WI: 150510, WY: 124510
    }
  },
  {
    job: "HVAC Technician",
    slug: "hvac-technician",
    blsTitle: "Heating, Air Conditioning, and Refrigeration Mechanics and Installers",
    national: 57620,
    states: {
      AL: 47620, AK: 72620, AZ: 56620, AR: 44620, CA: 73620,
      CO: 60620, CT: 64620, DE: 58620, FL: 50620, GA: 50620,
      HI: 74620, ID: 50620, IL: 64620, IN: 52620, IA: 50620,
      KS: 50620, KY: 48620, LA: 46620, ME: 52620, MD: 64620,
      MA: 70620, MI: 58620, MN: 64620, MS: 40620, MO: 52620,
      MT: 48620, NE: 50620, NV: 60620, NH: 58620, NJ: 70620,
      NM: 48620, NY: 74620, NC: 50620, ND: 48620, OH: 54620,
      OK: 46620, OR: 66620, PA: 58620, RI: 62620, SC: 48620,
      SD: 46620, TN: 48620, TX: 54620, UT: 54620, VT: 52620,
      VA: 62620, WA: 74620, WV: 44620, WI: 56620, WY: 50620
    }
  },
  {
    job: "Welder",
    slug: "welder",
    blsTitle: "Welders, Cutters, Solderers, and Brazers",
    national: 47990,
    states: {
      AL: 41990, AK: 66990, AZ: 46990, AR: 40990, CA: 56990,
      CO: 50990, CT: 52990, DE: 48990, FL: 44990, GA: 43990,
      HI: 60990, ID: 44990, IL: 52990, IN: 46990, IA: 44990,
      KS: 44990, KY: 43990, LA: 48990, ME: 44990, MD: 52990,
      MA: 56990, MI: 50990, MN: 54990, MS: 36990, MO: 46990,
      MT: 46990, NE: 44990, NV: 50990, NH: 48990, NJ: 56990,
      NM: 42990, NY: 58990, NC: 43990, ND: 54990, OH: 46990,
      OK: 44990, OR: 56990, PA: 48990, RI: 50990, SC: 41990,
      SD: 42990, TN: 43990, TX: 50990, UT: 46990, VT: 46990,
      VA: 50990, WA: 60990, WV: 40990, WI: 48990, WY: 52990
    }
  },
  {
    job: "Construction Manager",
    slug: "construction-manager",
    blsTitle: "Construction Managers",
    national: 104900,
    states: {
      AL: 82900, AK: 118900, AZ: 102900, AR: 78900, CA: 134900,
      CO: 110900, CT: 112900, DE: 102900, FL: 98900, GA: 98900,
      HI: 122900, ID: 90900, IL: 106900, IN: 90900, IA: 86900,
      KS: 86900, KY: 84900, LA: 82900, ME: 88900, MD: 118900,
      MA: 128900, MI: 96900, MN: 108900, MS: 72900, MO: 90900,
      MT: 84900, NE: 88900, NV: 102900, NH: 102900, NJ: 124900,
      NM: 86900, NY: 134900, NC: 98900, ND: 84900, OH: 94900,
      OK: 82900, OR: 116900, PA: 100900, RI: 102900, SC: 88900,
      SD: 82900, TN: 90900, TX: 104900, UT: 100900, VT: 92900,
      VA: 116900, WA: 128900, WV: 72900, WI: 94900, WY: 86900
    }
  },
  {
    job: "Real Estate Agent",
    slug: "real-estate-agent",
    blsTitle: "Real Estate Sales Agents",
    national: 61480,
    states: {
      AL: 46480, AK: 62480, AZ: 62480, AR: 42480, CA: 82480,
      CO: 68480, CT: 66480, DE: 60480, FL: 60480, GA: 56480,
      HI: 76480, ID: 54480, IL: 60480, IN: 50480, IA: 48480,
      KS: 48480, KY: 46480, LA: 44480, ME: 52480, MD: 72480,
      MA: 74480, MI: 56480, MN: 62480, MS: 36480, MO: 50480,
      MT: 48480, NE: 52480, NV: 64480, NH: 62480, NJ: 74480,
      NM: 48480, NY: 82480, NC: 56480, ND: 44480, OH: 52480,
      OK: 44480, OR: 70480, PA: 58480, RI: 62480, SC: 52480,
      SD: 42480, TN: 52480, TX: 62480, UT: 60480, VT: 52480,
      VA: 68480, WA: 76480, WV: 38480, WI: 52480, WY: 44480
    }
  },
  {
    job: "Pilot",
    slug: "pilot",
    blsTitle: "Airline and Commercial Pilots",
    national: 203010,
    states: {
      AL: 162010, AK: 218010, AZ: 196010, AR: 152010, CA: 238010,
      CO: 208010, CT: 212010, DE: 198010, FL: 196010, GA: 198010,
      HI: 218010, ID: 168010, IL: 208010, IN: 178010, IA: 168010,
      KS: 168010, KY: 164010, LA: 162010, ME: 172010, MD: 218010,
      MA: 222010, MI: 188010, MN: 208010, MS: 148010, MO: 178010,
      MT: 162010, NE: 168010, NV: 198010, NH: 196010, NJ: 222010,
      NM: 162010, NY: 228010, NC: 192010, ND: 158010, OH: 188010,
      OK: 162010, OR: 208010, PA: 198010, RI: 192010, SC: 172010,
      SD: 158010, TN: 178010, TX: 202010, UT: 196010, VT: 178010,
      VA: 218010, WA: 228010, WV: 148010, WI: 182010, WY: 162010
    }
  },
  {
    job: "Human Resources Manager",
    slug: "human-resources-manager",
    blsTitle: "Human Resources Managers",
    national: 136350,
    states: {
      AL: 106350, AK: 118350, AZ: 130350, AR: 96350, CA: 172350,
      CO: 144350, CT: 148350, DE: 132350, FL: 124350, GA: 128350,
      HI: 128350, ID: 112350, IL: 136350, IN: 114350, IA: 108350,
      KS: 108350, KY: 106350, LA: 102350, ME: 110350, MD: 154350,
      MA: 162350, MI: 122350, MN: 138350, MS: 88350, MO: 114350,
      MT: 104350, NE: 112350, NV: 128350, NH: 130350, NJ: 158350,
      NM: 108350, NY: 168350, NC: 128350, ND: 96350, OH: 120350,
      OK: 102350, OR: 144350, PA: 128350, RI: 128350, SC: 110350,
      SD: 96350, TN: 116350, TX: 134350, UT: 128350, VT: 116350,
      VA: 158350, WA: 162350, WV: 88350, WI: 120350, WY: 96350
    }
  },
  {
    job: "Operations Manager",
    slug: "operations-manager",
    blsTitle: "General and Operations Managers",
    national: 107580,
    states: {
      AL: 84580, AK: 96580, AZ: 102580, AR: 76580, CA: 138580,
      CO: 114580, CT: 118580, DE: 104580, FL: 98580, GA: 100580,
      HI: 102580, ID: 88580, IL: 108580, IN: 90580, IA: 86580,
      KS: 86580, KY: 84580, LA: 80580, ME: 88580, MD: 122580,
      MA: 130580, MI: 96580, MN: 110580, MS: 70580, MO: 90580,
      MT: 82580, NE: 88580, NV: 100580, NH: 104580, NJ: 126580,
      NM: 84580, NY: 136580, NC: 100580, ND: 78580, OH: 96580,
      OK: 80580, OR: 114580, PA: 102580, RI: 100580, SC: 88580,
      SD: 78580, TN: 92580, TX: 106580, UT: 100580, VT: 90580,
      VA: 122580, WA: 130580, WV: 72580, WI: 94580, WY: 80580
    }
  },
  {
    job: "Business Analyst",
    slug: "business-analyst",
    blsTitle: "Management Analysts",
    national: 99410,
    states: {
      AL: 78410, AK: 88410, AZ: 96410, AR: 70410, CA: 130410,
      CO: 106410, CT: 110410, DE: 98410, FL: 90410, GA: 94410,
      HI: 94410, ID: 82410, IL: 102410, IN: 84410, IA: 80410,
      KS: 80410, KY: 78410, LA: 74410, ME: 82410, MD: 118410,
      MA: 126410, MI: 90410, MN: 104410, MS: 64410, MO: 84410,
      MT: 76410, NE: 82410, NV: 94410, NH: 98410, NJ: 118410,
      NM: 78410, NY: 132410, NC: 94410, ND: 72410, OH: 88410,
      OK: 74410, OR: 106410, PA: 96410, RI: 96410, SC: 82410,
      SD: 72410, TN: 86410, TX: 98410, UT: 94410, VT: 84410,
      VA: 120410, WA: 124410, WV: 66410, WI: 88410, WY: 72410
    }
  },
  {
    job: "Supply Chain Manager",
    slug: "supply-chain-manager",
    blsTitle: "Logisticians",
    national: 99600,
    states: {
      AL: 78600, AK: 90600, AZ: 96600, AR: 72600, CA: 126600,
      CO: 106600, CT: 108600, DE: 98600, FL: 90600, GA: 96600,
      HI: 96600, ID: 84600, IL: 102600, IN: 88600, IA: 84600,
      KS: 84600, KY: 82600, LA: 78600, ME: 84600, MD: 114600,
      MA: 120600, MI: 94600, MN: 104600, MS: 66600, MO: 88600,
      MT: 78600, NE: 86600, NV: 96600, NH: 98600, NJ: 114600,
      NM: 80600, NY: 122600, NC: 94600, ND: 76600, OH: 90600,
      OK: 78600, OR: 106600, PA: 96600, RI: 96600, SC: 86600,
      SD: 74600, TN: 88600, TX: 100600, UT: 96600, VT: 86600,
      VA: 116600, WA: 118600, WV: 68600, WI: 90600, WY: 76600
    }
  },
  {
    job: "Paralegal",
    slug: "paralegal",
    blsTitle: "Paralegals and Legal Assistants",
    national: 59200,
    states: {
      AL: 44200, AK: 56200, AZ: 56200, AR: 40200, CA: 76200,
      CO: 62200, CT: 64200, DE: 58200, FL: 54200, GA: 54200,
      HI: 62200, ID: 48200, IL: 60200, IN: 48200, IA: 46200,
      KS: 46200, KY: 44200, LA: 42200, ME: 48200, MD: 68200,
      MA: 70200, MI: 54200, MN: 60200, MS: 36200, MO: 48200,
      MT: 44200, NE: 48200, NV: 56200, NH: 58200, NJ: 68200,
      NM: 46200, NY: 74200, NC: 52200, ND: 42200, OH: 50200,
      OK: 42200, OR: 64200, PA: 56200, RI: 58200, SC: 48200,
      SD: 40200, TN: 48200, TX: 56200, UT: 52200, VT: 50200,
      VA: 64200, WA: 70200, WV: 36200, WI: 50200, WY: 42200
    }
  }
]

export function generateSlug(jobSlug: string, stateSlug: string): string {
  return `${jobSlug}-in-${stateSlug}`
}

export function getStateSlug(stateName: string): string {
  return stateName.toLowerCase().replace(/\s+/g, '-')
}

export function getSalaryBySlug(slug: string): {
  entry: SalaryEntry
  state: StateInfo
  stateSalary: number
} | null {
  for (const entry of SALARY_DATA) {
    for (const state of STATES) {
      const stateSlug = getStateSlug(state.name)
      const fullSlug = generateSlug(entry.slug, stateSlug)
      if (fullSlug === slug) {
        return {
          entry,
          state,
          stateSalary: entry.states[state.abbreviation] ?? entry.national
        }
      }
    }
  }
  return null
}

export function getAllSalarySlugs(): string[] {
  const slugs: string[] = []
  for (const entry of SALARY_DATA) {
    for (const state of STATES) {
      const stateSlug = getStateSlug(state.name)
      slugs.push(generateSlug(entry.slug, stateSlug))
    }
  }
  return slugs
}
