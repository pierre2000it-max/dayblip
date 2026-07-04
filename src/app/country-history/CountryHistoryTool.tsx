"use client";
import { useState } from "react";
import ShareButtons from "@/components/ShareButtons";

const COUNTRIES: Record<string, {year:number;event:string}[]> = {
  "United States": [
    {year:1776,event:"Declaration of Independence signed"},
    {year:1865,event:"Civil War ended, Lincoln assassinated"},
    {year:1929,event:"Stock Market Crash began Great Depression"},
    {year:1941,event:"Pearl Harbor attack, US enters WW2"},
    {year:1963,event:"President Kennedy assassinated in Dallas"},
    {year:1969,event:"First humans landed on the moon"},
    {year:1974,event:"Nixon resigned over Watergate scandal"},
    {year:2001,event:"September 11 terrorist attacks"},
    {year:2008,event:"Barack Obama elected first Black president"},
    {year:2020,event:"COVID-19 pandemic struck the nation"},
  ],
  "United Kingdom": [
    {year:1805,event:"Battle of Trafalgar, Nelson defeated Napoleon"},
    {year:1914,event:"Britain entered World War 1"},
    {year:1940,event:"Battle of Britain during World War 2"},
    {year:1953,event:"Queen Elizabeth II coronation"},
    {year:1982,event:"Falklands War with Argentina"},
    {year:1997,event:"Princess Diana died in Paris car crash"},
    {year:2016,event:"Brexit vote to leave European Union"},
    {year:2022,event:"Queen Elizabeth II passed away aged 96"},
  ],
  "France": [
    {year:1789,event:"French Revolution began, Bastille stormed"},
    {year:1804,event:"Napoleon Bonaparte crowned Emperor"},
    {year:1889,event:"Eiffel Tower built for World Exposition"},
    {year:1940,event:"Nazi Germany occupied France"},
    {year:1944,event:"D-Day liberation of France from Nazi rule"},
    {year:2015,event:"Paris terrorist attacks killed 130 people"},
    {year:2019,event:"Notre Dame Cathedral fire devastated Paris"},
  ],
  "Germany": [
    {year:1871,event:"German Empire unified under Bismarck"},
    {year:1933,event:"Hitler became Chancellor of Germany"},
    {year:1939,event:"Germany invaded Poland starting WW2"},
    {year:1945,event:"Germany defeated, World War 2 ended in Europe"},
    {year:1961,event:"Berlin Wall built dividing East and West"},
    {year:1989,event:"Berlin Wall fell, reunification began"},
    {year:1990,event:"East and West Germany officially reunified"},
  ],
  "Russia": [
    {year:1917,event:"Bolshevik Revolution overthrew Tsar"},
    {year:1922,event:"Soviet Union officially formed"},
    {year:1941,event:"Nazi Germany invaded Soviet Union"},
    {year:1957,event:"Sputnik launched, first satellite in space"},
    {year:1961,event:"Yuri Gagarin first human in space"},
    {year:1986,event:"Chernobyl nuclear disaster in Ukraine"},
    {year:1991,event:"Soviet Union dissolved"},
    {year:2022,event:"Russia invaded Ukraine"},
  ],
  "China": [
    {year:1912,event:"Qing Dynasty ended, Republic of China formed"},
    {year:1949,event:"Communist Party won civil war, PRC founded"},
    {year:1966,event:"Cultural Revolution began under Mao"},
    {year:1989,event:"Tiananmen Square protests crushed"},
    {year:1997,event:"Hong Kong returned from British rule"},
    {year:2008,event:"Beijing hosted Summer Olympic Games"},
    {year:2020,event:"COVID-19 pandemic originated in Wuhan"},
  ],
  "Japan": [
    {year:1941,event:"Japan attacked Pearl Harbor"},
    {year:1945,event:"Atomic bombs dropped on Hiroshima and Nagasaki"},
    {year:1964,event:"Tokyo hosted the Summer Olympic Games"},
    {year:2011,event:"Tohoku earthquake, tsunami, Fukushima disaster"},
  ],
  "India": [
    {year:1857,event:"Indian Rebellion against British rule"},
    {year:1947,event:"India gained independence from Britain"},
    {year:1948,event:"Mahatma Gandhi assassinated"},
    {year:1984,event:"Indira Gandhi assassinated"},
    {year:2014,event:"Narendra Modi elected Prime Minister"},
  ],
  "Brazil": [
    {year:1822,event:"Brazil declared independence from Portugal"},
    {year:1888,event:"Slavery abolished in Brazil"},
    {year:1960,event:"New capital Brasilia inaugurated"},
    {year:2002,event:"Brazil won its fifth World Cup"},
    {year:2016,event:"Rio de Janeiro hosted Summer Olympics"},
  ],
  "South Africa": [
    {year:1948,event:"Apartheid system officially established"},
    {year:1964,event:"Nelson Mandela sentenced to life in prison"},
    {year:1990,event:"Nelson Mandela released after 27 years"},
    {year:1994,event:"First democratic elections, Mandela president"},
    {year:2010,event:"South Africa hosted FIFA World Cup"},
  ],
};

const DECADES = ["All","1800s","1900-1919","1920-1939","1940-1959","1960-1979","1980-1999","2000-2019","2020s"];

function inDecade(year: number, d: string): boolean {
  if (d==="All") return true;
  if (d==="1800s") return year>=1800&&year<1900;
  if (d==="1900-1919") return year>=1900&&year<1920;
  if (d==="1920-1939") return year>=1920&&year<1940;
  if (d==="1940-1959") return year>=1940&&year<1960;
  if (d==="1960-1979") return year>=1960&&year<1980;
  if (d==="1980-1999") return year>=1980&&year<2000;
  if (d==="2000-2019") return year>=2000&&year<2020;
  if (d==="2020s") return year>=2020;
  return true;
}

export default function CountryHistoryTool() {
  const [country, setCountry] = useState("United States");
  const [decade,  setDecade]  = useState("All");

  const events = COUNTRIES[country].filter(e => inDecade(e.year, decade));

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[800px]">
          <div className="mb-4 text-5xl">🌍</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Historical Events by Country</h1>
          <p className="text-lg text-[#a8a8b3]">Explore major historical events from any country</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[800px] space-y-6">
          <div className="flex flex-wrap gap-3">
            <select value={country} onChange={e=>setCountry(e.target.value)}
              className="flex-1 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
              {Object.keys(COUNTRIES).map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <select value={decade} onChange={e=>setDecade(e.target.value)}
              className="w-44 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
              {DECADES.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="relative">
            <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-[#0f3460]" />
            {events.length===0 ? (
              <p className="text-[#a8a8b3] text-center py-8">No events found for this filter.</p>
            ) : events.map((e,i) => (
              <div key={i} className="relative mb-6 flex items-start gap-6">
                <div className="w-20 shrink-0 pt-0.5 text-right"><span className="text-lg font-bold text-[#e94560]">{e.year}</span></div>
                <div className="relative z-10 mt-2 h-3 w-3 shrink-0 rounded-full bg-[#e94560] ring-4 ring-[#16213e]" />
                <p className="flex-1 pt-0.5 text-white">{e.event}</p>
              </div>
            ))}
          </div>
          <ShareButtons
            text="Explore the history and key dates of every country on Dayblip!"
            url="https://www.dayblip.com/country-history"
            title="Historical Events by Country"
          />
        </div>
      </section>
    </div>
  );
}
