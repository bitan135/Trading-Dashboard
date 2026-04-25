'use client'

import { TradeDay } from '@/types'
import { formatDate, getResultColor, formatPips } from '@/lib/utils'

interface DayCardProps {
  day: TradeDay
}

export default function DayCard({ day }: DayCardProps) {
  const totalPips = (day.london_pips ?? 0) + (day.ny_pips ?? 0)

  return (
    <div className="panel p-4 flex flex-col gap-3 hover:border-[rgba(0,255,136,0.25)] transition-colors duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#888]">{formatDate(day.date)}</span>
        {day.pair && (
          <span className="badge bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20">
            {day.pair}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* London */}
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-[10px] text-[#555] uppercase tracking-widest">London</span>
          <span className={`text-sm font-semibold ${getResultColor(day.london_result)}`}>
            {day.london_result ?? '—'}
          </span>
          {day.london_pips !== null && (
            <span className="text-[11px] text-[#888]">{formatPips(day.london_pips)} pips</span>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-[rgba(0,255,136,0.1)]" />

        {/* NY */}
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-[10px] text-[#555] uppercase tracking-widest">NY</span>
          <span className={`text-sm font-semibold ${getResultColor(day.ny_result)}`}>
            {day.ny_result ?? '—'}
          </span>
          {day.ny_pips !== null && (
            <span className="text-[11px] text-[#888]">{formatPips(day.ny_pips)} pips</span>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-[rgba(0,255,136,0.1)]" />

        {/* Total */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#555] uppercase tracking-widest">Total</span>
          <span className={`text-sm font-bold ${totalPips > 0 ? 'text-[#00ff88]' : totalPips < 0 ? 'text-[#ff4444]' : 'text-[#888]'}`}>
            {formatPips(totalPips)}
          </span>
        </div>
      </div>
    </div>
  )
}
