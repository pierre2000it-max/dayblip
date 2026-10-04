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
          question: 'How many days until the next World Cup?',
          answer: 'The next FIFA World Cup is in 2030. The live countdown on this page runs to the opening matches on June 13 2030. The dates are reported but FIFA has not released the full match schedule, so they could still change.',
        },
        {
          question: 'When is the 2030 World Cup final?',
          answer: 'The 2030 World Cup final is reported for Sunday July 21 2030. FIFA has not released the full match schedule, so treat this date as provisional until it does.',
        },
        {
          question: 'Where will the 2030 World Cup be held?',
          answer: 'Spain, Portugal and Morocco host the 2030 World Cup, the first on three continents. Uruguay, Argentina and Paraguay each host one centenary match to mark 100 years since the first World Cup in 1930.',
        },
        {
          question: 'When were the 2026 World Cup and its final?',
          answer: 'The 2026 FIFA World Cup ran from June 11 to July 19 2026 across the United States, Canada and Mexico. The final was played on July 19 2026 at MetLife Stadium in East Rutherford, New Jersey. It was the first World Cup with 48 teams.',
        },
        {
          question: 'When are the 2030 World Cup centenary matches?',
          answer: 'Centenary matches are reported for June 8 and 9 2030 in Uruguay, Argentina and Paraguay, before the opening matches in Spain, Portugal and Morocco on June 13 2030.',
        },
        {
          question: 'How often is the World Cup held?',
          answer: 'The men\'s FIFA World Cup is held every 4 years. The 2026 tournament was followed by the 2030 edition, and the 2034 World Cup is scheduled for Saudi Arabia.',
        },
      ]}
      relatedSlugs={['super-bowl', 'world-series', 'nba-finals']}
    />
  )
}
