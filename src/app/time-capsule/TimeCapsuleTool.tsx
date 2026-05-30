"use client";
import { useState, useEffect } from "react";

interface Capsule { name:string; message:string; hopes:string; createdAt:string; openDate:string }

function pad(n: number) { return String(n).padStart(2,"0"); }
function fmtDate(d: Date) { return d.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}); }

export default function TimeCapsuleTool() {
  const [name,     setName]     = useState("");
  const [message,  setMessage]  = useState("");
  const [hopes,    setHopes]    = useState("");
  const [openDate, setOpenDate] = useState("");
  const [capsule,  setCapsule]  = useState<Capsule|null>(null);
  const [error,    setError]    = useState("");
  const [timeLeft, setTimeLeft] = useState({d:0,h:0,m:0,s:0});
  const [saving,   setSaving]   = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied,   setCopied]   = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("tc_capsule");
      if (s) setCapsule(JSON.parse(s));
    } catch { /* ignore */ }
  },[]);

  useEffect(() => {
    if (!capsule) return;
    const tick = () => {
      const open = new Date(capsule.openDate+"T00:00:00");
      const diff  = Math.max(0, open.getTime()-Date.now());
      const tot   = Math.floor(diff/1000);
      setTimeLeft({d:Math.floor(tot/86400),h:Math.floor((tot%86400)/3600),m:Math.floor((tot%3600)/60),s:tot%60});
    };
    tick();
    const id = setInterval(tick,1000);
    return () => clearInterval(id);
  },[capsule]);

  const seal = async () => {
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!message.trim()) { setError("Please enter a message."); return; }
    if (!openDate) { setError("Please set an open date."); return; }
    if (new Date(openDate+"T00:00:00") <= new Date()) { setError("Open date must be in the future."); return; }
    setError("");
    setSaving(true);

    const uniqueId = `${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
    const c: Capsule = { name, message, hopes, openDate, createdAt: new Date().toISOString() };

    // Always save locally as backup
    try { localStorage.setItem("tc_capsule", JSON.stringify(c)); } catch { /* ignore */ }

    // Persist to JSONBin.io so the capsule survives after the browser closes
    try {
      const response = await fetch("https://api.jsonbin.io/v3/b", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Bin-Name": "dayblip-capsule-" + uniqueId,
        },
        body: JSON.stringify({
          name,
          message,
          openDate,
          hopes,
          createdAt: c.createdAt,
        }),
      });
      const data = await response.json();
      const binId = data?.metadata?.id;
      if (binId) {
        setShareUrl(`https://dayblip.com/time-capsule/${binId}`);
      }
    } catch { /* offline / blocked — local backup still works */ }

    setCapsule(c);
    setSaving(false);
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const clear = () => { setCapsule(null); setShareUrl(""); try { localStorage.removeItem("tc_capsule"); } catch { /* ignore */ } };

  const isOpen = capsule && new Date(capsule.openDate+"T00:00:00") <= new Date();
  const daysAgo = capsule ? Math.floor((Date.now()-new Date(capsule.createdAt).getTime())/86400000) : 0;
  const shareText = capsule ? encodeURIComponent(`I just ${isOpen?"opened":"created"} my time capsule from ${fmtDate(new Date(capsule.createdAt))}!\nCreate yours → dayblip.com/time-capsule`) : "";

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">⏳</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Personal Time Capsule</h1>
          <p className="text-lg text-[#a8a8b3]">Write a message to your future self and set a date to open it</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[600px]">
          {!capsule ? (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-white">Your name</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-white">Message to your future self ({message.length}/500)</label>
                <textarea value={message} onChange={e=>setMessage(e.target.value.slice(0,500))} rows={5}
                  placeholder="Dear future me, today I am thinking about..."
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none resize-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-white">What are you hoping for? ({hopes.length}/200)</label>
                <textarea value={hopes} onChange={e=>setHopes(e.target.value.slice(0,200))} rows={3}
                  placeholder="I hope that by this date..."
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none resize-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-white">Open date (must be in the future)</label>
                <input type="date" value={openDate} onChange={e=>setOpenDate(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
              <button onClick={seal} disabled={saving} className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60">{saving ? "Saving…" : "Seal My Time Capsule →"}</button>
              {error && <p className="text-sm text-[#e94560]">{error}</p>}
            </div>
          ) : isOpen ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-green-500/30 bg-green-900/20 p-6 text-center">
                <p className="text-3xl mb-2">🎉</p>
                <h2 className="text-2xl font-black text-white">{capsule.name}&apos;s Time Capsule — Unsealed!</h2>
                <p className="text-[#a8a8b3] text-sm mt-1">Written {daysAgo} days ago on {fmtDate(new Date(capsule.createdAt))}</p>
              </div>
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                <p className="text-white whitespace-pre-wrap">{capsule.message}</p>
              </div>
              {capsule.hopes && <div className="rounded-xl border border-[#e94560]/20 bg-[#16213e] p-4"><p className="text-[#a8a8b3] text-sm italic">&ldquo;{capsule.hopes}&rdquo;</p></div>}
              <div className="flex gap-3">
                <button onClick={clear} className="rounded-lg border border-[#0f3460] px-4 py-3 text-[#a8a8b3] hover:text-white">Create New Capsule</button>
                <a href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noopener noreferrer"
                  className="rounded-lg border border-[#333] bg-black px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90">Share on X →</a>
              </div>
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
              {shareUrl ? (
                <div className="rounded-xl border border-green-500/30 bg-green-900/20 p-5 text-center">
                  <p className="text-white font-semibold mb-1">🎉 Your capsule is saved online!</p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <input readOnly value={shareUrl} onClick={e=>e.currentTarget.select()}
                      className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2 text-sm text-white" />
                    <button onClick={copyUrl} className="rounded-lg bg-[#e94560] px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90 whitespace-nowrap">{copied ? "Copied!" : "Copy link"}</button>
                  </div>
                  <p className="text-[#a8a8b3] text-xs mt-3">This link works even after closing your browser — bookmark it!</p>
                </div>
              ) : (
                <p className="text-xs text-[#a8a8b3] text-center">Note: Capsule is stored in your browser. Clearing browser data may remove it.</p>
              )}
              <button onClick={clear} className="rounded-lg border border-[#0f3460] px-4 py-2 text-[#a8a8b3] hover:text-white text-sm">Create New Capsule</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
