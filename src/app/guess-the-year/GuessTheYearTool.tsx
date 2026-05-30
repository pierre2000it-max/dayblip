"use client";
import { useState, useCallback } from "react";
import ShareButtons from "@/components/ShareButtons";

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
  { event:"Twitter was founded", year:2006 },
  { event:"Amazon was founded", year:1994 },
  { event:"Harry Potter first published", year:1997 },
  { event:"Titanic movie released", year:1997 },
  { event:"September 11 attacks occurred", year:2001 },
  { event:"Barack Obama first elected president", year:2008 },
  { event:"COVID-19 pandemic declared", year:2020 },
  { event:"Netflix started streaming", year:2007 },
  { event:"Snapchat was founded", year:2011 },
  { event:"TikTok launched globally", year:2016 },
  { event:"Spotify launched", year:2008 },
  { event:"Bitcoin was created", year:2009 },
  { event:"The first Star Wars movie released", year:1977 },
  { event:"Disneyland opened", year:1955 },
  { event:"McDonald's was founded", year:1940 },
  { event:"First email was sent", year:1971 },
  { event:"ChatGPT launched publicly", year:2022 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

function scoreRound(guess: number, actual: number): number {
  const diff = Math.abs(guess - actual);
  if (diff === 0) return 100;
  if (diff <= 1) return 90;
  if (diff <= 5) return 70;
  if (diff <= 10) return 50;
  if (diff <= 20) return 25;
  return 0;
}

function getGrade(score: number): string {
  if (score >= 900) return "History Genius! 🏆";
  if (score >= 700) return "History Expert! 🌟";
  if (score >= 500) return "History Student! 📚";
  if (score >= 300) return "Keep Learning! 🤓";
  return "History Needs Work! 😅";
}

export default function GuessTheYearTool() {
  const [questions, setQuestions] = useState(() => shuffle(ALL_EVENTS).slice(0,10));
  const [qIndex,   setQIndex]   = useState(0);
  const [guess,    setGuess]    = useState("1990");
  const [feedback, setFeedback] = useState<{pts:number;diff:number}|null>(null);
  const [score,    setScore]    = useState(0);
  const [done,     setDone]     = useState(false);

  const q = questions[qIndex];

  const submit = () => {
    if (feedback) return;
    const g   = parseInt(guess, 10);
    if (isNaN(g)) return;
    const pts = scoreRound(g, q.year);
    setScore(s => s+pts);
    setFeedback({ pts, diff: Math.abs(g-q.year) });
  };

  const next = () => {
    if (qIndex+1 >= 10) setDone(true);
    else { setQIndex(i=>i+1); setFeedback(null); setGuess("1990"); }
  };

  const restart = useCallback(() => {
    setQuestions(shuffle(ALL_EVENTS).slice(0,10));
    setQIndex(0); setGuess("1990"); setFeedback(null); setScore(0); setDone(false);
  }, []);


  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">📅</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Guess the Year</h1>
          <p className="text-lg text-[#a8a8b3]">How good is your historical knowledge?</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[600px]">
          {!done ? (
            <div className="space-y-6">
              <div className="flex justify-between text-sm text-[#a8a8b3]">
                <span>Question {qIndex+1} of 10</span>
                <span>Score: {score}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#0f3460]">
                <div className="h-full rounded-full bg-[#e94560]" style={{width:`${(qIndex/10)*100}%`}} />
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <p className="text-center text-[#a8a8b3] text-sm mb-2">What year did this happen?</p>
                <p className="text-center text-xl font-bold text-white mb-6">&ldquo;{q.event}&rdquo;</p>

                <div className="flex gap-2 justify-center mb-4">
                  <button onClick={() => setGuess(s => String(parseInt(s,10)-10))} className="rounded-lg bg-[#16213e] border border-[#0f3460] px-4 py-2 text-white hover:border-[#e94560]">−10</button>
                  <button onClick={() => setGuess(s => String(parseInt(s,10)-1))}  className="rounded-lg bg-[#16213e] border border-[#0f3460] px-4 py-2 text-white hover:border-[#e94560]">−1</button>
                  <input type="number" value={guess} onChange={e=>setGuess(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}
                    className="w-28 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-2 text-center text-2xl font-bold text-white focus:border-[#e94560] focus:outline-none" />
                  <button onClick={() => setGuess(s => String(parseInt(s,10)+1))}  className="rounded-lg bg-[#16213e] border border-[#0f3460] px-4 py-2 text-white hover:border-[#e94560]">+1</button>
                  <button onClick={() => setGuess(s => String(parseInt(s,10)+10))} className="rounded-lg bg-[#16213e] border border-[#0f3460] px-4 py-2 text-white hover:border-[#e94560]">+10</button>
                </div>

                <button onClick={submit} disabled={!!feedback}
                  className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40">
                  Lock In Answer →
                </button>
              </div>

              {feedback && (
                <div className={`rounded-xl border p-5 text-center ${feedback.pts>0?"border-green-500/30 bg-green-900/20":"border-red-500/30 bg-red-900/20"}`}>
                  <p className="text-2xl font-bold mb-1" style={{color:feedback.pts>0?"#4ade80":"#f87171"}}>
                    +{feedback.pts} points!
                  </p>
                  <p className="text-white">Correct answer: <strong>{q.year}</strong></p>
                  {feedback.diff === 0 ? <p className="text-green-400 text-sm">Perfect! 🎯</p>
                    : <p className="text-[#a8a8b3] text-sm">You were {feedback.diff} year{feedback.diff!==1?"s":""} off</p>}
                  <button onClick={next} className="mt-3 rounded-lg bg-[#e94560] px-5 py-2 font-semibold text-white transition-opacity hover:opacity-90">
                    {qIndex+1>=10 ? "See Results" : "Next Question →"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-8 text-center space-y-4">
              <h2 className="text-3xl font-black text-white">Quiz Complete!</h2>
              <p className="text-6xl font-black text-[#e94560]">{score}<span className="text-2xl text-[#a8a8b3]">/1000</span></p>
              <p className="text-xl text-white">{getGrade(score)}</p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button onClick={restart} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Play Again</button>
              </div>
              <ShareButtons
                text={`I scored ${score}/1000 on Guess the Year! Can you beat me?`}
                url="https://dayblip.com/guess-the-year"
                title="Guess the Year Quiz"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
