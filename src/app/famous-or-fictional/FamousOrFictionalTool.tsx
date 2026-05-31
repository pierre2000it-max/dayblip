"use client";
import { useState, useCallback, useEffect } from "react";
import ShareButtons from "@/components/ShareButtons";

const ALL_PEOPLE = [
  { name:"Amelia Earhart", real:true, fact:"First woman to fly solo across the Atlantic Ocean" },
  { name:"Nikola Tesla", real:true, fact:"Invented alternating current electrical systems" },
  { name:"Marie Curie", real:true, fact:"First woman to win a Nobel Prize" },
  { name:"Ada Lovelace", real:true, fact:"Considered the first computer programmer" },
  { name:"Harriet Tubman", real:true, fact:"Led hundreds of slaves to freedom via Underground Railroad" },
  { name:"Alan Turing", real:true, fact:"Father of modern computer science" },
  { name:"Cleopatra", real:true, fact:"Last active ruler of the Ptolemaic Kingdom of Egypt" },
  { name:"Genghis Khan", real:true, fact:"Founded the largest contiguous land empire in history" },
  { name:"Frida Kahlo", real:true, fact:"Iconic Mexican painter known for self-portraits" },
  { name:"Rasputin", real:true, fact:"Mysterious mystic who influenced Russian royal family" },
  { name:"Vlad the Impaler", real:true, fact:"15th century ruler who inspired Dracula legend" },
  { name:"Blackbeard", real:true, fact:"Notorious English pirate who terrorized the Caribbean" },
  { name:"Billy the Kid", real:true, fact:"Legendary American outlaw of the Old West" },
  { name:"Calamity Jane", real:true, fact:"Famous frontierswoman and folk hero of the American West" },
  { name:"Sun Tzu", real:true, fact:"Ancient Chinese military strategist who wrote The Art of War" },
  { name:"Indiana Jones", real:false, fact:"Fictional archaeologist from the Steven Spielberg films" },
  { name:"Sherlock Holmes", real:false, fact:"Fictional detective created by Arthur Conan Doyle in 1887" },
  { name:"Atticus Finch", real:false, fact:"Fictional lawyer from To Kill a Mockingbird by Harper Lee" },
  { name:"Jay Gatsby", real:false, fact:"Fictional character from The Great Gatsby by F. Scott Fitzgerald" },
  { name:"Elizabeth Bennet", real:false, fact:"Fictional heroine of Pride and Prejudice by Jane Austen" },
  { name:"Huckleberry Finn", real:false, fact:"Fictional character created by Mark Twain in 1884" },
  { name:"Captain Ahab", real:false, fact:"Fictional whaling captain from Moby Dick by Herman Melville" },
  { name:"Ebenezer Scrooge", real:false, fact:"Fictional miser from A Christmas Carol by Charles Dickens" },
  { name:"Robinson Crusoe", real:false, fact:"Fictional castaway from the 1719 novel by Daniel Defoe" },
  { name:"Don Quixote", real:false, fact:"Fictional knight from the 1605 novel by Cervantes" },
  { name:"Dorian Gray", real:false, fact:"Fictional character from The Picture of Dorian Gray by Oscar Wilde" },
  { name:"Holden Caulfield", real:false, fact:"Fictional teenager from The Catcher in the Rye" },
  { name:"Emma Woodhouse", real:false, fact:"Fictional matchmaker from Emma by Jane Austen" },
];

function shuffle<T>(arr: T[]): T[] {
  const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a;
}

function getGrade(score: number, total: number): string {
  if (score===total) return "Perfect! Are you a history professor?";
  if (score>=total-3) return "Impressive knowledge!";
  if (score>=total-6) return "Pretty good!";
  if (score>=total-9) return "Room to improve!";
  return "Tricky ones got you!";
}

