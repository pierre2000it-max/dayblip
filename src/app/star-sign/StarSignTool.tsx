"use client";
import { useState, useEffect } from "react";
import ShareButtons from "@/components/ShareButtons";

const SIGNS = [
  { name:"Aries",       sym:"♈", start:[3,21], end:[4,19], el:"Fire",  icon:"🐏", traits:["Bold","Ambitious","Confident","Passionate"],       compat:["Leo","Sagittarius"], famous:["Lady Gaga","Mariah Carey","Emma Watson","Elton John"] },
  { name:"Taurus",      sym:"♉", start:[4,20], end:[5,20], el:"Earth", icon:"🐂", traits:["Reliable","Patient","Practical","Devoted"],          compat:["Virgo","Capricorn"], famous:["Adele","George Clooney","Dwayne Johnson","Megan Fox"] },
  { name:"Gemini",      sym:"♊", start:[5,21], end:[6,20], el:"Air",   icon:"👯", traits:["Adaptable","Curious","Witty","Expressive"],          compat:["Libra","Aquarius"], famous:["Angelina Jolie","Kanye West","Johnny Depp","Marilyn Monroe"] },
  { name:"Cancer",      sym:"♋", start:[6,21], end:[7,22], el:"Water", icon:"🦀", traits:["Intuitive","Caring","Protective","Creative"],        compat:["Scorpio","Pisces"], famous:["Tom Hanks","Selena Gomez","Ariana Grande","Chris Pratt"] },
  { name:"Leo",         sym:"♌", start:[7,23], end:[8,22], el:"Fire",  icon:"🦁", traits:["Charismatic","Generous","Confident","Warm"],          compat:["Aries","Sagittarius"], famous:["Barack Obama","Jennifer Lopez","Madonna","Kylie Jenner"] },
  { name:"Virgo",       sym:"♍", start:[8,23], end:[9,22], el:"Earth", icon:"👧", traits:["Analytical","Practical","Kind","Hardworking"],       compat:["Taurus","Capricorn"], famous:["Beyoncé","Keanu Reeves","Michael Jackson","Blake Lively"] },
  { name:"Libra",       sym:"♎", start:[9,23], end:[10,22],el:"Air",   icon:"⚖️", traits:["Diplomatic","Gracious","Fair-minded","Social"],      compat:["Gemini","Aquarius"], famous:["Kim Kardashian","Bruno Mars","Cardi B","Will Smith"] },
  { name:"Scorpio",     sym:"♏", start:[10,23],end:[11,21],el:"Water", icon:"🦂", traits:["Resourceful","Brave","Passionate","Stubborn"],       compat:["Cancer","Pisces"], famous:["Leonardo DiCaprio","Katy Perry","Ryan Gosling","Drake"] },
  { name:"Sagittarius", sym:"♐", start:[11,22],end:[12,21],el:"Fire",  icon:"🏹", traits:["Generous","Idealistic","Adventurous","Funny"],       compat:["Aries","Leo"], famous:["Taylor Swift","Brad Pitt","Miley Cyrus","Jay-Z"] },
  { name:"Capricorn",   sym:"♑", start:[12,22],end:[1,19], el:"Earth", icon:"🐐", traits:["Responsible","Disciplined","Self-control","Ambitious"],compat:["Taurus","Virgo"], famous:["LeBron James","Michelle Obama","Dolly Parton","Denzel Washington"] },
  { name:"Aquarius",    sym:"♒", start:[1,20], end:[2,18], el:"Air",   icon:"🏺", traits:["Progressive","Original","Independent","Humanitarian"],compat:["Gemini","Libra"], famous:["Oprah Winfrey","Harry Styles","Ed Sheeran","Jennifer Aniston"] },
  { name:"Pisces",      sym:"♓", start:[2,19], end:[3,20], el:"Water", icon:"🐟", traits:["Compassionate","Artistic","Intuitive","Gentle"],     compat:["Cancer","Scorpio"], famous:["Rihanna","Justin Bieber","Steve Jobs","Albert Einstein"] },
];

function getSign(month: number, day: number) {
  for (const s of SIGNS) {
    const [sm, sd] = s.start, [em, ed] = s.end;
    if ((month === sm && day >= sd) || (month === em && day <= ed)) return s;
    if (sm > em) { // crosses year boundary (Capricorn)
      if (month === sm && day >= sd) return s;
      if (month === em && day <= ed) return s;
      if (month === 1 && day <= ed) return s;
    }
  }
  return SIGNS[0];
}

