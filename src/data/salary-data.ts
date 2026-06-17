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
