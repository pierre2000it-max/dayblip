import { notFound } from 'next/navigation'
import SportsCountdown from '@/app/days-until/sports-countdown'
import { getSportEvent } from '@/data/sports-events'

export default function NBAFinalsPage() {
  const event = getSportEvent('nba-finals')
  if (!event) notFound()

  return (
    <SportsCountdown
      event={event}
      faqItems={[
        {
          question: 'When are the 2027 NBA Finals?',
          answer: 'The 2027 NBA Finals are expected to begin in early June 2027 — typically the first week of June. The exact date is confirmed after the Eastern and Western Conference Finals conclude in late May. This page will update with the official Game 1 date when announced by the NBA.'
        },
        {
          question: 'What is the NBA Finals?',
          answer: "The NBA Finals is the annual championship series of the National Basketball Association played between the Eastern Conference champion and the Western Conference champion. It is a best-of-seven series — the first team to win four games is crowned NBA champion and receives the Larry O'Brien Championship Trophy."
        },
        {
          question: 'How long is the NBA Finals?',
          answer: 'The NBA Finals is a best-of-seven series that can last between four and seven games. Games are typically played every other day to allow for travel between cities. A series can end in as few as four games (a sweep) or last all seven games. The full series from Game 1 to a potential Game 7 spans approximately two weeks.'
        },
        {
          question: 'Where are the 2027 NBA Finals played?',
          answer: 'The 2027 NBA Finals are played at the home arenas of the Eastern and Western Conference champions alternating home court. The team with the better regular season record receives home court advantage — meaning they host Games 1 2 5 and 7 if necessary. The specific venues will be confirmed after the conference finals.'
        },
        {
          question: 'How many teams are in the NBA Playoffs?',
          answer: 'The NBA Playoffs feature 16 teams — 8 from the Eastern Conference and 8 from the Western Conference. Teams are seeded 1 through 8 in each conference based on regular season record. The playoffs consist of four rounds — first round second round conference finals and NBA Finals — each a best-of-seven series.'
        },
        {
          question: 'When does the NBA season end and playoffs begin?',
          answer: 'The NBA regular season typically ends in mid-April followed immediately by the Play-In Tournament for seeds 7 through 10. The first round of playoffs begins in late April. Conference semifinals run through May conference finals through late May and the NBA Finals begin in June typically concluding by mid-June.'
        }
      ]}
      relatedSlugs={['super-bowl', 'march-madness', 'world-series']}
    />
  )
}
