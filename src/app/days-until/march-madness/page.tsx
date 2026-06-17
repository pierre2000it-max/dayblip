import { notFound } from 'next/navigation'
import SportsCountdown from '@/app/days-until/sports-countdown'
import { getSportEvent } from '@/data/sports-events'

export default function MarchMadnessPage() {
  const event = getSportEvent('march-madness')
  if (!event) notFound()

  return (
    <SportsCountdown
      event={event}
      faqItems={[
        {
          question: 'When does March Madness 2027 start?',
          answer: 'March Madness 2027 typically begins in mid-March with the First Four play-in games followed by the Round of 64 the following Thursday and Friday. The exact dates are announced by the NCAA in early March after conference tournaments conclude. The national championship game is typically the first Monday of April.'
        },
        {
          question: 'What is March Madness?',
          answer: 'March Madness is the unofficial name for the NCAA Division I Men\'s Basketball Tournament — a single-elimination tournament featuring 68 college basketball teams competing for the national championship. The tournament runs for three weekends in March and early April and is one of the most watched sporting events in the United States generating over $1 billion in ad revenue.'
        },
        {
          question: 'How many teams are in March Madness?',
          answer: 'The NCAA Tournament features 68 teams — 32 automatic bids awarded to conference champions and 36 at-large bids selected by the NCAA selection committee. The First Four play-in games reduce the field to 64 teams for the Round of 64. The bracket is announced on Selection Sunday — the Sunday before the tournament begins.'
        },
        {
          question: 'What is a bracket in March Madness?',
          answer: 'A bracket is a visual representation of all 68 teams seeded 1 through 16 in four regional brackets — East West South and Midwest. Fans fill out predictions for every game before the tournament begins. The term March Madness bracket challenge refers to the widespread tradition of fans competing to predict the most correct outcomes.'
        },
        {
          question: 'When is Selection Sunday for March Madness 2027?',
          answer: 'Selection Sunday for the 2027 NCAA Tournament will be in mid-March 2027 — typically the second Sunday of March. This is when the full 68-team bracket is announced by the NCAA selection committee on live television. The exact date will be confirmed by the NCAA in advance of the 2026-2027 college basketball season.'
        },
        {
          question: 'What is the Final Four?',
          answer: 'The Final Four refers to the four teams that advance to the national semifinals of the NCAA Tournament. The Final Four games are played on a Saturday with the national championship game the following Monday. The Final Four is hosted at a pre-selected neutral site stadium and typically draws over 70,000 fans.'
        }
      ]}
      relatedSlugs={['super-bowl', 'nba-finals', 'world-series']}
    />
  )
}
