'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/AuthProvider'
import { useJournal } from '@/lib/hooks/useJournal'
import { SessionResult, TradePair } from '@/types'
import { formatDate, getResultColor, getRowBgClass, formatPips } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import { ChevronRight } from 'lucide-react'

const RESULT_OPTIONS: (SessionResult | 'All')[] = ['All', 'Win', 'Loss', 'Breakeven', 'No Setup', 'Skipped']
const PAIR_OPTIONS: (TradePair | 'All')[] = ['All', 'GBPUSD', 'EURUSD', 'Both']

export default function JournalPage() {
  const { user, loading: authLoading } = useAuthContext()
  const router = useRouter()
  const { days, loading } = useJournal(60)

  const [filterResult, setFilterResult] = useState<SessionResult | 'All'>('All')
  const [filterPair, setFilterPair] = useState<TradePair | 'All'>('All')
  const [filterMonth, setFilterMonth] = useState<string>('All')
  const [filterWeek, setFilterWeek] = useState<string>('All')

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  const months = useMemo(() => {
    const set = new Set(days.map(d => d.date.substring(0, 7)))
    return ['All', ...Array.from(set).sort().reverse()]
  }, [days])

  const weeks = useMemo(() => {
    const set = new Set(days.map(d => String(d.week_number)))
    return ['All', ...Array.from(set).sort((a, b) => Number(b) - Number(a))]
  }, [days])

  const filtered = useMemo(() => {
    return days.filter(day => {
      if (filterResult !== 'All') {
        if (day.london_result !== filterResult && day.ny_result !== filterResult) return false
      }
      if (filterPair !== 'All' && day.pair !== filterPair) return false
      if (filterMonth !== 'All' && !day.date.startsWith(filterMonth)) return false
      if (filterWeek !== 'All' && String(day.week_number) !== filterWeek) return false
      return true
    })
  }, [days, filterResult, filterPair, filterMonth, filterWeek])

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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        <div className="terminal-header">
          <span className="prefix">&gt;</span>
          <span>TRADE_JOURNAL</span>
          <span className="subtitle">{`// ${filtered.length} entries`}</span>
        </div>

        {/* Filters */}
        <div className="panel p-4 flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[#555] uppercase tracking-widest">Result</label>
            <select value={filterResult} onChange={e => setFilterResult(e.target.value as SessionResult | 'All')}>
              {RESULT_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[#555] uppercase tracking-widest">Pair</label>
            <select value={filterPair} onChange={e => setFilterPair(e.target.value as TradePair | 'All')}>
              {PAIR_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[#555] uppercase tracking-widest">Month</label>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[#555] uppercase tracking-widest">Week</label>
            <select value={filterWeek} onChange={e => setFilterWeek(e.target.value)}>
              {weeks.map(w => <option key={w} value={w}>{w === 'All' ? 'All' : `W${w}`}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center gap-3 text-[#555] text-sm">
            <div className="loading-spinner" />
            Loading journal...
          </div>
        ) : filtered.length === 0 ? (
          <div className="panel p-8 text-center text-[#555] text-sm">
            No entries match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[rgba(0,255,136,0.15)]">
                  <th className="text-left px-3 py-3 text-[10px] text-[#555] uppercase tracking-widest">Date</th>
                  <th className="text-left px-3 py-3 text-[10px] text-[#555] uppercase tracking-widest">Pair</th>
                  <th className="text-left px-3 py-3 text-[10px] text-[#555] uppercase tracking-widest">Bias</th>
                  <th className="text-left px-3 py-3 text-[10px] text-[#555] uppercase tracking-widest">Zone</th>
                  <th className="text-left px-3 py-3 text-[10px] text-[#555] uppercase tracking-widest">London</th>
                  <th className="text-left px-3 py-3 text-[10px] text-[#555] uppercase tracking-widest">NY</th>
                  <th className="text-right px-3 py-3 text-[10px] text-[#555] uppercase tracking-widest">Pips</th>
                  <th className="text-right px-3 py-3 text-[10px] text-[#555] uppercase tracking-widest">Week</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(day => {
                  const totalPips = (day.london_pips ?? 0) + (day.ny_pips ?? 0)
                  return (
                    <tr
                      key={day.date}
                      className={`${getRowBgClass(day.london_result, day.ny_result)} border-b border-[rgba(0,255,136,0.05)] cursor-pointer transition-colors duration-150`}
                      onClick={() => router.push(`/journal/${day.date}`)}
                    >
                      <td className="px-3 py-3 text-[#e0e0e0] whitespace-nowrap">{formatDate(day.date)}</td>
                      <td className="px-3 py-3 text-[#00d4ff]">{day.pair ?? '—'}</td>
                      <td className="px-3 py-3">
                        <span className={day.bias === 'Bullish' ? 'text-[#00ff88]' : day.bias === 'Bearish' ? 'text-[#ff4444]' : 'text-[#555]'}>
                          {day.bias ?? '—'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[#888]">{day.zone ?? '—'}</td>
                      <td className="px-3 py-3">
                        <span className={`font-semibold ${getResultColor(day.london_result)}`}>
                          {day.london_result ?? '—'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`font-semibold ${getResultColor(day.ny_result)}`}>
                          {day.ny_result ?? '—'}
                        </span>
                      </td>
                      <td className={`px-3 py-3 text-right font-semibold ${totalPips > 0 ? 'text-[#00ff88]' : totalPips < 0 ? 'text-[#ff4444]' : 'text-[#888]'}`}>
                        {formatPips(totalPips)}
                      </td>
                      <td className="px-3 py-3 text-right text-[#555]">W{day.week_number}</td>
                      <td className="px-3 py-3">
                        <ChevronRight size={12} className="text-[#555]" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  )
}
