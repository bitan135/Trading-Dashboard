'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/AuthProvider'
import { useJournal } from '@/lib/hooks/useJournal'
import { useStats } from '@/lib/hooks/useStats'
import Navbar from '@/components/Navbar'
import StatCard from '@/components/StatCard'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

export default function StatsPage() {
  const { user, loading: authLoading } = useAuthContext()
  const router = useRouter()
  const { days, loading } = useJournal(200)
  const stats = useStats(days)

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

  const winRateColor = stats.win_rate >= 50 ? 'green' : 'red'

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        <div className="terminal-header">
          <span className="prefix">&gt;</span>
          <span>PERFORMANCE_STATS</span>
          <span className="subtitle">// all time</span>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-[#555] text-sm">
            <div className="loading-spinner" />
            Crunching numbers...
          </div>
        ) : (
          <>
            {/* Win Rate Hero */}
            <div className="panel p-8 flex flex-col items-center gap-2 animate-glow">
              <span className="text-[10px] text-[#555] uppercase tracking-[4px]">Win Rate</span>
              <span className={`text-6xl font-bold tracking-tight ${winRateColor === 'green' ? 'text-[#00ff88]' : 'text-[#ff4444]'}`}>
                {stats.win_rate.toFixed(1)}%
              </span>
              <span className="text-[11px] text-[#555]">
                Based on {stats.total_trades} total trades
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="Total Trades" value={stats.total_trades} color="cyan" />
              <StatCard label="Wins" value={stats.wins} color="green" />
              <StatCard label="Losses" value={stats.losses} color="red" />
              <StatCard label="Breakeven" value={stats.breakeven} color="amber" />
              <StatCard label="No Setup" value={stats.no_setup} color="muted" />
              <StatCard label="Skipped" value={stats.skipped} color="muted" />
            </div>

            {/* Streaks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Current Streak" value={stats.current_streak} color="green" suffix="wins" />
              <StatCard label="Best Streak" value={stats.best_streak} color="cyan" suffix="wins" />
              <StatCard label="Total Pips" value={stats.total_pips.toFixed(1)} color={stats.total_pips >= 0 ? 'green' : 'red'} />
            </div>

            {/* Weekly Chart */}
            <div className="panel p-6 flex flex-col gap-4">
              <div className="terminal-header">
                <span className="prefix">&gt;</span>
                <span>TRADES_PER_WEEK</span>
              </div>
              {stats.weekly_data.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.weekly_data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,136,0.06)" />
                      <XAxis
                        dataKey="week_number"
                        tick={{ fill: '#555', fontSize: 11 }}
                        tickFormatter={(v) => `W${v}`}
                        axisLine={{ stroke: 'rgba(0,255,136,0.1)' }}
                      />
                      <YAxis
                        tick={{ fill: '#555', fontSize: 11 }}
                        axisLine={{ stroke: 'rgba(0,255,136,0.1)' }}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#141414',
                          border: '1px solid rgba(0,255,136,0.2)',
                          borderRadius: 2,
                          fontSize: 12,
                          color: '#e0e0e0',
                        }}
                        labelFormatter={(v) => `Week ${v}`}
                      />
                      <Bar dataKey="trades" fill="#00ff88" radius={[2, 2, 0, 0]}>
                        {stats.weekly_data.map((_, idx) => (
                          <Cell key={idx} fill="#00ff88" fillOpacity={0.8} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center text-[#555] text-sm py-8">No weekly data yet.</div>
              )}
            </div>

            {/* Monthly Pips Chart */}
            <div className="panel p-6 flex flex-col gap-4">
              <div className="terminal-header">
                <span className="prefix">&gt;</span>
                <span>MONTHLY_PIPS</span>
              </div>
              {stats.monthly_data.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.monthly_data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,136,0.06)" />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: '#555', fontSize: 11 }}
                        axisLine={{ stroke: 'rgba(0,255,136,0.1)' }}
                      />
                      <YAxis
                        tick={{ fill: '#555', fontSize: 11 }}
                        axisLine={{ stroke: 'rgba(0,255,136,0.1)' }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#141414',
                          border: '1px solid rgba(0,255,136,0.2)',
                          borderRadius: 2,
                          fontSize: 12,
                          color: '#e0e0e0',
                        }}
                      />
                      <Bar dataKey="pips" radius={[2, 2, 0, 0]}>
                        {stats.monthly_data.map((entry, idx) => (
                          <Cell
                            key={idx}
                            fill={entry.pips >= 0 ? '#00ff88' : '#ff4444'}
                            fillOpacity={0.8}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center text-[#555] text-sm py-8">No monthly data yet.</div>
              )}
            </div>
          </>
        )}
      </main>
    </>
  )
}
