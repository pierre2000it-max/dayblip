'use client'
import { useState } from 'react'
import ShareButtons from '@/components/ShareButtons'
import FAQAccordion from '@/components/FAQAccordion'
import AuthorByline from '@/components/AuthorByline'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedTools from '@/components/RelatedTools'
import LastUpdated from '@/components/LastUpdated'
import MethodologyNote from '@/components/MethodologyNote'

type PetType = 'dog-small' | 'dog-medium' | 'dog-large' | 'cat'

const LIFE_EXPECTANCY: Record<PetType, number> = {
  'dog-small': 15,
  'dog-medium': 13,
  'dog-large': 10,
  'cat': 15,
}

export default function TimeWithPetPage() {
  const [petAge, setPetAge] = useState('')
  const [petType, setPetType] = useState<PetType>('dog-medium')
  const [walksPerDay, setWalksPerDay] = useState('2')
  const [result, setResult] = useState<{
    yearsLeft: number
    walksLeft: number
    cuddleHoursLeft: number
    daysLeft: number
    lifeExpectancy: number
  } | null>(null)

  function calculate() {
    const age = parseFloat(petAge)
    const wpd = parseFloat(walksPerDay)
    if (isNaN(age) || age < 0) return

    const lifeExp = LIFE_EXPECTANCY[petType]
    const yearsLeft = Math.max(0, lifeExp - age)
    const daysLeft = Math.round(yearsLeft * 365)
    const walksLeft = petType === 'cat' ? 0 : Math.round(daysLeft * wpd)
    const cuddleHoursLeft = Math.round(daysLeft * 1)

    setResult({ yearsLeft, walksLeft, cuddleHoursLeft, daysLeft, lifeExpectancy: lifeExp })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#1e2d4a',
    color: '#ffffff',
    border: '1px solid #2a3f5f',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none',
  }

  const isDog = petType !== 'cat'

  const faqItems = [
    {
      question: 'How long do dogs live on average?',
      answer: 'Dog life expectancy varies significantly by size. Small dogs (under 20 lbs) typically live 12-16 years with an average of about 15 years. Medium dogs (20-50 lbs) live 10-15 years averaging around 13 years. Large dogs (over 50 lbs) typically live 8-12 years averaging around 10 years. The size-longevity relationship in dogs is one of the most consistent findings in veterinary research.'
    },
    {
      question: 'How long do cats live on average?',
      answer: 'Indoor cats live an average of 12-18 years with many reaching 15 or older. Outdoor cats have significantly shorter life expectancies of 5-7 years due to environmental risks. This calculator uses 15 years as the indoor cat baseline. A well-cared-for indoor cat can live into their 20s — the oldest recorded cat lived to 38.'
    },
    {
      question: 'How many walks does a dog need per day?',
      answer: 'Most veterinarians recommend 2-3 walks per day for adult dogs, though this varies by breed, age, and energy level. High-energy breeds like Border Collies and Huskies may need 4-5 walks. Senior dogs may prefer 2 shorter walks. The calculator defaults to 2 walks per day as a conservative estimate.'
    },
    {
      question: 'Why does dog size affect lifespan?',
      answer: 'The size-lifespan relationship in dogs is the opposite of most mammals — larger dogs age faster at the cellular level. Research suggests that large dogs\' rapid early growth may accelerate aging processes. A Great Dane at 7 is equivalent in age to an 8-year-old small dog in terms of cellular aging and health markers.'
    },
    {
      question: 'How can I extend my pet\'s life?',
      answer: 'The most impactful factors are maintaining a healthy weight (obesity reduces dog lifespan by up to 2 years), regular veterinary check-ups including annual dental cleanings, daily exercise appropriate to breed and age, a high-quality diet, and mental stimulation. Dogs and cats with active owners and consistent routines tend to live longer.'
    },
    {
      question: 'Is this calculator accurate for my specific breed?',
      answer: 'The calculator uses average life expectancy by size category. Specific breeds vary — Chihuahuas often live 17-20 years while Great Danes average 8-10 years. Purebred dogs tend to have more predictable lifespans than mixed breeds. For a breed-specific estimate, consult your veterinarian or the American Kennel Club breed health data.'
    }
  ]

  return (
    <main style={{ background: '#0d1b2a', minHeight: '100vh', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How long do dogs live on average?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Small dogs live ~15 years, medium dogs ~13 years, large dogs ~10 years. The size-longevity relationship in dogs is one of the most consistent findings in veterinary research.'
                }
              },
              {
                '@type': 'Question',
                name: 'How long do cats live on average?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Indoor cats live an average of 12-18 years with many reaching 15 or older. This calculator uses 15 years as the indoor cat baseline.'
                }
              },
              {
                '@type': 'Question',
                name: 'How can I extend my pet\'s life?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Maintain a healthy weight, schedule regular veterinary check-ups, provide daily exercise, feed a high-quality diet, and offer mental stimulation.'
                }
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Time Left With Your Pet Calculator',
            url: 'https://www.dayblip.com/tools/time-with-pet',
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: 'Calculate how many years, walks, and cuddles you have left with your dog or cat based on their age and size. Free, no signup required.'
          })
        }}
      />

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'Time With Your Pet' }
        ]} />

        <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '24px 0 8px' }}>
          Time Left With Your Pet
        </h1>
        <p style={{ color: '#a8a8b3', fontSize: '16px', margin: '0 0 24px', lineHeight: '1.6' }}>
          Dogs and cats live 10-15 years. The time flies faster than you think. Here is how many walks, cuddles, and days you have left together.
        </p>

        {/* Quick Answer */}
        <div style={{ background: '#1e2d4a', borderLeft: '4px solid #e94560', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }}>
          <div style={{ color: '#e94560', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: '600' }}>
            Quick Answer
          </div>
          {result ? (
            <p style={{ color: '#e2e8f0', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>
              You have approximately <strong style={{ color: '#ffffff' }}>{result.yearsLeft.toFixed(1)} years</strong>,{' '}
              <strong style={{ color: '#ffffff' }}>{result.daysLeft.toLocaleString()} days</strong>, and{' '}
              <strong style={{ color: '#ffffff' }}>{result.cuddleHoursLeft.toLocaleString()} hours</strong> of cuddle time remaining with your pet.
            </p>
          ) : (
            <p style={{ color: '#e2e8f0', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>
              A 3-year-old medium dog has approximately 10 years, 7,300 walks, and 3,650 hours of cuddle time remaining. Enter your pet&apos;s details below.
            </p>
          )}
        </div>

        <AuthorByline variant="tool" />

        {/* Inputs */}
        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '32px 0 16px' }}>
          Calculate Your Time
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Pet type
          </label>
          <select
            value={petType}
            onChange={e => setPetType(e.target.value as PetType)}
            style={{ ...inputStyle, appearance: 'none' }}
          >
            <option value="dog-small">Small Dog (under 20 lbs)</option>
            <option value="dog-medium">Medium Dog (20–50 lbs)</option>
            <option value="dog-large">Large Dog (50+ lbs)</option>
            <option value="cat">Cat</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Your pet&apos;s current age
          </label>
          <input
            type="number"
            min="0"
            max="20"
            placeholder="e.g. 3"
            value={petAge}
            onChange={e => setPetAge(e.target.value)}
            style={inputStyle}
          />
        </div>

        {isDog && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
              Daily walks (dogs only)
            </label>
            <input
              type="number"
              min="0"
              max="5"
              placeholder="e.g. 2"
              value={walksPerDay}
              onChange={e => setWalksPerDay(e.target.value)}
              style={inputStyle}
            />
          </div>
        )}

        <button
          onClick={calculate}
          style={{
            width: '100%',
            background: '#e94560',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '8px'
          }}
        >
          Calculate My Time
        </button>

        {/* Result */}
        {result && (
          <div style={{ margin: '40px 0' }}>
            <div style={{
              background: '#1e2d4a',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              marginBottom: '24px',
              borderTop: '4px solid #e94560'
            }}>
              <p style={{ color: '#a8a8b3', fontSize: '15px', margin: '0 0 8px' }}>
                You have approximately
              </p>
              <div style={{ color: '#e94560', fontSize: '64px', fontWeight: '800', lineHeight: 1, margin: '0 0 8px' }}>
                {result.yearsLeft.toFixed(1)}
              </div>
              <p style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: '0 0 24px' }}>
                years left together
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                borderTop: '1px solid #0d1b2a',
                paddingTop: '24px'
              }}>
                <div>
                  <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700' }}>{result.daysLeft.toLocaleString()}</div>
                  <div style={{ color: '#a8a8b3', fontSize: '13px' }}>days together</div>
                </div>
                <div>
                  <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700' }}>
                    {result.walksLeft > 0 ? result.walksLeft.toLocaleString() : 'N/A'}
                  </div>
                  <div style={{ color: '#a8a8b3', fontSize: '13px' }}>walks remaining</div>
                </div>
                <div>
                  <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700' }}>{result.cuddleHoursLeft.toLocaleString()}</div>
                  <div style={{ color: '#a8a8b3', fontSize: '13px' }}>hours of cuddle time</div>
                </div>
                <div>
                  <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700' }}>{result.lifeExpectancy}</div>
                  <div style={{ color: '#a8a8b3', fontSize: '13px' }}>year life expectancy</div>
                </div>
              </div>
            </div>

            <div style={{
              background: '#0d1b2a',
              borderRadius: '12px',
              padding: '20px 24px',
              marginBottom: '24px',
              borderLeft: '4px solid #e94560'
            }}>
              <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.8', margin: 0 }}>
                {result.yearsLeft < 2
                  ? 'Every single walk matters now. Every morning they are still there is a gift.'
                  : result.yearsLeft < 5
                  ? 'The middle years feel long but pass quickly. The time you have is real and precious.'
                  : 'You have beautiful time ahead. The calculator is not a warning — it is a reminder to be present.'
                }
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
                Share this with a fellow pet lover
              </p>
              <ShareButtons
                text={`I just calculated that I have ${result.yearsLeft.toFixed(1)} years and ${result.walksLeft.toLocaleString()} walks left with my dog. Going on an extra walk today. Calculate yours at Dayblip 🐾`}
                url="https://www.dayblip.com/tools/time-with-pet"
                title="How many walks do you have left with your dog?"
                tiktokText={`POV: you calculate how many walks you have left with your dog 🐾 Mine has ${result.walksLeft.toLocaleString()} walks left. Going outside right now. #dogsoftiktok #lifecalculator`}
                instagramText={`${result.yearsLeft.toFixed(1)} years and ${result.walksLeft.toLocaleString()} walks left with my dog 🐾 This calculator made me tear up. dayblip.com/tools/time-with-pet`}
              />
            </div>
          </div>
        )}

        {/* Context */}
        <div style={{ margin: '40px 0' }}>
          <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>
            Why the Number Matters
          </h2>
          <p style={{ color: '#a8a8b3', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
            Pets live entirely in the present. They do not know they are running out of time — but we do. That awareness is both a weight and a gift. It is what makes every walk, every nap together, every greeting at the door feel like more than routine.
          </p>
          <p style={{ color: '#a8a8b3', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
            A medium-sized dog adopted at 8 weeks has approximately 13 years of life. If you walk them twice a day, that is roughly 9,490 walks over their entire life. You have already used some of those. The ones remaining are not infinite.
          </p>
          <p style={{ color: '#a8a8b3', fontSize: '15px', lineHeight: '1.8' }}>
            This calculator is not meant to make you sad. It is meant to make the next walk feel like what it is — one of a numbered and precious set of moments with a creature that loves you completely.
          </p>
        </div>

        <FAQAccordion items={faqItems} />

        <RelatedTools tools={[
          { emoji: '👴', title: 'Time With Your Parents', desc: 'How many visits remain', href: '/tools/time-with-parents' },
          { emoji: '👶', title: 'Time With Your Kids', desc: 'Summers before they leave home', href: '/tools/time-with-kids' },
          { emoji: '📅', title: 'Life in Weeks', desc: 'Your entire life on one grid', href: '/tools/life-in-weeks' },
          { emoji: '📆', title: 'Life in Numbers', desc: 'Your life by the numbers', href: '/tools/life-in-numbers' }
        ]} />

        <LastUpdated date="June 2026" />

        <MethodologyNote text="Dog life expectancy figures are based on data from the American Kennel Club and Journal of Veterinary Internal Medicine studies on size-based canine longevity. Cat life expectancy of 15 years reflects average indoor cat lifespan from American Veterinary Medical Association data. Walk counts assume consistent daily walks for the life of the pet. Cuddle hours assume 1 hour per day average of close contact time. Individual pet health, breed, diet, and veterinary care significantly affect actual longevity." />
      </div>
    </main>
  )
}
