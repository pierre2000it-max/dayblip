"use client";
import { useState } from "react";
import ShareButtons from "@/components/ShareButtons";
import bornInRaw from "@/data/bornIn.json";
import onThisDayRaw from "@/data/onThisDay.json";

interface BornIn { year:number; worldEvent:string; funFact:string; number1Song:string; number1Movie:string }
interface OTD { events:{year:number;event:string}[] }

const bornInData   = bornInRaw    as BornIn[];
const onThisDayData = onThisDayRaw as Record<string,OTD>;

const MONTH_SLUG = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const MONTH_LONG = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getDayOfYear(d: Date): number {
  return Math.floor((d.getTime()-new Date(d.getFullYear(),0,0).getTime())/86400000);
}

function getWeather(): string {
  const weathers = ["Partly cloudy, 68°F","Sunny, 72°F","Overcast, 55°F","Light rain, 61°F","Clear skies, 75°F"];
  return weathers[Math.floor(Math.random()*weathers.length)];
}

export default function NewspaperTool() {
  const [dateInput, setDateInput] = useState("");
  const [paper,     setPaper]     = useState<{date:Date;yearData:BornIn|null;dayData:OTD|null}|null>(null);

  const show = () => {
    if (!dateInput) return;
    const date = new Date(dateInput+"T00:00:00");
    const year = date.getFullYear();
    const slug = `${MONTH_SLUG[date.getMonth()]}-${date.getDate()}`;
    setPaper({
      date,
      yearData: bornInData.find(b=>b.year===year) ?? null,
      dayData:  onThisDayData[slug] ?? null,
    });
  };

  const weather = getWeather();

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">📰</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Historical Newspaper Front Page</h1>
          <p className="text-lg text-[#a8a8b3]">See what was in the headlines on any date in history</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[800px] space-y-6">
          <div className="flex gap-3">
            <input type="date" value={dateInput} onChange={e=>setDateInput(e.target.value)}
              className="flex-1 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            <button onClick={show} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Show Headlines →</button>
          </div>

          {paper && (
            <ShareButtons
              text={`Check out the headlines from ${MONTH_LONG[paper.date.getMonth()]} ${paper.date.getDate()}, ${paper.date.getFullYear()}! Historical newspaper generator.`}
              url="https://dayblip.com/newspaper"
              title="Historical Newspaper Generator"
            />
          )}

          {paper && (
            /* Newspaper styled card */
            <div className="rounded-xl overflow-hidden" style={{background:"#f5f0e8",color:"#111",fontFamily:"Georgia,serif"}}>
              {/* Header */}
              <div style={{borderBottom:"3px double #111",padding:"12px 20px",textAlign:"center"}}>
                <div style={{fontSize:"10px",letterSpacing:"4px",marginBottom:"4px",color:"#555"}}>
                  DAY {getDayOfYear(paper.date)} OF {paper.date.getFullYear()} · WEATHER: {weather}
                </div>
                <div style={{fontSize:"36px",fontWeight:"900",fontFamily:"'Times New Roman',serif",letterSpacing:"2px"}}>
                  THE DAYBLIP DAILY
                </div>
                <div style={{fontSize:"11px",marginTop:"4px",color:"#555"}}>
                  {MONTH_LONG[paper.date.getMonth()]} {paper.date.getDate()}, {paper.date.getFullYear()} · &ldquo;All the news that fits in time&rdquo;
                </div>
              </div>

              <div style={{padding:"20px",display:"grid",gridTemplateColumns:"2fr 1fr",gap:"20px"}}>
                {/* Main column */}
                <div>
                  <div style={{borderBottom:"2px solid #111",marginBottom:"12px",paddingBottom:"4px",fontSize:"11px",fontWeight:"bold",letterSpacing:"2px"}}>
                    TOP STORY
                  </div>
                  {paper.yearData ? (
                    <>
                      <h2 style={{fontSize:"20px",fontWeight:"900",lineHeight:"1.2",marginBottom:"8px"}}>
                        {paper.yearData.worldEvent}
                      </h2>
                      <p style={{fontSize:"13px",lineHeight:"1.6",color:"#333"}}>
                        This year will be remembered for the events that shaped a generation.
                        Reports confirm that &ldquo;{paper.yearData.worldEvent.toLowerCase()}&rdquo; has captured
                        the world&apos;s attention. Meanwhile, &ldquo;{paper.yearData.number1Song}&rdquo;
                        continues to dominate the music charts.
                      </p>
                    </>
                  ) : (
                    <h2 style={{fontSize:"20px",fontWeight:"900",lineHeight:"1.2",marginBottom:"8px"}}>
                      {MONTH_LONG[paper.date.getMonth()]} {paper.date.getDate()}, {paper.date.getFullYear()}
                    </h2>
                  )}

                  {paper.dayData && paper.dayData.events.length > 0 && (
                    <div style={{marginTop:"16px",borderTop:"1px solid #999",paddingTop:"12px"}}>
                      <div style={{fontSize:"11px",fontWeight:"bold",letterSpacing:"2px",marginBottom:"8px"}}>ON THIS DAY</div>
                      {paper.dayData.events.slice(0,3).map((e,i)=>(
                        <div key={i} style={{marginBottom:"8px"}}>
                          <span style={{fontWeight:"bold",color:"#c00"}}>{e.year}: </span>
                          <span style={{fontSize:"13px"}}>{e.event}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Side column */}
                <div>
                  {paper.yearData && (
                    <>
                      <div style={{borderBottom:"2px solid #111",marginBottom:"12px",paddingBottom:"4px",fontSize:"11px",fontWeight:"bold",letterSpacing:"2px"}}>
                        CULTURE
                      </div>
                      <div style={{marginBottom:"12px"}}>
                        <div style={{fontSize:"11px",color:"#555",marginBottom:"2px"}}>🎵 #1 SONG</div>
                        <div style={{fontSize:"13px",fontWeight:"bold"}}>{paper.yearData.number1Song}</div>
                      </div>
                      <div style={{marginBottom:"12px"}}>
                        <div style={{fontSize:"11px",color:"#555",marginBottom:"2px"}}>🎬 BOX OFFICE</div>
                        <div style={{fontSize:"13px",fontWeight:"bold"}}>{paper.yearData.number1Movie}</div>
                      </div>
                      <div style={{borderTop:"1px solid #999",paddingTop:"8px",marginTop:"8px"}}>
                        <div style={{fontSize:"11px",color:"#555",marginBottom:"4px"}}>FUN FACT</div>
                        <div style={{fontSize:"12px",fontStyle:"italic"}}>{paper.yearData.funFact}</div>
                      </div>
                    </>
                  )}
                  <div style={{marginTop:"16px",border:"1px solid #999",padding:"8px",fontSize:"11px",textAlign:"center",color:"#555"}}>
                    DAYBLIP.COM<br/>Your time in perspective
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
