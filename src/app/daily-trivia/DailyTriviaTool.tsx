"use client";
import { useState, useEffect } from "react";
import ShareButtons from "@/components/ShareButtons";
import { getStreak, updateStreak, type StreakData } from "@/utils/streakManager";
import { generateShareImage } from "@/utils/generateShareImage";

const QUESTIONS = [
  { q:"In what year did the Berlin Wall fall?", opts:["1987","1989","1991","1993"], ans:"1989", exp:"The Berlin Wall fell on November 9, 1989, marking the end of the Cold War division of Germany." },
  { q:"Which year was Google founded?", opts:["1996","1998","2000","2002"], ans:"1998", exp:"Google was founded on September 4, 1998 by Larry Page and Sergey Brin." },
  { q:"In what year did humans first land on the moon?", opts:["1965","1967","1969","1971"], ans:"1969", exp:"Apollo 11 landed on the moon on July 20, 1969. Neil Armstrong was the first human to walk on the moon." },
  { q:"Which year was the first iPhone released?", opts:["2005","2006","2007","2008"], ans:"2007", exp:"Steve Jobs unveiled the original iPhone on January 9, 2007." },
  { q:"In what year did Facebook launch to the public?", opts:["2004","2005","2006","2007"], ans:"2006", exp:"Facebook launched to the general public on September 26, 2006." },
  { q:"Which year was YouTube founded?", opts:["2003","2004","2005","2006"], ans:"2005", exp:"YouTube was founded on February 14, 2005." },
  { q:"In what year did World War 2 end?", opts:["1943","1944","1945","1946"], ans:"1945", exp:"World War 2 ended in 1945. Germany surrendered May 8 and Japan September 2." },
  { q:"Which year was Twitter founded?", opts:["2004","2005","2006","2007"], ans:"2006", exp:"Twitter was created in March 2006 by Jack Dorsey, Noah Glass, Biz Stone and Evan Williams." },
  { q:"In what year was Wikipedia launched?", opts:["1999","2000","2001","2002"], ans:"2001", exp:"Wikipedia was launched on January 15, 2001 by Jimmy Wales and Larry Sanger." },
  { q:"Which year did Netflix start streaming online?", opts:["2005","2006","2007","2008"], ans:"2007", exp:"Netflix launched its streaming service in January 2007." },
  { q:"In what year was Amazon founded?", opts:["1992","1993","1994","1995"], ans:"1994", exp:"Amazon was founded by Jeff Bezos on July 5, 1994." },
  { q:"Which year did Instagram launch?", opts:["2009","2010","2011","2012"], ans:"2010", exp:"Instagram was launched on October 6, 2010 by Kevin Systrom and Mike Krieger." },
  { q:"In what year was the Titanic movie released?", opts:["1995","1996","1997","1998"], ans:"1997", exp:"Titanic directed by James Cameron was released on December 19, 1997." },
  { q:"Which year did Barack Obama first become President?", opts:["2006","2007","2008","2009"], ans:"2009", exp:"Barack Obama was inaugurated as the 44th President on January 20, 2009." },
  { q:"In what year was Snapchat founded?", opts:["2009","2010","2011","2012"], ans:"2011", exp:"Snapchat was founded in 2011 by Evan Spiegel, Bobby Murphy and Reggie Brown." },
  { q:"Which year did TikTok launch globally?", opts:["2015","2016","2017","2018"], ans:"2016", exp:"TikTok launched globally in 2016." },
  { q:"In what year was Spotify launched?", opts:["2006","2007","2008","2009"], ans:"2008", exp:"Spotify launched on October 7, 2008." },
  { q:"Which year did COVID-19 become a global pandemic?", opts:["2019","2020","2021","2022"], ans:"2020", exp:"The WHO declared COVID-19 a global pandemic on March 11, 2020." },
  { q:"In what year was the first Star Wars movie released?", opts:["1975","1976","1977","1978"], ans:"1977", exp:"Star Wars Episode IV was released on May 25, 1977." },
  { q:"Which year did Disneyland open?", opts:["1953","1954","1955","1956"], ans:"1955", exp:"Disneyland opened on July 17, 1955 in Anaheim, California." },
  { q:"In what year was McDonald's founded?", opts:["1938","1939","1940","1941"], ans:"1940", exp:"McDonald's was founded on May 15, 1940." },
  { q:"Which year did the Soviet Union dissolve?", opts:["1989","1990","1991","1992"], ans:"1991", exp:"The Soviet Union officially dissolved on December 25, 1991." },
  { q:"In what year was the first email sent?", opts:["1969","1971","1973","1975"], ans:"1971", exp:"The first email was sent in 1971 by Ray Tomlinson." },
  { q:"Which year did Nelson Mandela become President?", opts:["1992","1993","1994","1995"], ans:"1994", exp:"Nelson Mandela became President of South Africa on May 10, 1994." },
  { q:"In what year was the World Wide Web invented?", opts:["1987","1989","1991","1993"], ans:"1989", exp:"Tim Berners-Lee invented the World Wide Web in 1989." },
  { q:"Which year did Harry Potter first publish?", opts:["1995","1996","1997","1998"], ans:"1997", exp:"Harry Potter and the Philosopher Stone was published on June 26, 1997." },
  { q:"In what year was Uber founded?", opts:["2007","2008","2009","2010"], ans:"2009", exp:"Uber was founded in 2009 by Travis Kalanick and Garrett Camp." },
  { q:"Which year did the first iPhone App Store open?", opts:["2007","2008","2009","2010"], ans:"2008", exp:"The Apple App Store launched on July 10, 2008 with 500 apps." },
  { q:"In what year was Bitcoin created?", opts:["2007","2008","2009","2010"], ans:"2009", exp:"Bitcoin was created in 2009 by Satoshi Nakamoto." },
  { q:"Which year did Princess Diana pass away?", opts:["1995","1996","1997","1998"], ans:"1997", exp:"Princess Diana died on August 31, 1997 in Paris." },
];

