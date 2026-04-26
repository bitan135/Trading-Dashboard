'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'

export default function RulesPage() {
  const { user, loading: authLoading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="loading-spinner" />
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        <div className="terminal-header">
          <span className="prefix">&gt;</span>
          <span>SCALP_FRAMEWORK</span>
          <span className="subtitle">{`// WWA Trading — Waqar Asim`}</span>
        </div>

        {/* S — SPOT THE IMPULSE */}
        <section className="panel p-6 flex flex-col gap-4">
          <h2 className="text-[#00ff88] text-sm font-bold tracking-[3px] uppercase border-b border-[rgba(0,255,136,0.1)] pb-3">
            S — SPOT THE IMPULSE
          </h2>
          <div className="flex flex-col gap-3 text-xs text-[#e0e0e0] leading-relaxed">
            <p><span className="text-[#00d4ff]">&gt;</span> Identify the latest <span className="text-[#00ff88]">1H Higher High (HH)</span> or <span className="text-[#ff4444]">Lower Low (LL)</span> on the chart.</p>
            <p><span className="text-[#00d4ff]">&gt;</span> Mark the <span className="text-[#ffaa00]">External High</span> and <span className="text-[#ffaa00]">External Low</span> of the current trading range.</p>
            <p><span className="text-[#00d4ff]">&gt;</span> Confirm the impulse direction using a clear directional arrow.</p>
            <p><span className="text-[#00d4ff]">&gt;</span> The impulse defines your <span className="text-[#00ff88]">bias</span> for the day — you only trade in the direction of the impulse.</p>
            <p><span className="text-[#00d4ff]">&gt;</span> If no clear impulse exists, <span className="text-[#ff4444]">do not trade</span>.</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[rgba(0,255,136,0.08)] p-3 rounded-sm">
            <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">Key Rules</p>
            <ul className="text-[11px] text-[#888] flex flex-col gap-1">
              <li>• The trading range is defined by the External High → External Low</li>
              <li>• Only trade when impulse is clear and confirmed</li>
              <li>• Never trade against the impulse direction</li>
            </ul>
          </div>
        </section>

        {/* C — CALCULATE PREMIUM/DISCOUNT */}
        <section className="panel p-6 flex flex-col gap-4">
          <h2 className="text-[#00ff88] text-sm font-bold tracking-[3px] uppercase border-b border-[rgba(0,255,136,0.1)] pb-3">
            C — CALCULATE PREMIUM / DISCOUNT
          </h2>
          <div className="flex flex-col gap-3 text-xs text-[#e0e0e0] leading-relaxed">
            <p><span className="text-[#00d4ff]">&gt;</span> Draw Fibonacci from <span className="text-[#ffaa00]">External High → External Low</span>.</p>
            <p><span className="text-[#00d4ff]">&gt;</span> Mark the <span className="text-[#00ff88]">0.5 (50%) midpoint</span> level.</p>
            <p><span className="text-[#00d4ff]">&gt;</span> <span className="text-[#ffaa00]">Premium zone</span> = above the 0.5 level (expensive, look for sells).</p>
            <p><span className="text-[#00d4ff]">&gt;</span> <span className="text-[#00d4ff]">Discount zone</span> = below the 0.5 level (cheap, look for buys).</p>
            <p><span className="text-[#00d4ff]">&gt;</span> Confirm that the current price is in the <span className="text-[#00ff88]">correct zone</span> for your bias.</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[rgba(0,255,136,0.08)] p-3 rounded-sm">
            <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">Zone Logic</p>
            <ul className="text-[11px] text-[#888] flex flex-col gap-1">
              <li>• <span className="text-[#ff4444]">Bearish bias</span> → Look for entries in the <span className="text-[#ffaa00]">Premium zone</span></li>
              <li>• <span className="text-[#00ff88]">Bullish bias</span> → Look for entries in the <span className="text-[#00d4ff]">Discount zone</span></li>
              <li>• Never enter at the 0.5 level — it&apos;s neutral, not a POI</li>
            </ul>
          </div>
        </section>

        {/* A — ASSESS POIs */}
        <section className="panel p-6 flex flex-col gap-4">
          <h2 className="text-[#00ff88] text-sm font-bold tracking-[3px] uppercase border-b border-[rgba(0,255,136,0.1)] pb-3">
            A — ASSESS POIs (Points of Interest)
          </h2>
          <div className="flex flex-col gap-3 text-xs text-[#e0e0e0] leading-relaxed">
            <p><span className="text-[#00d4ff]">&gt;</span> On 1H, identify the <span className="text-[#00ff88]">Extreme Order Block (OB)</span> — the farthest OB in the correct zone.</p>
            <p><span className="text-[#00d4ff]">&gt;</span> On 1H, identify the <span className="text-[#ffaa00]">Decisional zone</span> — a key institutional level before the extreme.</p>
            <p><span className="text-[#00d4ff]">&gt;</span> Refine both POIs down to <span className="text-[#00d4ff]">M5</span> for precise OB/RIFC zones.</p>
            <p><span className="text-[#00d4ff]">&gt;</span> At each POI, look for the <span className="text-[#00ff88]">BIP pattern</span>: Buildup → Inducement → Push.</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[rgba(0,255,136,0.08)] p-3 rounded-sm">
            <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">POI Hierarchy</p>
            <ul className="text-[11px] text-[#888] flex flex-col gap-1">
              <li>• Extreme OB &gt; Decisional zone (Extreme is the higher probability POI)</li>
              <li>• Always refine from 1H → M5 before marking your zone</li>
              <li>• If BIP is not visible, the POI may not hold — wait for confirmation</li>
            </ul>
          </div>
        </section>

        {/* L — LIQUIDITY GRAB */}
        <section className="panel p-6 flex flex-col gap-4">
          <h2 className="text-[#00ff88] text-sm font-bold tracking-[3px] uppercase border-b border-[rgba(0,255,136,0.1)] pb-3">
            L — LIQUIDITY GRAB
          </h2>
          <div className="flex flex-col gap-3 text-xs text-[#e0e0e0] leading-relaxed">
            <p><span className="text-[#00d4ff]">&gt;</span> Wait for price to <span className="text-[#00ff88]">reach the marked POI</span> (Extreme or Decisional).</p>
            <p><span className="text-[#00d4ff]">&gt;</span> Confirm a <span className="text-[#ffaa00]">liquidity sweep</span> at the POI — look for:</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[rgba(0,255,136,0.08)] p-3 rounded-sm">
            <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">Valid Liquidity Pools</p>
            <ul className="text-[11px] text-[#888] flex flex-col gap-1">
              <li>• High/Low of Previous Day (HOPD) ✓</li>
              <li>• High/Low of Previous Week (HOPW) ✓</li>
              <li>• SMC Trap / Trendline Liquidity ✓</li>
              <li>• Frankfurt / London Session High or Low ✓ (London session)</li>
              <li>• London Session High or Low ✓ (NY session only)</li>
              <li className="text-[#ff4444]">• ✗ Asia High alone is NOT a valid liquidity pool</li>
            </ul>
          </div>
          <div className="bg-[#ff4444]/5 border border-[#ff4444]/20 p-3 rounded-sm">
            <p className="text-[11px] text-[#ff4444]">
              ⚠ Sweep must be confirmed within a <span className="font-bold">30-minute window</span>. Do not enter on Asia High sweep alone.
            </p>
          </div>
        </section>

        {/* P — POSITION ENTRY */}
        <section className="panel p-6 flex flex-col gap-4">
          <h2 className="text-[#00ff88] text-sm font-bold tracking-[3px] uppercase border-b border-[rgba(0,255,136,0.1)] pb-3">
            P — POSITION ENTRY (M1)
          </h2>
          <div className="flex flex-col gap-3 text-xs text-[#e0e0e0] leading-relaxed">
            <p><span className="text-[#00d4ff]">&gt;</span> After sweep confirmation, <span className="text-[#00ff88]">drop to M1</span>.</p>
            <p><span className="text-[#00d4ff]">&gt;</span> Wait for <span className="text-[#ffaa00]">M1 Break of Structure (BOS)</span>.</p>
            <p><span className="text-[#00d4ff]">&gt;</span> Confirm the <span className="text-[#00d4ff]">Two-Leg Protocol</span> on M1.</p>
            <p><span className="text-[#00d4ff]">&gt;</span> See BIB: <span className="text-[#00ff88]">Buildup → Inducement → BOS</span> on M1.</p>
            <p><span className="text-[#00d4ff]">&gt;</span> Enter on the <span className="text-[#00ff88]">refined IFC</span> (Institutional Funding Candle).</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[rgba(0,255,136,0.08)] p-3 rounded-sm">
            <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">Trade Management Rules</p>
            <ul className="text-[11px] text-[#888] flex flex-col gap-1">
              <li>• <span className="text-[#ffaa00]">SL</span>: 3–7 pips maximum (NO wider)</li>
              <li>• <span className="text-[#00ff88]">TP</span>: 1:3 fixed RR (no exceptions)</li>
              <li>• <span className="text-[#00d4ff]">BE</span>: Move to breakeven on M1 structural shift</li>
              <li>• Max <span className="text-[#ff4444]">1 trade per session</span></li>
              <li>• Risk <span className="text-[#ff4444]">1% per trade</span></li>
            </ul>
          </div>
        </section>

        {/* Discipline Rules */}
        <section className="panel p-6 flex flex-col gap-4">
          <h2 className="text-[#ff4444] text-sm font-bold tracking-[3px] uppercase border-b border-[rgba(255,68,68,0.2)] pb-3">
            ⚠ NON-NEGOTIABLE RULES
          </h2>
          <div className="bg-[#ff4444]/5 border border-[#ff4444]/20 p-4 rounded-sm">
            <ul className="text-[12px] text-[#e0e0e0] flex flex-col gap-3 leading-relaxed">
              <li><span className="text-[#ff4444] font-bold">01.</span> Max 1 trade per session (London OR NY)</li>
              <li><span className="text-[#ff4444] font-bold">02.</span> Risk exactly 1% per trade — no more, no less</li>
              <li><span className="text-[#ff4444] font-bold">03.</span> Do NOT revenge trade after a loss</li>
              <li><span className="text-[#ff4444] font-bold">04.</span> Do NOT widen SL beyond 7 pips under any circumstances</li>
              <li><span className="text-[#ff4444] font-bold">05.</span> Review every trade after close — win or loss</li>
              <li><span className="text-[#ff4444] font-bold">06.</span> Log every result in this journal — no skipping</li>
              <li><span className="text-[#ff4444] font-bold">07.</span> The checklist must be completed in order — never skip steps</li>
              <li><span className="text-[#ff4444] font-bold">08.</span> If the setup is not there, <span className="text-[#ffaa00]">walk away</span></li>
            </ul>
          </div>
        </section>

        {/* Session Windows */}
        <section className="panel p-6 flex flex-col gap-4">
          <h2 className="text-[#00d4ff] text-sm font-bold tracking-[3px] uppercase border-b border-[rgba(0,212,255,0.2)] pb-3">
            SESSION WINDOWS (LONDON / KOLKATA)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#0a0a0a] border border-[rgba(0,255,136,0.08)] p-4 rounded-sm">
              <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">London Session</p>
              <p className="text-lg text-[#00ff88] font-bold">9:00 AM — 9:30 AM London</p>
              <p className="text-[11px] text-[#00ff88]/60 font-bold">1:30 PM — 2:00 PM Kolkata</p>
              <p className="text-[11px] text-[#888] mt-2">30-minute entry window</p>
            </div>
            <div className="bg-[#0a0a0a] border border-[rgba(0,255,136,0.08)] p-4 rounded-sm">
              <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">New York Session</p>
              <p className="text-lg text-[#00d4ff] font-bold">2:00 PM — 2:30 PM London</p>
              <p className="text-[11px] text-[#00d4ff]/60 font-bold">6:30 PM — 7:00 PM Kolkata</p>
              <p className="text-[11px] text-[#888] mt-2">30-minute entry window</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-[10px] text-[#333] uppercase tracking-[4px] py-4">
          S.C.A.L.P. Framework — WWA Trading — Waqar Asim
        </div>
      </main>
    </>
  )
}