export default function FamousOrFictionalTool() {
  const [questions, setQuestions] = useState(() => shuffle(ALL_PEOPLE).slice(0,15));
  const [qIndex,   setQIndex]    = useState(0);
  const [score,    setScore]     = useState(0);
  const [feedback, setFeedback]  = useState<{correct:boolean}|null>(null);
  const [done,     setDone]      = useState(false);
  const [sharedResult, setSharedResult] = useState<{score:number;total:number}|null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const sc = p.get("score"), tot = p.get("total");
    if (sc && tot) { setSharedResult({ score: parseInt(sc || "0"), total: parseInt(tot || "0") }); }
  }, []);

  const q = questions[qIndex];

  const answer = (isReal: boolean) => {
    if (feedback) return;
    const correct = isReal === q.real;
    if (correct) setScore(s=>s+1);
    setFeedback({ correct });
  };

  const next = () => {
    if (qIndex+1>=15) {
      setDone(true);
      if (typeof window !== "undefined") {
        window.history.pushState({}, "", "/famous-or-fictional?score=" + score + "&total=15");
      }
    }
    else { setQIndex(i=>i+1); setFeedback(null); }
  };

  const restart = useCallback(() => {
    setQuestions(shuffle(ALL_PEOPLE).slice(0,15));
    setQIndex(0); setScore(0); setFeedback(null); setDone(false);
  },[]);


  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">✅</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Famous or Fictional?</h1>
          <p className="text-lg text-[#a8a8b3]">Was this person real or made up?</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[500px]">
          {sharedResult && !done && qIndex === 0 && !feedback ? (
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-8 text-center space-y-4">
              <p className="text-2xl font-bold text-white">Someone scored</p>
              <p className="text-6xl font-black text-[#e94560]">{sharedResult.score}<span className="text-2xl text-[#a8a8b3]">/{sharedResult.total}</span></p>
              <p className="text-xl text-white">Can you beat them?</p>
              <button onClick={() => setSharedResult(null)} className="rounded-lg bg-[#e94560] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90">Play Now →</button>
            </div>
          ) : !done ? (
            <div className="space-y-6">
              <div className="flex justify-between text-sm text-[#a8a8b3]">
                <span>Question {qIndex+1} of 15</span><span>Score: {score}/{qIndex}</span>
              </div>
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-8 text-center">
                <p className="text-[#a8a8b3] text-sm mb-3">Was this person real or fictional?</p>
                <p className="text-4xl font-black text-white mb-8">{q.name}</p>
                <div className="flex gap-4">
                  <button onClick={() => answer(true)} disabled={!!feedback}
                    className={`flex-1 rounded-xl py-4 text-lg font-bold transition-all ${feedback ? (q.real?"bg-green-700 text-white":"bg-[#16213e] text-[#a8a8b3]") : "bg-[#e94560] text-white hover:opacity-90"}`}>
                    REAL ✅
                  </button>
                  <button onClick={() => answer(false)} disabled={!!feedback}
                    className={`flex-1 rounded-xl py-4 text-lg font-bold transition-all ${feedback ? (!q.real?"bg-green-700 text-white":"bg-[#16213e] text-[#a8a8b3]") : "bg-[#0f3460] border border-[#e94560] text-white hover:opacity-90"}`}>
                    FICTIONAL 🎭
                  </button>
                </div>
              </div>

              {feedback && (
                <div className={`rounded-xl border p-5 text-center ${feedback.correct?"border-green-500/30 bg-green-900/20":"border-red-500/30 bg-red-900/20"}`}>
                  <p className={`font-bold mb-2 ${feedback.correct?"text-green-400":"text-red-400"}`}>{feedback.correct?"✅ Correct!":"❌ Wrong!"}</p>
                  <p className="text-[#a8a8b3] text-sm">{q.fact}</p>
                  <button onClick={next} className="mt-3 rounded-lg bg-[#e94560] px-5 py-2 font-semibold text-white transition-opacity hover:opacity-90">
                    {qIndex+1>=15?"See Results":"Next →"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-8 text-center space-y-4">
              <h2 className="text-3xl font-black text-white">Done!</h2>
              <p className="text-6xl font-black text-[#e94560]">{score}<span className="text-2xl text-[#a8a8b3]">/15</span></p>
              <p className="text-lg text-white">{getGrade(score,15)}</p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button onClick={restart} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Play Again</button>
              </div>
              <ShareButtons
                text={`I scored ${score}/15 on Famous or Fictional! Can you beat me?`}
                url={"https://www.dayblip.com/famous-or-fictional?score=" + score + "&total=15"}
                title="Famous or Fictional Quiz"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
