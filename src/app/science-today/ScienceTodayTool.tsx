"use client";
import { useState, useEffect } from "react";

const MONTH_SLUG = ["january","february","march","april","may","june","july","august","september","october","november","december"];

const SCIENCE_DB: Record<string, {year:number;event:string}[]> = {
  "january-1": [{year:1801,event:"Dwarf planet Ceres discovered by Giuseppe Piazzi"},{year:1925,event:"Edwin Hubble announced existence of other galaxies"}],
  "january-15": [{year:1908,event:"Henri Becquerel, discoverer of radioactivity, born in 1852"},{year:2001,event:"Wikipedia, the world's largest science reference, launched"}],
  "february-14": [{year:1876,event:"Alexander Graham Bell applied for telephone patent"},{year:1990,event:"Voyager 1 took famous Pale Blue Dot photo of Earth"}],
  "march-14": [{year:1879,event:"Albert Einstein born in Ulm, Germany"},{year:1995,event:"Norman Thagard became first American on Russian space station Mir"}],
  "april-12": [{year:1961,event:"Yuri Gagarin became first human in space"},{year:1981,event:"First Space Shuttle Columbia launched"}],
  "april-25": [{year:1953,event:"Watson and Crick published DNA double helix structure"},{year:1990,event:"Hubble Space Telescope launched into orbit"}],
  "june-16": [{year:1963,event:"Valentina Tereshkova became first woman in space"},{year:1884,event:"First roller coaster opened at Coney Island"}],
  "july-4": [{year:1997,event:"Mars Pathfinder landed on Mars surface"},{year:2012,event:"Higgs boson particle confirmed at CERN"}],
  "july-20": [{year:1969,event:"Apollo 11 landed on the moon, Armstrong walked"},{year:1976,event:"Viking 1 lander touched down on Mars"}],
  "august-6": [{year:1945,event:"First atomic bomb dropped on Hiroshima, Japan"},{year:2012,event:"Curiosity rover successfully landed on Mars"}],
  "september-12": [{year:1962,event:"JFK gave famous We choose to go to the moon speech"},{year:1992,event:"Mae Jemison became first Black woman in space"}],
  "october-4": [{year:1957,event:"Sputnik launched, first artificial satellite in orbit"},{year:2004,event:"SpaceShipOne won Ansari X Prize for private spaceflight"}],
  "november-8": [{year:1895,event:"Wilhelm Rontgen discovered X-rays"},{year:1656,event:"Edmund Halley born, discoverer of Halley's Comet"}],
  "december-17": [{year:1903,event:"Wright Brothers made first successful airplane flight"},{year:1999,event:"First piece of International Space Station launched"}],
  "december-25": [{year:1642,event:"Isaac Newton born in Woolsthorpe, England"},{year:1990,event:"Tim Berners-Lee made first successful HTTP connection"}],
};

const RANDOM_FACTS = [
  "There are more trees on Earth than stars in the Milky Way galaxy",
  "Honey never expires — archaeologists found 3,000-year-old edible honey in Egyptian tombs",
  "A teaspoon of neutron star material would weigh about 10 million tonnes",
  "The human brain generates about 70,000 thoughts per day",
  "Light from the sun takes 8 minutes to reach Earth",
  "The average cloud weighs 1.1 million pounds",
];

export default function ScienceTodayTool() {
  const [today, setToday] = useState<Date|null>(null);

  useEffect(() => { setToday(new Date()); }, []);

  if (!today) return null;

  const slug = `${MONTH_SLUG[today.getMonth()]}-${today.getDate()}`;
  const events = SCIENCE_DB[slug] ?? null;
  const dateLabel = today.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🔬</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">This Day in Science</h1>
          <p className="text-lg text-[#a8a8b3]">Scientific discoveries and inventions that happened on this date</p>
          <div className="mt-4 inline-block rounded-full border border-[#e94560]/40 bg-[#e94560]/10 px-4 py-1.5 text-sm text-[#e94560]">{dateLabel}</div>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-6">
          {events ? (
            <>
              <h2 className="text-xl font-bold text-white">🔭 Science Events on This Date</h2>
              {events.map((e,i) => (
                <div key={i} className="flex gap-4 rounded-xl bg-[#1a1a2e] border border-[#0f3460] px-5 py-4 items-start">
                  <span className="text-xl font-bold text-[#e94560] shrink-0">{e.year}</span>
                  <p className="text-white">{e.event}</p>
                </div>
              ))}
            </>
          ) : (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center">
              <p className="text-white font-semibold mb-2">Science never stops — but we haven&apos;t added this date yet.</p>
              <p className="text-[#a8a8b3] text-sm mb-6">Check back soon! In the meantime, enjoy these science facts:</p>
              {RANDOM_FACTS.slice(0,3).map(f=>(
                <div key={f} className="flex gap-2 mb-3 text-left">
                  <span className="text-[#e94560] shrink-0">→</span>
                  <span className="text-[#a8a8b3] text-sm">{f}</span>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h3 className="font-bold text-white mb-3">⚡ Science Fact of the Day</h3>
            <p className="text-[#a8a8b3]">{RANDOM_FACTS[today.getDate() % RANDOM_FACTS.length]}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
