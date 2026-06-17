import { notFound } from 'next/navigation'
import SportsCountdown from '@/app/days-until/sports-countdown'
import { getSportEvent } from '@/data/sports-events'

export default function WorldSeriesPage() {
  const event = getSportEvent('world-series')
  if (!event) notFound()

  return (
    <SportsCountdown
      event={event}
      faqItems={[
        {
          question: 'When is the 2026 World Series?',
          answer: 'The 2026 MLB World Series is expected to begin in late October 2026. The exact date is confirmed after the American League and National League Championship Series conclude. Game 1 of the World Series is typically scheduled for the last week of October. This page will update when the official date is announced by MLB.'
        },
        {
          question: 'What is the World Series?',
          answer: 'The World Series is the annual championship series of Major League Baseball played between the American League champion and the National League champion. It is a best-of-seven series — the first team to win four games wins the title. The World Series has been played every year since 1903 with the exception of 1904 and 1994.'
        },
        {
          question: 'How many games are in the World Series?',
          answer: 'The World Series is a best-of-seven series. The first team to win four games is crowned MLB champion. The series can end in as few as four games (a sweep) or go as many as seven games. Home field advantage alternates between the two leagues and is awarded to the team with the better regular season record since 2017.'
        },
        {
          question: 'Where is the 2026 World Series played?',
          answer: 'The 2026 World Series home field is determined by which team wins the American League and National League pennants. Games alternate between the home stadiums of the two pennant winners. The team with the better regular season record receives home field advantage — meaning Games 1 2 6 and 7 would be played at their stadium.'
        },
        {
          question: 'Who won the last World Series?',
          answer: 'The most recent World Series was played in October 2025. Check the MLB website or ESPN for the current champion. The countdown on this page tracks the next World Series in October 2026.'
        },
        {
          question: 'How long is the MLB season before the World Series?',
          answer: 'The MLB regular season runs from late March through late September — 162 games per team over approximately six months. After the regular season the playoffs begin with the Wild Card Series followed by the Division Series then the Championship Series and finally the World Series in October.'
        }
      ]}
      relatedSlugs={['super-bowl', 'march-madness', 'nba-finals']}
    />
  )
}
