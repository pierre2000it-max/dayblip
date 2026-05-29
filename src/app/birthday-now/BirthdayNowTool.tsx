"use client";
import { useState, useEffect } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MAX_DAYS = [31,29,31,30,31,30,31,31,30,31,30,31];

const CITIES = [
  {name:"New York",tz:"America/New_York"},{name:"Los Angeles",tz:"America/Los_Angeles"},
  {name:"London",tz:"Europe/London"},{name:"Paris",tz:"Europe/Paris"},
  {name:"Berlin",tz:"Europe/Berlin"},{name:"Moscow",tz:"Europe/Moscow"},
  {name:"Dubai",tz:"Asia/Dubai"},{name:"Mumbai",tz:"Asia/Kolkata"},
  {name:"Bangkok",tz:"Asia/Bangkok"},{name:"Singapore",tz:"Asia/Singapore"},
  {name:"Tokyo",tz:"Asia/Tokyo"},{name:"Sydney",tz:"Australia/Sydney"},
  {name:"Auckland",tz:"Pacific/Auckland"},{name:"São Paulo",tz:"America/Sao_Paulo"},
  {name:"Toronto",tz:"America/Toronto"},{name:"Chicago",tz:"America/Chicago"},
  {name:"Denver",tz:"America/Denver"},{name:"Honolulu",tz:"Pacific/Honolulu"},
];

function getCityDate(tz: string): {month:number;day:number} {
  const s = new Date().toLocaleDateString("en-US",{timeZone:tz,month:"numeric",day:"numeric"});
  const [m,d] = s.split("/").map(Number);
  return {month:m,day:d};
}

function getNextBirthday(month: number, day: number): Date {
  const today = new Date(); today.setHours(0,0,0,0);
  let next = new Date(today.getFullYear(),month-1,day);
  if (next<=today) next = new Date(today.getFullYear()+1,month-1,day);
  return next;
}

export default function BirthdayNowTool() {
  const [month,  setMonth]  = useState(1);
  const [day,    setDay]    = useState(1);
  const [checked,setChecked]= useState(false);
  const [cities, setCities] = useState<{name:string;isBirthday:boolean;time:string}[]>([]);
  const [timeLeft,setTimeLeft]= useState({d:0,h:0,m:0,s:0});

  const check = () => {
    setChecked(true);
    const c = CITIES.map(city => {
      const {month:m,day:d} = getCityDate(city.tz);
      const time = new Intl.DateTimeFormat("en-US",{timeZone:city.tz,hour:"2-digit",minute:"2-digit",hour12:true}).format(new Date());
      return {name:city.name, isBirthday:m===month&&d===day, time};
    });
    setCities(c);
  };

  useEffect(() => {
    if (!checked) return;
    const next = getNextBirthday(month,day);
    const tick = () => {
      const diff=Math.max(0,next.getTime()-Date.now());
      const tot=Math.floor(diff/1000);
      setTimeLeft({d:Math.floor(tot/86400),h:Math.floor((tot%86400)/3600),m:Math.floor((tot%3600)/60),s:tot%60});
    };
    tick(); const id=setInterval(tick,1000); return ()=>clearInterval(id);
  },[checked,month,day]);

  const birthdayCities = cities.filter(c=>c.isBirthday);
  const isBirthdaySomewhere = birthdayCities.length>0;
  const safeDay = Math.min(day,MAX_DAYS[month-1]);
  const shareText = isBirthdaySomewhere ? encodeURIComponent(`It is still my birthday in ${birthdayCities.length} cities! 🎂\ndayblip.com/birthday-now`) : "";

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🌍</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Is It Still Your Birthday?</h1>
          <p className="text-lg text-[#a8a8b3]">See if it is still your birthday anywhere in the world right now</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-5">
          <div className="flex gap-3">
            <select value={month} onChange={e=>setMonth(Number(e.target.value))}
              className="flex-1 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
              {MONTHS.map((m,i)=><option key={m} value={i+1}>{m}</option>)}
            </select>
            <select value={safeDay} onChange={e=>setDay(Number(e.target.value))}
              className="w-20 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-3 text-white focus:border-[#e94560] focus:outline-none">
              {Array.from({length:MAX_DAYS[month-1]},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}
            </select>
            <button onClick={check} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Check →</button>
          </div>

          {checked && (
            <>
              {isBirthdaySomewhere ? (
                <div className="rounded-xl border border-green-500/30 bg-green-900/20 p-6 text-center">
                  <p className="text-3xl mb-2">🎉</p>
                  <p className="text-2xl font-black text-white">Happy Birthday!</p>
                  <p className="text-green-400 mt-1">Still your birthday in {birthdayCities.length} city/cities!</p>
                  <a href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-block rounded-lg border border-[#333] bg-black px-5 py-2 font-semibold text-white text-sm transition-opacity hover:opacity-90">Share on X →</a>
                </div>
              ) : (
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
                  <p className="text-white font-semibold">Your birthday is in {timeLeft.d} days, {String(timeLeft.h).padStart(2,"0")}:{String(timeLeft.m).padStart(2,"0")}:{String(timeLeft.s).padStart(2,"0")}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {cities.map(c=>(
                  <div key={c.name} className={`rounded-lg border px-3 py-2 ${c.isBirthday?"border-green-500/50 bg-green-900/10":"border-[#0f3460] bg-[#1a1a2e]"}`}>
                    <p className={`font-semibold text-sm ${c.isBirthday?"text-green-400":"text-white"}`}>{c.name}</p>
                    <p className="text-[#a8a8b3] text-xs">{c.time}</p>
                    <p className={`text-xs ${c.isBirthday?"text-green-400":"text-[#a8a8b3]"}`}>{c.isBirthday?"🎂 Birthday!":"Not birthday"}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
