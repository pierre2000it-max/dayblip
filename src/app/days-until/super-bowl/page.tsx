import { notFound } from 'next/navigation'
import SportsCountdown from '@/app/days-until/sports-countdown'
import { getSportEvent } from '@/data/sports-events'

export default function SuperBowlPage() {
  const event = getSportEvent('super-bowl')
  if (!event) notFound()

  return (
    <SportsCountdown
      event={event}
      faqItems={[
        {
          question: 'When is the Super Bowl in 2027?',
          answer: "Super Bowl LXI is scheduled for Sunday February 14 2027 — Valentine's Day. It will be played at SoFi Stadium in Inglewood California, home of the Los Angeles Rams and Los Angeles Chargers. This will be the first Super Bowl ever played on Valentine's Day and the first broadcast on ESPN and ABC since 2006."
        },
        {
          question: 'Where is the Super Bowl in 2027?',
          answer: 'Super Bowl LXI will be held at SoFi Stadium in Inglewood California, the same venue that hosted Super Bowl LVI in 2022. The stadium seats approximately 70,000 fans and can expand to over 100,000 for major events. It is one of the most expensive sports venues ever built at over $5 billion in construction costs.'
        },
        {
          question: 'Who will broadcast the Super Bowl in 2027?',
          answer: 'Super Bowl LXI will be broadcast on ESPN and ABC — the first time ESPN has ever aired the Super Bowl and the first time ABC has broadcast it since Super Bowl XL in 2006. Joe Buck and Troy Aikman will call the game. A ManningCast alternate broadcast will also be available on ESPN2.'
        },
        {
          question: 'What teams are in the Super Bowl?',
          answer: 'The teams for Super Bowl LXI will be determined during the 2026 NFL regular season and playoffs, which run from September 2026 through January 2027. The NFC and AFC conference championship games will determine the two Super Bowl participants in late January 2027.'
        },
        {
          question: 'How many days until the Super Bowl?',
          answer: 'The live countdown on this page shows the exact number of days, hours, minutes, and seconds until Super Bowl LXI on February 14 2027. The countdown updates every second in real time.'
        },
        {
          question: 'What is the Super Bowl?',
          answer: 'The Super Bowl is the annual NFL championship game played between the winners of the American Football Conference and the National Football Conference. It is the most watched single sporting event in the United States with over 100 million viewers annually. Super Bowl LXI will be the 61st edition of the game.'
        }
      ]}
      relatedSlugs={['world-series', 'march-madness', 'nba-finals']}
    />
  )
}
