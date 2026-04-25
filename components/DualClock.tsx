'use client'

import { useState, useEffect } from 'react'

export default function DualClock() {
  const [time, setTime] = useState<{ london: string; kolkata: string; londonDate: string } | null>(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()

      const londonTime = now.toLocaleTimeString('en-US', {
        timeZone: 'Europe/London',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })

      const kolkataTime = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })

      const londonDate = now.toLocaleDateString('en-GB', {
        timeZone: 'Europe/London',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })

      setTime({ london: londonTime, kolkata: kolkataTime, londonDate })
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!time) {
    return (
      <div className="flex flex-col gap-1">
        <div className="h-10 w-52 bg-[#141414] rounded animate-pulse" />
        <div className="h-4 w-36 bg-[#141414] rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {/* London Time - Primary */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl sm:text-4xl font-bold text-[#00ff88] tabular-nums tracking-tight">
          {time.london}
        </span>
        <span className="text-[10px] text-[#555] uppercase tracking-widest">London</span>
      </div>

      {/* Date + Kolkata */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="text-xs text-[#888]">{time.londonDate}</span>
        <span className="text-xs text-[#555]">•</span>
        <span className="text-xs text-[#00d4ff] tabular-nums">
          {time.kolkata}
          <span className="text-[10px] text-[#555] ml-1.5 uppercase tracking-widest">Kolkata</span>
        </span>
      </div>
    </div>
  )
}