export default function StarSignTool() {
  const [month,  setMonth]  = useState(1);
  const [day,    setDay]    = useState(1);
  const [sign,   setSign]   = useState<typeof SIGNS[0] | null>(null);
  const [time,   setTime]   = useState<{d:number;h:number;m:number;s:number}|null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const m = p.get("month"), d = p.get("day");
    if (m && d) {
      const mo = parseInt(m, 10), da = parseInt(d, 10);
      setMonth(mo); setDay(da);
      setSign(getSign(mo, da));
    }
  }, []);

  const find = () => {
    const s = getSign(month, day);
    setSign(s);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/star-sign?month=" + month + "&day=" + day);
    }
  };

  useEffect(() => {
    if (!sign) return;
    const tick = () => {
      const now = new Date(); now.setHours(0,0,0,0);
      let next = new Date(now.getFullYear(), month - 1, day);
      if (next <= new Date()) next = new Date(now.getFullYear() + 1, month - 1, day);
      const diff = Math.max(0, next.getTime() - Date.now());
      const tot = Math.floor(diff / 1000);
      setTime({ d: Math.floor(tot/86400), h: Math.floor((tot%86400)/3600), m: Math.floor((tot%3600)/60), s: tot%60 });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [sign, month, day]);

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const maxDay = [31,29,31,30,31,30,31,31,30,31,30,31][month - 1];

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">♈</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Your Star Sign & Birthday Countdown</h1>
          <p className="text-lg text-[#a8a8b3]">Discover your zodiac sign and count down to your next birthday</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 mb-8">
            <label className="mb-3 block text-sm font-semibold text-white">Select your birth month and day</label>
            <div className="flex gap-3 mb-4">
              <select value={month} onChange={e => setMonth(Number(e.target.value))}
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {MONTHS.map((m,i) => <option key={m} value={i+1}>{m}</option>)}
              </select>
              <select value={day} onChange={e => setDay(Number(e.target.value))}
                className="w-20 rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {Array.from({length:maxDay},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <button onClick={find} className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">Find My Sign →</button>
          </div>

          {sign && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
                <div className="text-6xl mb-3">{sign.icon}</div>
                <h2 className="text-4xl font-black text-[#e94560]">{sign.sym} {sign.name}</h2>
                <p className="text-[#a8a8b3] mt-1">{sign.el} sign</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {sign.traits.map(t => <span key={t} className="rounded-full bg-[#16213e] px-3 py-1 text-sm text-white">{t}</span>)}
                </div>
              </div>

              {time && (
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                  <p className="text-center text-[#a8a8b3] mb-3 text-sm">Your next birthday is in</p>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {[{l:"Days",v:time.d},{l:"Hours",v:time.h},{l:"Min",v:time.m},{l:"Sec",v:time.s}].map(u=>(
                      <div key={u.l} className="text-center rounded-xl bg-[#16213e] px-4 py-3 min-w-[70px]">
                        <div className="text-3xl font-black text-[#e94560] tabular-nums">{String(u.v).padStart(2,"0")}</div>
                        <div className="text-xs text-[#a8a8b3]">{u.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                  <h3 className="font-bold text-white mb-3 text-sm">✨ Compatible Signs</h3>
                  <div className="flex gap-2">
                    {sign.compat.map(c => <span key={c} className="rounded-full bg-[#e94560]/20 border border-[#e94560]/40 px-3 py-1 text-sm text-[#e94560]">{c}</span>)}
                  </div>
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                  <h3 className="font-bold text-white mb-3 text-sm">🌟 Famous {sign.name}s</h3>
                  <ul className="space-y-1">
                    {sign.famous.map(f => <li key={f} className="text-[#a8a8b3] text-sm">{f}</li>)}
                  </ul>
                </div>
              </div>

              {sign && time && (
                <ShareButtons
                  text={`I am a ${sign.name}! ${sign.sym} My birthday is in ${time.d} days 🎂 Find yours!`}
                  url={"https://www.dayblip.com/star-sign?month=" + month + "&day=" + day}
                  title="Star Sign Calculator"
                />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
