import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.EIA_API_KEY
  if (!apiKey) {
    return NextResponse.json({ value: 4900, year: '2023' })
  }

  try {
    const res = await fetch(
      `https://api.eia.gov/v2/co2-emissions/co2-emissions-aggregates/data/?api_key=${apiKey}&frequency=annual&data[0]=value&facets[sectorId][]=EC&facets[stateId][]=US&sort[0][column]=period&sort[0][direction]=desc&length=1`,
      { next: { revalidate: 86400 } }
    )
    const data = await res.json()
    const latestValue = data?.response?.data?.[0]?.value
    const latestYear = data?.response?.data?.[0]?.period
    if (!latestValue) {
      return NextResponse.json({ value: 4900, year: '2023' })
    }
    return NextResponse.json({ value: latestValue, year: latestYear })
  } catch {
    return NextResponse.json({ value: 4900, year: '2023' })
  }
}
