'use client'

import { useMemo } from 'react'
import { TradeDay, PerformanceStats, WeekStats } from '@/types'

function countResult(days: TradeDay[], result: string): number {
  return days.reduce((count, day) => {
    if (day.london_result === result) count++
    if (day.ny_result === result) count++
    return count
  }, 0)
}

function getTotalPips(days: TradeDay[]): number {
  return days.reduce((total, day) => {
    if (day.london_pips !== null && day.london_pips !== undefined) total += day.london_pips
    if (day.ny_pips !== null && day.ny_pips !== undefined) total += day.ny_pips
    return total
  }, 0)
}

function getTotalTrades(days: TradeDay[]): number {
  return days.reduce((count, day) => {
    if (day.london_trade_taken) count++
    if (day.ny_trade_taken) count++
    return count
  }, 0)
}

function calculateStreaks(days: TradeDay[]): { current: number; best: number } {
  // Sort days by date ascending for streak calculation
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date))
  let current = 0
  let best = 0
  let streak = 0

  for (const day of sorted) {
    const results = []
    if (day.london_result) results.push(day.london_result)
    if (day.ny_result) results.push(day.ny_result)

    for (const result of results) {
      if (result === 'Win') {
        streak++
        best = Math.max(best, streak)
      } else if (result === 'Loss') {
        streak = 0
      }
    }
  }
  current = streak

  return { current, best }
}

function getWeeklyData(days: TradeDay[]): WeekStats[] {
  const weekMap = new Map<number, WeekStats>()

  for (const day of days) {
    const wn = day.week_number
    if (!weekMap.has(wn)) {
      weekMap.set(wn, { week_number: wn, trades: 0, wins: 0, losses: 0, breakeven: 0, pips: 0 })
    }
    const stats = weekMap.get(wn)!

    if (day.london_trade_taken) {
      stats.trades++
      if (day.london_result === 'Win') stats.wins++
      if (day.london_result === 'Loss') stats.losses++
      if (day.london_result === 'Breakeven') stats.breakeven++
      if (day.london_pips) stats.pips += day.london_pips
    }
    if (day.ny_trade_taken) {
      stats.trades++
      if (day.ny_result === 'Win') stats.wins++
      if (day.ny_result === 'Loss') stats.losses++
      if (day.ny_result === 'Breakeven') stats.breakeven++
      if (day.ny_pips) stats.pips += day.ny_pips
    }
  }

  return Array.from(weekMap.values()).sort((a, b) => a.week_number - b.week_number)
}

function getMonthlyData(days: TradeDay[]): { month: string; pips: number; trades: number }[] {
  const monthMap = new Map<string, { pips: number; trades: number }>()

  for (const day of days) {
    const monthKey = day.date.substring(0, 7) // "2026-04"
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, { pips: 0, trades: 0 })
    }
    const stats = monthMap.get(monthKey)!

    if (day.london_trade_taken) {
      stats.trades++
      if (day.london_pips) stats.pips += day.london_pips
    }
    if (day.ny_trade_taken) {
      stats.trades++
      if (day.ny_pips) stats.pips += day.ny_pips
    }
  }

  return Array.from(monthMap.entries())
    .map(([month, data]) => {
      const date = new Date(month + '-01T00:00:00Z')
      const label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
      return { month: label, ...data }
    })
    .sort((a, b) => a.month.localeCompare(b.month))
}

export function useStats(days: TradeDay[]): PerformanceStats {
  return useMemo(() => {
    const wins = countResult(days, 'Win')
    const losses = countResult(days, 'Loss')
    const breakeven = countResult(days, 'Breakeven')
    const no_setup = countResult(days, 'No Setup')
    const skipped = countResult(days, 'Skipped')
    const total_trades = getTotalTrades(days)
    const total_pips = getTotalPips(days)
    const { current, best } = calculateStreaks(days)
    const win_rate = total_trades > 0 ? (wins / total_trades) * 100 : 0

    return {
      total_trades,
      wins,
      losses,
      breakeven,
      no_setup,
      skipped,
      win_rate,
      total_pips,
      current_streak: current,
      best_streak: best,
      weekly_data: getWeeklyData(days),
      monthly_data: getMonthlyData(days),
    }
  }, [days])
}

export function useWeekStats(days: TradeDay[], weekNumber: number): WeekStats {
  return useMemo(() => {
    const weekDays = days.filter(d => d.week_number === weekNumber)
    const stats: WeekStats = { week_number: weekNumber, trades: 0, wins: 0, losses: 0, breakeven: 0, pips: 0 }

    for (const day of weekDays) {
      if (day.london_trade_taken) {
        stats.trades++
        if (day.london_result === 'Win') stats.wins++
        if (day.london_result === 'Loss') stats.losses++
        if (day.london_result === 'Breakeven') stats.breakeven++
        if (day.london_pips) stats.pips += day.london_pips
      }
      if (day.ny_trade_taken) {
        stats.trades++
        if (day.ny_result === 'Win') stats.wins++
        if (day.ny_result === 'Loss') stats.losses++
        if (day.ny_result === 'Breakeven') stats.breakeven++
        if (day.ny_pips) stats.pips += day.ny_pips
      }
    }

    return stats
  }, [days, weekNumber])
}
