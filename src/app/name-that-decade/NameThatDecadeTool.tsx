"use client";
import { useState, useCallback } from "react";
import ShareButtons from "@/components/ShareButtons";

type Decade = "50s"|"60s"|"70s"|"80s"|"90s"|"00s";

const ALL_SONGS: { song:string; artist:string; decade:Decade; year:number; fact:string }[] = [
  { song:"Hound Dog", artist:"Elvis Presley", decade:"50s", year:1956, fact:"Spent 11 weeks at number 1" },
  { song:"Johnny B. Goode", artist:"Chuck Berry", decade:"50s", year:1958, fact:"Featured in Back to the Future" },
  { song:"Good Vibrations", artist:"The Beach Boys", decade:"60s", year:1966, fact:"Cost $16,000 to produce" },
  { song:"Hey Jude", artist:"The Beatles", decade:"60s", year:1968, fact:"Was number 1 for 9 weeks in the US" },
  { song:"Purple Haze", artist:"Jimi Hendrix", decade:"60s", year:1967, fact:"Written in a dream according to Hendrix" },
  { song:"Mr. Tambourine Man", artist:"Bob Dylan", decade:"60s", year:1965, fact:"Inspired the Byrds to cover it" },
  { song:"Imagine", artist:"John Lennon", decade:"70s", year:1971, fact:"One of greatest songs of the 20th century" },
  { song:"Bohemian Rhapsody", artist:"Queen", decade:"70s", year:1975, fact:"Took 3 weeks to record" },
  { song:"Stayin Alive", artist:"Bee Gees", decade:"70s", year:1977, fact:"Featured in Saturday Night Fever" },
  { song:"Hotel California", artist:"Eagles", decade:"70s", year:1977, fact:"Won Grammy for Record of the Year 1978" },
  { song:"Dancing Queen", artist:"ABBA", decade:"70s", year:1976, fact:"Only ABBA song to reach number 1 in the USA" },
  { song:"We Will Rock You", artist:"Queen", decade:"70s", year:1977, fact:"Written by Brian May in just 15 minutes" },
  { song:"Thriller", artist:"Michael Jackson", decade:"80s", year:1982, fact:"Best-selling album of all time" },
  { song:"Like a Prayer", artist:"Madonna", decade:"80s", year:1989, fact:"Video caused significant controversy" },
  { song:"Eye of the Tiger", artist:"Survivor", decade:"80s", year:1982, fact:"Written specifically for Rocky III" },
  { song:"Take On Me", artist:"a-ha", decade:"80s", year:1985, fact:"Music video took 16 weeks to produce" },
  { song:"Jump", artist:"Van Halen", decade:"80s", year:1984, fact:"Only Van Halen song to reach number 1" },
  { song:"Sweet Child O Mine", artist:"Guns N Roses", decade:"80s", year:1988, fact:"Guitar riff was originally written as a joke" },
  { song:"Smells Like Teen Spirit", artist:"Nirvana", decade:"90s", year:1991, fact:"Brought grunge music mainstream" },
  { song:"Wonderwall", artist:"Oasis", decade:"90s", year:1995, fact:"Most played song on UK radio in the 1990s" },
  { song:"Waterfalls", artist:"TLC", decade:"90s", year:1995, fact:"Spent 7 weeks at number 1" },
  { song:"Losing My Religion", artist:"REM", decade:"90s", year:1991, fact:"Won two Grammy Awards in 1992" },
  { song:"Baby One More Time", artist:"Britney Spears", decade:"90s", year:1998, fact:"Sold over 10 million copies worldwide" },
  { song:"No Scrubs", artist:"TLC", decade:"90s", year:1999, fact:"Spent 4 weeks at number 1" },
  { song:"Beautiful Day", artist:"U2", decade:"00s", year:2000, fact:"Won Grammy for Record of the Year" },
  { song:"In the End", artist:"Linkin Park", decade:"00s", year:2000, fact:"One of most streamed rock songs ever" },
  { song:"Crazy in Love", artist:"Beyonce", decade:"00s", year:2003, fact:"Won two Grammy Awards in 2004" },
  { song:"Yeah!", artist:"Usher ft Lil Jon", decade:"00s", year:2004, fact:"Spent 12 weeks at number 1" },
  { song:"Lose Yourself", artist:"Eminem", decade:"00s", year:2002, fact:"Won Academy Award for Best Original Song" },
];

