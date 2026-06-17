import { notFound } from 'next/navigation'
import SportsCountdown from '@/app/days-until/sports-countdown'
import { getSportEvent } from '@/data/sports-events'

export default function WorldCupPage() {
  const event = getSportEvent('world-cup')
  if (!event) notFound()

  return (
    <SportsCountdown
      event={event}
      faqItems={[
        {
          question: 'When is the FIFA World Cup 2026 Final?',
          answer: 'The FIFA World Cup 2026 Final is scheduled for Sunday July 19 2026 at MetLife Stadium in East Rutherford New Jersey — officially known as New York New Jersey Stadium for the tournament. Kickoff is at 3pm ET. The tournament runs from June 11 to July 19 2026 across 16 cities in the United States Canada and Mexico.'
        },
        {
          question: 'Where is the 2026 World Cup being held?',
          answer: 'The 2026 FIFA World Cup is being hosted across 16 cities — 11 in the United States 3 in Mexico and 2 in Canada. It is the first World Cup hosted by three nations. The final will be played at MetLife Stadium in East Rutherford New Jersey. Other US host cities include Los Angeles Dallas Miami Houston Boston Philadelphia Seattle Atlanta Kansas City and San Francisco Bay Area.'
        },
        {
          question: 'How many teams are in the 2026 World Cup?',
          answer: 'The 2026 FIFA World Cup is the first to feature 48 teams — up from 32 in previous tournaments. The teams are divided into 12 groups of 4. The top two teams from each group plus the eight best third-place teams advance to a new round of 32 knockout stage making this the largest World Cup in history.'
        },
        {
          question: 'Who is hosting the 2026 World Cup?',
          answer: 'The 2026 FIFA World Cup is jointly hosted by the United States Canada and Mexico — making it the first World Cup hosted by three nations. The United States is hosting 78 of the 104 matches including all knockout stage matches from the quarterfinals onward. This is the first World Cup in the USA since 1994.'
        },
        {
          question: 'How many days until the World Cup Final?',
          answer: 'The live countdown on this page shows the exact number of days hours minutes and seconds until the FIFA World Cup 2026 Final on July 19 2026. The countdown updates every second in real time.'
        },
        {
          question: 'When did the 2026 World Cup start?',
          answer: 'The 2026 FIFA World Cup began on June 11 2026 with the opening match between Mexico and South Africa at Estadio Azteca in Mexico City. The tournament runs for 39 days — the longest World Cup in history due to the expanded 48-team format — concluding with the final on July 19 2026.'
        }
      ]}
      relatedSlugs={['super-bowl', 'world-series', 'nba-finals']}
    />
  )
}
