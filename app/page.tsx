'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthContext } from '@/components/AuthProvider'
import { useJournal } from '@/lib/hooks/useJournal'
import { useWeekStats } from '@/lib/hooks/useStats'
import { useTradeDay } from '@/lib/hooks/useTradeDay'
import { useChecklistItems } from '@/lib/hooks/useChecklistItems'
import { getActiveSessionLabel, isMarketOpen } from '@/lib/session-timing'
import { getTodayDate, getWeekNumber, cn } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import DualClock from '@/components/DualClock'
import ProgressBar from '@/components/ProgressBar'
import StatCard from '@/components/StatCard'
import DayCard from '@/components/DayCard'
import { PRE_SESSION_ITEMS, LONDON_LIQ_ITEMS, LONDON_ENTRY_ITEMS, NY_LIQ_ITEMS, NY_ENTRY_ITEMS } from '@/lib/checklist-config'
import { ChevronRight } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuthContext()
  const router = useRouter()
  const today = getTodayDate()
  const currentWeek = getWeekNumber(today)
  const { tradeDay } = useTradeDay(today)
  const { items: checklistItems } = useChecklistItems(today)
  const { days, loading: journalLoading } = useJournal(60)
  const weekStats = useWeekStats(days, currentWeek)
  const [sessionLabel, setSessionLabel] = useState('')
  const [marketOpen, setMarketOpen] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setSessionLabel(getActiveSessionLabel(now))
      setMarketOpen(isMarketOpen(now))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    )
  }

  // Calculate checklist progress for today
  const preChecked = PRE_SESSION_ITEMS.filter(i => checklistItems[i.key]).length
  const londonChecked = [...LONDON_LIQ_ITEMS, ...LONDON_ENTRY_ITEMS].filter(i => checklistItems[i.key]).length
  const nyChecked = [...NY_LIQ_ITEMS, ...NY_ENTRY_ITEMS].filter(i => checklistItems[i.key]).length

  const last5 = days.slice(0, 5)

  const isLive = sessionLabel.includes('LIVE')

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <DualClock />
            <div className="flex items-center gap-2 mt-1">
              {isLive && (
                <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse-green" />
              )}
              <span className={`text-xs uppercase tracking-widest ${isLive ? 'text-[#00ff88]' : 'text-[#888]'}`}>
                {sessionLabel}
              </span>
              <span className="text-[#333]">|</span>
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  marketOpen ? "bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.4)]" : "bg-[#ff4444]"
                )} />
                <span className={cn(
                  "text-[10px] uppercase tracking-[0.2em] font-bold",
                  marketOpen ? "text-[#00ff88]" : "text-[#ff4444] opacity-70"
                )}>
                  MARKET_{marketOpen ? 'LIVE' : 'CLOSED'}
                </span>
              </div>
            </div>
          </div>

          <Link href="/session" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
            &gt; START_SESSION
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Today's Progress */}
        <section className="panel p-6 flex flex-col gap-5">
          <div className="terminal-header">
            <span className="prefix">&gt;</span>
            <span>TODAY_PROGRESS</span>
            <span className="subtitle">{`// ${today}`}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ProgressBar label="Pre-Session" current={preChecked} total={PRE_SESSION_ITEMS.length} />
            <ProgressBar
              label="London Session"
              current={londonChecked}
              total={LONDON_LIQ_ITEMS.length + LONDON_ENTRY_ITEMS.length}
            />
            <ProgressBar
              label="NY Session"
              current={nyChecked}
              total={NY_LIQ_ITEMS.length + NY_ENTRY_ITEMS.length}
            />
          </div>

          {tradeDay && (
            <div className="flex flex-wrap gap-3 text-xs">
              {tradeDay.pair && (
                <span className="badge bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20">
                  {tradeDay.pair}
                </span>
              )}
              {tradeDay.bias && (
                <span className={`badge border ${tradeDay.bias === 'Bullish' ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20' : 'bg-[#ff4444]/10 text-[#ff4444] border-[#ff4444]/20'}`}>
                  {tradeDay.bias}
                </span>
              )}
              {tradeDay.zone && (
                <span className={`badge border ${tradeDay.zone === 'Premium' ? 'bg-[#ffaa00]/10 text-[#ffaa00] border-[#ffaa00]/20' : 'bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/20'}`}>
                  {tradeDay.zone}
                </span>
              )}
            </div>
          )}
        </section>

        {/* Week Stats */}
        <section className="flex flex-col gap-4">
          <div className="terminal-header">
            <span className="prefix">&gt;</span>
            <span>WEEK_{currentWeek}_STATS</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Trades" value={weekStats.trades} color="cyan" />
            <StatCard label="Wins" value={weekStats.wins} color="green" />
            <StatCard label="Losses" value={weekStats.losses} color="red" />
            <StatCard label="Breakeven" value={weekStats.breakeven} color="amber" />
          </div>
        </section>

        {/* Last 5 Days */}
        <section className="flex flex-col gap-4">
          <div className="terminal-header">
            <span className="prefix">&gt;</span>
            <span>RECENT_SESSIONS</span>
            <span className="subtitle">{`// last 5 days`}</span>
          </div>

          {journalLoading ? (
            <div className="flex items-center gap-3 text-[#555] text-sm">
              <div className="loading-spinner" />
              Loading journal data...
            </div>
          ) : last5.length === 0 ? (
            <div className="panel p-8 text-center text-[#555] text-sm">
              No trading sessions recorded yet. Start your first session above.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {last5.map((day) => (
                <Link key={day.date} href={`/journal/${day.date}`}>
                  <DayCard day={day} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
