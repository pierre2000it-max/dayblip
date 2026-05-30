"use client";
import { useState, useCallback } from "react";
import ShareButtons from "@/components/ShareButtons";

const ALL_QUESTIONS = [
  { a: "The Berlin Wall fell", ya: 1989, b: "The first iPhone was released", yb: 2007, ans: "before" },
  { a: "Facebook was founded", ya: 2004, b: "Google was founded", yb: 1998, ans: "after" },
  { a: "The first Moon landing", ya: 1969, b: "Martin Luther King Jr speech", yb: 1963, ans: "after" },
  { a: "YouTube launched", ya: 2005, b: "Wikipedia launched", yb: 2001, ans: "after" },
  { a: "World War 2 ended", ya: 1945, b: "The Korean War started", yb: 1950, ans: "before" },
  { a: "Nelson Mandela freed", ya: 1990, b: "Fall of Soviet Union", yb: 1991, ans: "before" },
  { a: "Amazon was founded", ya: 1994, b: "eBay was founded", yb: 1995, ans: "before" },
  { a: "The Titanic sank", ya: 1912, b: "World War 1 started", yb: 1914, ans: "before" },
  { a: "Harry Potter published", ya: 1997, b: "Toy Story released", yb: 1995, ans: "after" },
  { a: "Instagram launched", ya: 2010, b: "Twitter launched", yb: 2006, ans: "after" },
  { a: "First email sent", ya: 1971, b: "First text message sent", yb: 1992, ans: "before" },
  { a: "Netflix founded", ya: 1997, b: "Google founded", yb: 1998, ans: "before" },
  { a: "TikTok launched globally", ya: 2016, b: "Snapchat launched", yb: 2011, ans: "after" },
  { a: "First Star Wars released", ya: 1977, b: "Jaws released", yb: 1975, ans: "after" },
  { a: "Disneyland opened", ya: 1955, b: "McDonald's founded", yb: 1940, ans: "after" },
  { a: "iPhone released", ya: 2007, b: "YouTube founded", yb: 2005, ans: "after" },
  { a: "September 11 attacks", ya: 2001, b: "Oklahoma City bombing", yb: 1995, ans: "after" },
  { a: "Spotify launched", ya: 2008, b: "iTunes launched", yb: 2001, ans: "after" },
  { a: "Barack Obama elected", ya: 2008, b: "9/11 attacks", yb: 2001, ans: "after" },
  { a: "COVID-19 pandemic began", ya: 2020, b: "Donald Trump elected", yb: 2016, ans: "after" },
];

const RATINGS: [number, number, string][] = [
  [10,10,"History genius! 🏆"],
  [8,9,"Impressive! 🌟"],
  [6,7,"Not bad! 📚"],
  [4,5,"Keep learning! 🤓"],
  [0,3,"History needs work! 😅"],
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getQuestions() { return shuffle(ALL_QUESTIONS).slice(0, 10); }

export default function HistoryQuizTool() {
  const [questions, setQuestions] = useState(() => getQuestions());
  const [qIndex,   setQIndex]   = useState(0);
  const [score,    setScore]    = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);
  const [done,     setDone]     = useState(false);

  const q = questions[qIndex];

  const answer = (choice: "before" | "after") => {
    if (feedback) return;
    const correct = choice === q.ans;
    if (correct) setScore(s => s + 1);
    setFeedback({
      correct,
      msg: correct
        ? `✅ Correct! ${q.a} (${q.ya}) was ${q.ans} ${q.b} (${q.yb})`
        : `❌ Wrong! ${q.a} (${q.ya}) was actually ${q.ans} ${q.b} (${q.yb})`,
    });
  };

  const next = () => {
    if (qIndex + 1 >= questions.length) { setDone(true); }
    else { setQIndex(i => i + 1); setFeedback(null); }
  };

  const restart = useCallback(() => {
    setQuestions(getQuestions());
    setQIndex(0); setScore(0); setFeedback(null); setDone(false);
  }, []);

  const rating = done ? RATINGS.find(([min, max]) => score >= min && score <= max)?.[2] ?? "" : "";

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">⚡</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Before or After? History Quiz</h1>
          <p className="text-lg text-[#a8a8b3]">Test your knowledge of when things happened in history</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[600px]">
          {!done ? (
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex justify-between text-sm text-[#a8a8b3]">
                <span>Question {qIndex + 1} of 10</span>
                <span>Score: {score}/{qIndex}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#0f3460]">
                <div className="h-full rounded-full bg-[#e94560]" style={{ width: `${(qIndex / 10) * 100}%` }} />
              </div>

              {/* Question card */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <p className="text-center text-[#a8a8b3] mb-2 text-sm">Did this happen BEFORE or AFTER?</p>
                <div className="text-center mb-6">
                  <p className="text-xl font-bold text-white">{q.a}</p>
                  <p className="text-[#e94560] text-sm mt-1">before or after...</p>
                  <p className="text-xl font-bold text-white mt-1">{q.b}?</p>
                </div>
                <div className="flex gap-3">
                  {(["before", "after"] as const).map(choice => (
                    <button key={choice} onClick={() => answer(choice)} disabled={!!feedback}
                      className={`flex-1 rounded-lg py-4 text-lg font-bold transition-all ${
                        feedback
                          ? feedback.correct && q.ans === choice ? "bg-green-600 text-white" : !feedback.correct && q.ans === choice ? "bg-green-600 text-white" : "bg-[#16213e] text-[#a8a8b3]"
                          : "bg-[#e94560] text-white hover:opacity-90"
                      }`}>
                      {choice.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {feedback && (
                <div className={`rounded-lg p-4 text-center ${feedback.correct ? "bg-green-900/30 border border-green-500/30" : "bg-red-900/30 border border-red-500/30"}`}>
                  <p className={`font-semibold ${feedback.correct ? "text-green-400" : "text-red-400"}`}>{feedback.msg}</p>
                  <button onClick={next} className="mt-3 rounded-lg bg-[#e94560] px-5 py-2 font-semibold text-white transition-opacity hover:opacity-90">
                    {qIndex + 1 >= 10 ? "See Results" : "Next Question →"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-8 text-center space-y-4">
              <h2 className="text-3xl font-black text-white">Quiz Complete!</h2>
              <p className="text-6xl font-black text-[#e94560]">{score}/10</p>
              <p className="text-xl text-white">{rating}</p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button onClick={restart} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Play Again</button>
              </div>
              {done && (
                <ShareButtons
                  text={`I scored ${score}/10 on the history quiz! Can you beat me?`}
                  url="https://dayblip.com/history-quiz"
                  title="History Quiz"
                />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
