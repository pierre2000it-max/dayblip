"use client";
import { useState, useCallback } from "react";

type Decade = "50s"|"60s"|"70s"|"80s"|"90s"|"00s";

const QUESTIONS: { q: string; opts: { text: string; decade: Decade }[] }[] = [
  { q:"What is your ideal Friday night?", opts:[{text:"Dancing at a sock hop",decade:"50s"},{text:"Attending a protest or concert",decade:"60s"},{text:"Disco dancing all night",decade:"70s"},{text:"Watching MTV with friends",decade:"80s"},{text:"Playing video games or AOL chat",decade:"90s"},{text:"Watching reality TV",decade:"00s"}] },
  { q:"Pick your dream car:", opts:[{text:"1957 Chevy Bel Air",decade:"50s"},{text:"VW Beetle (flower power)",decade:"60s"},{text:"Ford Mustang convertible",decade:"70s"},{text:"DeLorean DMC-12",decade:"80s"},{text:"Jeep Cherokee",decade:"90s"},{text:"Toyota Prius",decade:"00s"}] },
  { q:"What is your communication style?", opts:[{text:"Handwritten letters only",decade:"50s"},{text:"Passionate face-to-face debates",decade:"60s"},{text:"Laid-back phone calls",decade:"70s"},{text:"Answering machine messages",decade:"80s"},{text:"AIM instant messages",decade:"90s"},{text:"Texts and MySpace comments",decade:"00s"}] },
  { q:"Your fashion vibe is:", opts:[{text:"Poodle skirts and leather jackets",decade:"50s"},{text:"Tie-dye and peace signs",decade:"60s"},{text:"Bell bottoms and platform shoes",decade:"70s"},{text:"Neon colors and big hair",decade:"80s"},{text:"Flannel and Doc Martens",decade:"90s"},{text:"Low rise jeans and Von Dutch hats",decade:"00s"}] },
  { q:"Pick your ideal music:", opts:[{text:"Elvis and Buddy Holly",decade:"50s"},{text:"The Beatles and Jimi Hendrix",decade:"60s"},{text:"Fleetwood Mac and ABBA",decade:"70s"},{text:"Michael Jackson and Madonna",decade:"80s"},{text:"Nirvana and Spice Girls",decade:"90s"},{text:"Eminem and Beyonce",decade:"00s"}] },
  { q:"Your attitude toward technology:", opts:[{text:"TV is still a miracle",decade:"50s"},{text:"Tech should serve people",decade:"60s"},{text:"Keep it simple",decade:"70s"},{text:"Born for the computer age",decade:"80s"},{text:"The internet changed everything",decade:"90s"},{text:"Cannot live without my phone",decade:"00s"}] },
  { q:"Your life motto is:", opts:[{text:"Hard work and family first",decade:"50s"},{text:"Make love not war",decade:"60s"},{text:"Go with the flow",decade:"70s"},{text:"Greed is good",decade:"80s"},{text:"Whatever",decade:"90s"},{text:"YOLO",decade:"00s"}] },
  { q:"Pick your dream vacation:", opts:[{text:"Classic American road trip",decade:"50s"},{text:"Woodstock in a VW van",decade:"60s"},{text:"Backpacking through Europe",decade:"70s"},{text:"All-inclusive resort",decade:"80s"},{text:"Skiing in Aspen",decade:"90s"},{text:"Cancun spring break",decade:"00s"}] },
  { q:"Your favorite type of movie:", opts:[{text:"Classic Hollywood musicals",decade:"50s"},{text:"Counterculture films",decade:"60s"},{text:"Gritty crime dramas",decade:"70s"},{text:"Blockbuster action adventures",decade:"80s"},{text:"Indie films",decade:"90s"},{text:"Reality TV and rom-coms",decade:"00s"}] },
  { q:"At a party you are:", opts:[{text:"Doing the jive on the dance floor",decade:"50s"},{text:"Leading a philosophical discussion",decade:"60s"},{text:"The laid-back one by the drinks",decade:"70s"},{text:"The life of the party",decade:"80s"},{text:"Ironically too cool to dance",decade:"90s"},{text:"Taking photos for social media",decade:"00s"}] },
];

const DESCRIPTIONS: Record<Decade, string> = {
  "50s":"You value tradition, family and the simple things in life. Rock n roll!",
  "60s":"You are a free spirit and idealist who wants to change the world.",
  "70s":"You are laid-back, creative and love good music. Groovy baby.",
  "80s":"You love big personalities, bright colors and pop culture excess.",
  "90s":"You are nostalgic, ironic and deeply passionate about authenticity.",
  "00s":"You embrace technology, pop culture and living in the moment.",
};

export default function DecadeQuizTool() {
  const [answers, setAnswers]   = useState<Decade[]>([]);
  const [qIndex,  setQIndex]    = useState(0);
  const [done,    setDone]      = useState(false);

  const pick = useCallback((decade: Decade) => {
    const next = [...answers, decade];
    setAnswers(next);
    if (next.length >= QUESTIONS.length) setDone(true);
    else setQIndex(i => i + 1);
  }, [answers]);

  const restart = useCallback(() => { setAnswers([]); setQIndex(0); setDone(false); }, []);

  const result: Decade | null = done
    ? (Object.entries(
        answers.reduce((acc, d) => ({ ...acc, [d]: (acc[d as Decade] ?? 0) + 1 }), {} as Record<Decade, number>)
      ).sort((a, b) => b[1] - a[1])[0]?.[0] as Decade) ?? null
    : null;

  const shareText = result ? encodeURIComponent(`I was born for the ${result}! 🕺\nTake the quiz → dayblip.com/decade-quiz`) : "";
  const q = QUESTIONS[qIndex];

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🕺</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Which Decade Were You Born For?</h1>
          <p className="text-lg text-[#a8a8b3]">Answer 10 questions to discover which decade truly matches your soul</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[600px]">
          {!done ? (
            <div className="space-y-6">
              <div className="flex justify-between text-sm text-[#a8a8b3]">
                <span>Question {qIndex + 1} of {QUESTIONS.length}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#0f3460]">
                <div className="h-full rounded-full bg-[#e94560]" style={{ width:`${(qIndex/QUESTIONS.length)*100}%` }} />
              </div>
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <p className="text-xl font-bold text-white mb-5 text-center">{q.q}</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {q.opts.map(opt => (
                    <button key={opt.text} onClick={() => pick(opt.decade)}
                      className="rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-left text-white text-sm hover:border-[#e94560] hover:bg-[#1a1a2e] transition-all">
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : result && (
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-8 text-center space-y-4">
              <p className="text-[#a8a8b3]">You were born for the</p>
              <p className="text-6xl font-black text-[#e94560]">{result}</p>
              <p className="text-xl font-bold text-white">You Are a {result} Soul!</p>
              <p className="text-[#a8a8b3] leading-relaxed">{DESCRIPTIONS[result]}</p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button onClick={restart} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Take Again</button>
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
