"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Capsule { name:string; message:string; hopes:string; createdAt:string; openDate:string }

function pad(n: number) { return String(n).padStart(2,"0"); }
function fmtDate(d: Date) { return d.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}); }

export default function CapsuleView({ id }: { id: string }) {
  const [capsule, setCapsule] = useState<Capsule|null>(null);
  const [status,  setStatus]  = useState<"loading"|"ready"|"error">("loading");
  const [timeLeft, setTimeLeft] = useState({d:0,h:0,m:0,s:0});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${id}/latest`);
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        const record = data?.record;
        if (!record || !record.openDate) throw new Error("invalid");
        if (!cancelled) { setCapsule(record as Capsule); setStatus("ready"); }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (!capsule) return;
    const tick = () => {
      const open = new Date(capsule.openDate+"T00:00:00");
      const diff = Math.max(0, open.getTime()-Date.now());
      const tot  = Math.floor(diff/1000);
      setTimeLeft({d:Math.floor(tot/86400),h:Math.floor((tot%86400)/3600),m:Math.floor((tot%3600)/60),s:tot%60});
    };
    tick();
    const i = setInterval(tick,1000);
    return () => clearInterval(i);
  }, [capsule]);

  const isOpen = capsule && new Date(capsule.openDate+"T00:00:00") <= new Date();

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">⏳</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Time Capsule</h1>
          <p className="text-lg text-[#a8a8b3]">A message sealed for the future</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[600px]">
          {status === "loading" && (
            <p className="text-center text-[#a8a8b3]">Opening capsule…</p>
          )}

          {status === "error" && (
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
              <p className="text-4xl mb-2">🚫</p>
              <h2 className="text-2xl font-black text-white">Capsule not found</h2>
              <p className="text-[#a8a8b3] mt-2">This capsule may have expired or the link is incorrect.</p>
              <Link href="/time-capsule" className="mt-4 inline-block rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Create your own →</Link>
            </div>
          )}

          {status === "ready" && capsule && (
            isOpen ? (
              <div className="space-y-5">
                <div className="rounded-xl border border-green-500/30 bg-green-900/20 p-6 text-center">
                  <p className="text-3xl mb-2">🎉</p>
                  <h2 className="text-2xl font-black text-white">{capsule.name}&apos;s Time Capsule — Unsealed!</h2>
                  <p className="text-[#a8a8b3] text-sm mt-1">Written on {fmtDate(new Date(capsule.createdAt))}</p>
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                  <p className="text-white whitespace-pre-wrap">{capsule.message}</p>
                </div>
                {capsule.hopes && <div className="rounded-xl border border-[#e94560]/20 bg-[#1a1a2e] p-4"><p className="text-[#a8a8b3] text-sm italic">&ldquo;{capsule.hopes}&rdquo;</p></div>}
                <Link href="/time-capsule" className="inline-block rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Create your own →</Link>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
                  <p className="text-4xl mb-2">🔒</p>
                  <h2 className="text-2xl font-black text-white">{capsule.name}&apos;s Time Capsule</h2>
                  <p className="text-[#a8a8b3] mt-1">Opens on {fmtDate(new Date(capsule.openDate+"T00:00:00"))}</p>
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {[{l:"Days",v:timeLeft.d},{l:"Hours",v:timeLeft.h},{l:"Min",v:timeLeft.m},{l:"Sec",v:timeLeft.s}].map(u=>(
                      <div key={u.l} className="min-w-[70px] rounded-xl bg-[#16213e] border border-[#0f3460] px-4 py-3 text-center">
                        <div className="text-2xl font-black text-[#e94560] tabular-nums">{pad(u.v)}</div>
                        <div className="text-xs text-[#a8a8b3]">{u.l}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[#a8a8b3] text-sm mt-4">Message: 🔒 Hidden until opening day</p>
                </div>
                <Link href="/time-capsule" className="inline-block rounded-lg border border-[#0f3460] px-5 py-3 text-[#a8a8b3] hover:text-white">Create your own →</Link>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