function pad(n: number) { return String(n).padStart(2,"0"); }

const STREAK_KEY = "dayblip_trivia_streak";

const MILESTONES: Record<number, string> = {
  3:   "You're on a roll! 🎯",
  7:   "One week strong! 🔥",
  14:  "Two weeks — history buff! 📚",
  30:  "30 days — legendary! 🏆",
  100: "100 days — unstoppable! 👑",
};

export default function DailyTriviaTool() {
  const [answered,        setAnswered]        = useState<string | null>(null);
  const [streak,          setStreak]          = useState(0);
  const [best,            setBest]            = useState(0);
  const [timeLeft,        setTimeLeft]        = useState({ h:0, m:0, s:0 });
  const [streakData,      setStreakData]      = useState<StreakData | null>(null);
  const [prevStreakCount, setPrevStreakCount] = useState(0);

  // Pick question based on day of year
  const today    = new Date();
  const start    = new Date(today.getFullYear(), 0, 0);
  const doy      = Math.floor((today.getTime() - start.getTime()) / 86400000);
  const q        = QUESTIONS[doy % QUESTIONS.length];
  const dateLabel = today.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });

  useEffect(() => {
    let answeredToday = false;
    try {
      const saved = localStorage.getItem("dt_data");
      if (saved) {
        const d = JSON.parse(saved);
        if (d.date === new Date().toDateString()) {
          setAnswered(d.answered);
          answeredToday = true;
        }
        setStreak(d.streak ?? 0);
        setBest(d.best ?? 0);
      }
    } catch { /* ignore */ }
    // Seed streak day 1 for users who answered today before the streak feature existed
    if (answeredToday && getStreak(STREAK_KEY) === null) {
      updateStreak(STREAK_KEY);
    }
    setStreakData(getStreak(STREAK_KEY));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tick = () => {
      const now  = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = Math.floor((midnight.getTime() - now.getTime()) / 1000);
      setTimeLeft({ h: Math.floor(diff/3600), m: Math.floor((diff%3600)/60), s: diff%60 });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const answer = (opt: string) => {
    if (answered) return;
    setAnswered(opt);
    const correct = opt === q.ans;
    const newStreak = correct ? streak + 1 : 0;
    const newBest   = Math.max(best, newStreak);
    setStreak(newStreak);
    setBest(newBest);
    try {
      localStorage.setItem("dt_data", JSON.stringify({
        date: today.toDateString(), answered: opt, streak: newStreak, best: newBest,
      }));
    } catch { /* ignore */ }
    const prev    = getStreak(STREAK_KEY);
    const updated = updateStreak(STREAK_KEY);
    if (prev && prev.count > 1 && updated.count === 1) setPrevStreakCount(prev.count);
    setStreakData(updated);
  };


  const streakBroke = prevStreakCount > 0 && streakData?.count === 1;

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🧠</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Daily History Trivia</h1>
          <p className="text-lg text-[#a8a8b3]">A new question every day. Come back tomorrow for more!</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[600px] space-y-6">
          <p className="text-center text-[#a8a8b3] text-sm">Today&apos;s Question — {dateLabel}</p>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <p className="text-xl font-bold text-white mb-6 text-center">{q.q}</p>
            <div className="grid grid-cols-2 gap-3">
              {q.opts.map(opt => {
                const isChosen  = answered === opt;
                const isCorrect = opt === q.ans;
                const bg = answered
                  ? isCorrect ? "bg-green-700 border-green-500 text-white"
                  : isChosen  ? "bg-red-800 border-red-500 text-white"
                  : "bg-[#16213e] border-[#0f3460] text-[#a8a8b3]"
                  : "bg-[#16213e] border-[#0f3460] text-white hover:border-[#e94560]";
                return (
                  <button key={opt} onClick={() => answer(opt)} disabled={!!answered}
                    className={`rounded-lg border px-4 py-3 font-semibold transition-all ${bg}`}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {answered && (
            <div className={`rounded-xl border p-5 ${answered === q.ans ? "border-green-500/30 bg-green-900/20" : "border-red-500/30 bg-red-900/20"}`}>
              <p className={`font-bold mb-2 ${answered === q.ans ? "text-green-400" : "text-red-400"}`}>
                {answered === q.ans ? "✅ Correct!" : "❌ Incorrect!"}
              </p>
              <p className="text-[#a8a8b3] text-sm">{q.exp}</p>
              <p className="mt-3 text-xs text-[#a8a8b3]">Come back tomorrow for a new question!</p>
            </div>
          )}

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center">
            <p className="text-[#a8a8b3] text-sm mb-1">New question in</p>
            <p className="text-2xl font-bold text-white tabular-nums">{pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}</p>
          </div>

          {/* ── STREAK CARD ─────────────────────────────────────────── */}
          {streakData && answered !== null && (
            streakBroke ? (
              <div style={{ background: "#1e2435", border: "1px solid #0f3460", borderRadius: 12, padding: 20 }}>
                <p className="text-2xl mb-1">😔</p>
                <p className="font-bold text-white">Streak reset</p>
                <p className="text-[#a8a8b3] text-sm mt-2">
                  Your {prevStreakCount}-day streak ended. Start a new one today!
                </p>
                <p className="text-[#a8a8b3] text-xs mt-3">
                  Best streak: {streakData.longestStreak} days
                </p>
              </div>
            ) : (
              <div style={{ background: "#1e2435", border: "1px solid #0f3460", borderRadius: 12, padding: 20 }}>
                <div className="flex items-center gap-3 mb-3">
                  <span style={{ fontSize: 32 }}>🔥</span>
                  <span className="text-2xl font-bold" style={{ color: "#e8445a" }}>
                    {streakData.count}-Day Streak!
                  </span>
                </div>
                <p className="text-[#a8a8b3] text-sm">Longest streak: {streakData.longestStreak} days</p>
                <p className="text-[#a8a8b3] text-sm">Total days played: {streakData.totalPlayed}</p>
                <p className="text-[#a8a8b3] text-sm mt-3">
                  {MILESTONES[streakData.count] ?? "Come back tomorrow to keep it going!"}
                </p>
                <button
                  onClick={() => void generateShareImage({
                    title: "Daily Trivia Streak",
                    primaryStat: String(streakData.count),
                    primaryLabel: "day streak 🔥",
                    stats: [
                      { label: "Longest streak",    value: `${streakData.longestStreak} days` },
                      { label: "Total days played", value: `${streakData.totalPlayed} days` },
                    ],
                    tagline: "Can you beat my streak?",
                    toolUrl: "dayblip.com/daily-trivia",
                    filename: "dayblip-trivia-streak.png",
                  })}
                  style={{
                    background: "#e8445a", color: "white", borderRadius: 8,
                    padding: "12px 24px", width: "100%", marginTop: 12,
                    fontWeight: 600, border: "none", cursor: "pointer",
                  }}
                >
                  📸 Share Your Streak
                </button>
              </div>
            )
          )}

          {answered && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-white">Share Today&apos;s Trivia</p>
              <ShareButtons
                text={`I just answered today's daily trivia on Dayblip! Test your knowledge 👇`}
                url="https://dayblip.com/daily-trivia"
                title="Daily Trivia — Dayblip"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
