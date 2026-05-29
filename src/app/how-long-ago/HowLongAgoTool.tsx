"use client";
import { useState, useCallback } from "react";

const CURRENT_YEAR = 2026;

const ALL_EVENTS = [
  { event:"Neil Armstrong walked on the moon", year:1969 },
  { event:"The Berlin Wall fell", year:1989 },
  { event:"Facebook was founded", year:2004 },
  { event:"The first iPhone was released", year:2007 },
  { event:"World War 2 ended", year:1945 },
  { event:"Google was founded", year:1998 },
  { event:"YouTube launched", year:2005 },
  { event:"Wikipedia launched", year:2001 },
  { event:"The Titanic sank", year:1912 },
  { event:"Nelson Mandela became president", year:1994 },
  { event:"The Soviet Union dissolved", year:1991 },
  { event:"Princess Diana passed away", year:1997 },
  { event:"Instagram launched", year:2010 },
  { event:"Amazon was founded", year:1994 },
  { event:"September 11 attacks occurred", year:2001 },
  { event:"Barack Obama first elected president", year:2008 },
  { event:"COVID-19 pandemic declared", year:2020 },
  { event:"Spotify launched", year:2008 },
  { event:"Bitcoin was created", year:2009 },
  { event:"The first Star Wars movie released", year:1977 },
  { event:"Disneyland opened", year:1955 },
  { event:"ChatGPT launched publicly", year:2022 },
];

function shuffle<T>(arr: T[]): T[] {
  const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a;
}

function scoreRound(guessYearsAgo: number, actualYearsAgo: number): number {
  const diff = Math.abs(guessYearsAgo - actualYearsAgo);
  if (diff===0) return 100; if (diff<=2) return 85; if (diff<=5) return 70;
  if (diff<=10) return 50; if (diff<=20) return 25; return 0;
}

function getGrade(score: number): string {
  if (score>=900) return "History Genius! 🏆"; if (score>=700) return "History Expert! 🌟";
  if (score>=500) return "History Student! 📚"; if (score>=300) return "Keep Learning! 🤓";
  return "History Needs Work! 😅";
}

export default function HowLongAgoTool() {
  const [questions, setQuestions] = useState(() => shuffle(ALL_EVENTS).slice(0,10));
  const [qIndex,    setQIndex]    = useState(0);
  const [sliderVal, setSliderVal] = useState(50);
  const [feedback,  setFeedback]  = useState<{pts:number;actual:number;guess:number}|null>(null);
  const [score,     setScore]     = useState(0);
  const [done,      setDone]      = useState(false);

  const q = questions[qIndex];
  const actualAgo = CURRENT_YEAR - q.year;

  const submit = () => {
    if (feedback) return;
    const pts = scoreRound(sliderVal, actualAgo);
    setScore(s=>s+pts);
    setFeedback({ pts, actual:actualAgo, guess:sliderVal });
  };

  const next = () => {
    if (qIndex+1>=10) setDone(true);
    else { setQIndex(i=>i+1); setFeedback(null); setSliderVal(50); }
  };

  const restart = useCallback(() => {
    setQuestions(shuffle(ALL_EVENTS).slice(0,10));
    setQIndex(0); setSliderVal(50); setFeedback(null); setScore(0); setDone(false);
  },[]);

  const shareText = encodeURIComponent(`I scored ${score}/1000 on the How Long Ago quiz!\nCan you beat me? dayblip.com/how-long-ago`);

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🎚️</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">How Long Ago?</h1>
          <p className="text-lg text-[#a8a8b3]">Drag the slider to guess how many years ago these events happened</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[600px]">
          {!done ? (
            <div className="space-y-6">
              <div className="flex justify-between text-sm text-[#a8a8b3]">
                <span>Round {qIndex+1} of 10</span><span>Score: {score}</span>
              </div>
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <p className="text-center text-[#a8a8b3] text-sm mb-2">How many years ago did this happen?</p>
                <p className="text-center text-xl font-bold text-white mb-8">&ldquo;{q.event}&rdquo;</p>

                <div className="text-center text-4xl font-black text-[#e94560] mb-4">{sliderVal} years ago</div>
                <div className="text-center text-sm text-[#a8a8b3] mb-4">(That would be {CURRENT_YEAR-sliderVal})</div>

                <input type="range" min={0} max={120} value={feedback ? feedback.actual : sliderVal}
                  onChange={e => !feedback && setSliderVal(Number(e.target.value))}
                  className="w-full accent-[#e94560]"
                  style={feedback ? {accentColor:"#4ade80"} : {}}
                />
                <div className="flex justify-between text-xs text-[#a8a8b3] mt-1">
                  <span>Just now</span><span>120 years ago</span>
                </div>

                {!feedback && (
                  <button onClick={submit} className="mt-4 w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">
                    Lock In Answer →
                  </button>
                )}
              </div>

              {feedback && (
                <div className={`rounded-xl border p-5 text-center ${feedback.pts>0?"border-green-500/30 bg-green-900/20":"border-red-500/30 bg-red-900/20"}`}>
                  <p className="text-2xl font-bold mb-1" style={{color:feedback.pts>0?"#4ade80":"#f87171"}}>+{feedback.pts} points!</p>
                  <p className="text-white">Correct: <strong>{feedback.actual} years ago ({q.year})</strong></p>
                  <p className="text-[#a8a8b3] text-sm">You guessed {feedback.guess} — {Math.abs(feedback.guess-feedback.actual)} year{Math.abs(feedback.guess-feedback.actual)!==1?"s":""} off</p>
                  <button onClick={next} className="mt-3 rounded-lg bg-[#e94560] px-5 py-2 font-semibold text-white transition-opacity hover:opacity-90">
                    {qIndex+1>=10?"See Results":"Next →"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-8 text-center space-y-4">
              <h2 className="text-3xl font-black text-white">Game Over!</h2>
              <p className="text-6xl font-black text-[#e94560]">{score}<span className="text-2xl text-[#a8a8b3]">/1000</span></p>
              <p className="text-xl text-white">{getGrade(score)}</p>
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
