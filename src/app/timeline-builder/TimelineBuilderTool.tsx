"use client";
import { useState, useCallback } from "react";

const ALL_EVENTS = [
  { event:"Titanic sank", year:1912 },
  { event:"World War 2 ended", year:1945 },
  { event:"Moon landing", year:1969 },
  { event:"Berlin Wall fell", year:1989 },
  { event:"Google founded", year:1998 },
  { event:"Wikipedia launched", year:2001 },
  { event:"Facebook founded", year:2004 },
  { event:"iPhone released", year:2007 },
  { event:"Instagram launched", year:2010 },
  { event:"COVID-19 pandemic", year:2020 },
  { event:"ChatGPT launched", year:2022 },
  { event:"Disneyland opened", year:1955 },
  { event:"First Star Wars movie", year:1977 },
  { event:"Amazon founded", year:1994 },
  { event:"YouTube launched", year:2005 },
  { event:"Soviet Union dissolved", year:1991 },
  { event:"McDonald's founded", year:1940 },
  { event:"First email sent", year:1971 },
  { event:"Spotify launched", year:2008 },
  { event:"Bitcoin created", year:2009 },
];

function shuffle<T>(arr: T[]): T[] {
  const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a;
}

function scoreRound(order: {year:number}[], correct: {year:number}[]): number {
  let correct5 = 0;
  order.forEach((e,i) => { if (e.year === correct[i].year) correct5++; });
  return [0,10,25,50,75,100][correct5];
}

export default function TimelineBuilderTool() {
  const getNextRound = () => shuffle(ALL_EVENTS).slice(0,5).sort(()=>Math.random()-0.5);
  const [correct5,   setCorrect5]   = useState(() => [...getNextRound()].sort((a,b)=>a.year-b.year));
  const [order,      setOrder]      = useState(() => shuffle([...correct5]));
  const [submitted,  setSubmitted]  = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [round,      setRound]      = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [done,       setDone]       = useState(false);

  const moveUp = (i: number) => {
    if (submitted || i===0) return;
    const n=[...order]; [n[i-1],n[i]]=[n[i],n[i-1]]; setOrder(n);
  };
  const moveDown = (i: number) => {
    if (submitted || i===order.length-1) return;
    const n=[...order]; [n[i],n[i+1]]=[n[i+1],n[i]]; setOrder(n);
  };

  const submit = () => {
    const pts = scoreRound(order, correct5);
    setRoundScore(pts);
    setTotalScore(t=>t+pts);
    setSubmitted(true);
  };

  const nextRound = useCallback(() => {
    if (round>=3) { setDone(true); return; }
    const newCorrect = [...getNextRound()].sort((a,b)=>a.year-b.year);
    setCorrect5(newCorrect);
    setOrder(shuffle([...newCorrect]));
    setSubmitted(false); setRoundScore(0); setRound(r=>r+1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[round]);

  const restart = useCallback(() => {
    const nc=[...getNextRound()].sort((a,b)=>a.year-b.year);
    setCorrect5(nc); setOrder(shuffle([...nc]));
    setSubmitted(false); setRoundScore(0); setRound(1); setTotalScore(0); setDone(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const getColor = (i: number) => {
    if (!submitted) return "border-[#0f3460]";
    return order[i].year===correct5[i].year ? "border-green-500" : "border-red-500";
  };

  const shareText = encodeURIComponent(`I scored ${totalScore}/300 on the Timeline Builder!\ndayblip.com/timeline-builder`);

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">📋</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Timeline Builder</h1>
          <p className="text-lg text-[#a8a8b3]">Put these historical events in the correct chronological order</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[600px]">
          {!done ? (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-[#a8a8b3]">
                <span>Round {round} of 3</span><span>Total: {totalScore}/300</span>
              </div>
              <p className="text-white text-sm text-center">Use ↑↓ arrows to sort from oldest to newest</p>
              {order.map((e,i) => (
                <div key={`${e.year}-${e.event}`} className={`flex items-center gap-3 rounded-xl border bg-[#1a1a2e] p-4 ${getColor(i)}`}>
                  <div className="flex flex-col gap-1">
                    <button onClick={()=>moveUp(i)} disabled={submitted||i===0} className="rounded px-2 py-0.5 text-[#a8a8b3] hover:text-white disabled:opacity-30 text-lg">↑</button>
                    <button onClick={()=>moveDown(i)} disabled={submitted||i===order.length-1} className="rounded px-2 py-0.5 text-[#a8a8b3] hover:text-white disabled:opacity-30 text-lg">↓</button>
                  </div>
                  <span className="font-semibold text-white flex-1">{e.event}</span>
                  {submitted && <span className="text-[#e94560] font-bold text-sm shrink-0">{e.year}</span>}
                </div>
              ))}

              {!submitted ? (
                <button onClick={submit} className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">Submit Order →</button>
              ) : (
                <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-5 text-center">
                  <p className="text-2xl font-bold text-[#e94560]">+{roundScore} points</p>
                  <p className="text-[#a8a8b3] text-sm mt-1">Correct order shown in red</p>
                  <button onClick={nextRound} className="mt-3 rounded-lg bg-[#e94560] px-5 py-2 font-semibold text-white transition-opacity hover:opacity-90">
                    {round>=3?"See Results":"Next Round →"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-8 text-center space-y-4">
              <h2 className="text-3xl font-black text-white">Done!</h2>
              <p className="text-6xl font-black text-[#e94560]">{totalScore}<span className="text-2xl text-[#a8a8b3]">/300</span></p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button onClick={restart} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Play Again</button>
                <a href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noopener noreferrer"
                  className="rounded-lg border border-[#333] bg-black px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Share on X →</a>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