function shuffle<T>(arr: T[]): T[] {
  const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a;
}

const DECADES: Decade[] = ["50s","60s","70s","80s","90s","00s"];

export default function NameThatDecadeTool() {
  const [questions, setQuestions] = useState(() => shuffle(ALL_SONGS).slice(0,10));
  const [qIndex,   setQIndex]    = useState(0);
  const [score,    setScore]     = useState(0);
  const [feedback, setFeedback]  = useState<{correct:boolean}|null>(null);
  const [done,     setDone]      = useState(false);

  const q = questions[qIndex];

  const answer = (d: Decade) => {
    if (feedback) return;
    const correct = d===q.decade;
    if (correct) setScore(s=>s+1);
    setFeedback({ correct });
  };

  const next = () => {
    if (qIndex+1>=10) setDone(true);
    else { setQIndex(i=>i+1); setFeedback(null); }
  };

  const restart = useCallback(() => {
    setQuestions(shuffle(ALL_SONGS).slice(0,10));
    setQIndex(0); setScore(0); setFeedback(null); setDone(false);
  },[]);


  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🎵</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Name That Decade Music Quiz</h1>
          <p className="text-lg text-[#a8a8b3]">Which decade is this song from?</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[600px]">
          {!done ? (
            <div className="space-y-6">
              <div className="flex justify-between text-sm text-[#a8a8b3]">
                <span>Song {qIndex+1} of 10</span><span>Score: {score}/{qIndex}</span>
              </div>
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center">
                <div className="text-4xl mb-3">🎵</div>
                <p className="text-2xl font-black text-white">&ldquo;{q.song}&rdquo;</p>
                <p className="text-[#e94560] font-semibold mt-1">by {q.artist}</p>
                <p className="text-[#a8a8b3] text-sm mt-4">Which decade is this from?</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {DECADES.map(d => (
                  <button key={d} onClick={() => answer(d)} disabled={!!feedback}
                    className={`rounded-xl py-4 text-xl font-black transition-all ${
                      feedback ? (d===q.decade?"bg-green-700 text-white" : d!==q.decade?"bg-[#16213e] text-[#a8a8b3]":"") : "bg-[#e94560] text-white hover:opacity-90"
                    }`}>
                    {d}
                  </button>
                ))}
              </div>

              {feedback && (
                <div className={`rounded-xl border p-4 text-center ${feedback.correct?"border-green-500/30 bg-green-900/20":"border-red-500/30 bg-red-900/20"}`}>
                  <p className={`font-bold mb-1 ${feedback.correct?"text-green-400":"text-red-400"}`}>{feedback.correct?"✅ Correct!":"❌ Wrong!"} {q.decade} ({q.year})</p>
                  <p className="text-[#a8a8b3] text-sm">{q.fact}</p>
                  <button onClick={next} className="mt-3 rounded-lg bg-[#e94560] px-5 py-2 font-semibold text-white transition-opacity hover:opacity-90">
                    {qIndex+1>=10?"See Results":"Next →"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-8 text-center space-y-4">
              <h2 className="text-3xl font-black text-white">Quiz Complete!</h2>
              <p className="text-6xl font-black text-[#e94560]">{score}<span className="text-2xl text-[#a8a8b3]">/10</span></p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button onClick={restart} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Play Again</button>
              </div>
              <ShareButtons
                text={`I scored ${score}/10 on the Name That Decade music quiz! Can you beat me?`}
                url="https://dayblip.com/name-that-decade"
                title="Name That Decade Quiz"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
