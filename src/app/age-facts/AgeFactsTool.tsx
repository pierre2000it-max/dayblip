"use client";
import { useState, useEffect } from "react";
import ShareButtons from "@/components/ShareButtons";

function commas(n: number) { return Math.round(n).toLocaleString(); }

export default function AgeFactsTool() {
  const [dob,     setDob]     = useState("");
  const [sleep,   setSleep]   = useState(8);
  const [tv,      setTv]      = useState(3);
  const [meals,   setMeals]   = useState(3);
  const [result,  setResult]  = useState<Record<string, number> | null>(null);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const d = p.get("dob");
    if (d) { setDob(d); }
  }, []);

  const calculate = () => {
    if (!dob) { setError("Please enter your date of birth."); return; }
    const birth = new Date(dob + "T00:00:00");
    const today = new Date(); today.setHours(0,0,0,0);
    if (birth >= today) { setError("Birth date must be in the past."); return; }
    setError("");

    const days    = Math.floor((today.getTime() - birth.getTime()) / 86400000);
    const months  = days / 30.44;
    const years   = days / 365.25;
    const minutes = days * 24 * 60;

    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/age-facts?dob=" + dob);
    }
    setResult({
      heartbeats:    minutes * 72,
      breaths:       minutes * 16,
      nailGrowth:    months * 3.5 / 1000, // meters
      hairGrowth:    years * 15 / 100,    // meters (all hair combined rough)
      saliva:        days * 1.5,          // liters
      skinReplace:   Math.floor(days / 27),
      sleepYears:    (days * sleep / 24) / 365.25,
      eatMonths:     (days * meals * 0.5 / 24) / 30.44, // 30 min per meal
      tvYears:       (days * tv / 24) / 365.25,
      bathroomWeeks: (days * 1.5 / 24) / 7,
      laughs:        days * 17,
      totalMeals:    days * meals,
      waterCups:     days * 8,
      foodPounds:    days * 4.4,
    });
  };


  const BODY = result ? [
    { icon: "❤️", label: "Heartbeats",             val: `${commas(result.heartbeats)} times` },
    { icon: "💨", label: "Breaths taken",           val: `${commas(result.breaths)} times` },
    { icon: "💅", label: "Fingernail growth",       val: `${result.nailGrowth.toFixed(2)} meters` },
    { icon: "💇", label: "Hair grown (all hair)",   val: `${result.hairGrowth.toFixed(1)} meters` },
    { icon: "💧", label: "Saliva produced",         val: `${commas(result.saliva)} liters` },
    { icon: "🔄", label: "Times skin replaced",    val: `~${commas(result.skinReplace)} times` },
  ] : [];

  const TIME = result ? [
    { icon: "😴", label: "Time sleeping",           val: `${result.sleepYears.toFixed(1)} years` },
    { icon: "🍽️", label: "Time eating",             val: `${result.eatMonths.toFixed(1)} months` },
    { icon: "📺", label: "Time watching TV",        val: `${result.tvYears.toFixed(1)} years` },
    { icon: "🚿", label: "Time in bathroom",        val: `${result.bathroomWeeks.toFixed(0)} weeks` },
    { icon: "😂", label: "Times laughed",           val: `~${commas(result.laughs)} times` },
  ] : [];

  const FOOD = result ? [
    { icon: "🍽️", label: "Total meals eaten",       val: commas(result.totalMeals) },
    { icon: "💧", label: "Cups of water drunk",     val: commas(result.waterCups) },
    { icon: "⚖️", label: "Pounds of food consumed", val: `${commas(result.foodPounds)} lbs` },
  ] : [];

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🤯</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Fun Facts About Your Age</h1>
          <p className="text-lg text-[#a8a8b3]">Discover weird and wonderful facts about how long you&apos;ve been alive</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 md:p-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-white">Date of birth</label>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </div>
            {[
              { label: `Sleep per night: ${sleep}h`, val: sleep, set: setSleep, min: 4, max: 12 },
              { label: `TV per day: ${tv}h`,          val: tv,    set: setTv,    min: 0, max: 16 },
              { label: `Meals per day: ${meals}`,     val: meals, set: setMeals, min: 1, max: 6  },
            ].map(s => (
              <div key={s.label}>
                <label className="mb-1 block text-sm font-semibold text-white">{s.label}</label>
                <input type="range" min={s.min} max={s.max} value={s.val} onChange={e => s.set(Number(e.target.value))} className="w-full accent-[#e94560]" />
              </div>
            ))}
            <button onClick={calculate}
              className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Calculate My Life Facts →
            </button>
            {error && <p className="text-sm text-[#e94560]">{error}</p>}
          </div>

          {result && (
            <div className="mt-8 space-y-6">
              {[
                { title: "🫀 Body Facts", items: BODY },
                { title: "⏱ Time Facts", items: TIME },
                { title: "🍽️ Food Facts", items: FOOD },
              ].map(({ title, items }) => (
                <div key={title} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                  <h3 className="mb-4 font-bold text-white">{title}</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {items.map(item => (
                      <div key={item.label} className="rounded-lg bg-[#16213e] p-3 flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="text-xs text-[#a8a8b3]">{item.label}</div>
                          <div className="font-bold text-[#e94560]">{item.val}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {result && (
                <ShareButtons
                  text={`My heart has beaten ${Math.round(result.heartbeats).toLocaleString()} times! 😮 Find out yours!`}
                  url={"https://www.dayblip.com/age-facts?dob=" + dob}
                  title="Fun Age Facts"
                />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
