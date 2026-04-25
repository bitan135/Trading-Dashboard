'use client'

import { useState, useEffect } from 'react'
import { SessionStatus as StatusType, CountdownTime } from '@/types'
import {
  getSessionStatus,
  getCountdown,
  getElapsed,
  formatCountdown,
  LONDON_WINDOW,
  NY_WINDOW,
} from '@/lib/session-timing'

interface SessionStatusProps {
  session: 'london' | 'ny'
  prerequisiteMet: boolean
}

export default function SessionStatus({ session, prerequisiteMet }: SessionStatusProps) {
  const [status, setStatus] = useState<StatusType>('locked')
  const [countdown, setCountdown] = useState<CountdownTime>({ hours: 0, minutes: 0, seconds: 0 })
  const [elapsed, setElapsed] = useState<string>('00:00')

  const window = session === 'london' ? LONDON_WINDOW : NY_WINDOW
  const sessionLabel = session === 'london' ? 'LONDON' : 'NEW YORK'

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const s = getSessionStatus(window, now, prerequisiteMet)
      setStatus(s)

      if (s === 'countdown') {
        setCountdown(getCountdown(window, now))
      } else if (s === 'live') {
        setElapsed(getElapsed(window, now))
      }
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [prerequisiteMet, window])

  if (status === 'locked') return null

  if (status === 'countdown') {
    return (
      <div className="flex items-center gap-3 text-[#ffaa00] bg-[#ffaa00]/5 border border-[#ffaa00]/20 px-4 py-3 rounded-sm">
        <span className="text-[11px] uppercase tracking-wider">
          {sessionLabel} SESSION OPENS IN:
        </span>
        <span className="text-lg font-bold tracking-widest">{formatCountdown(countdown)}</span>
      </div>
    )
  }

  if (status === 'live') {
    return (
      <div className="flex items-center gap-3 text-[#00ff88] bg-[#00ff88]/5 border border-[#00ff88]/20 px-4 py-3 rounded-sm">
        <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse-green" />
        <span className="text-[11px] uppercase tracking-wider font-semibold">
          {sessionLabel} SESSION LIVE
        </span>
        <span className="text-xs text-[#888]">
          Elapsed: {elapsed}
        </span>
      </div>
    )
  }

  // expired
  return (
    <div className="flex items-center gap-3 text-[#ff4444] bg-[#ff4444]/5 border border-[#ff4444]/20 px-4 py-3 rounded-sm">
      <span className="text-[11px] uppercase tracking-wider">
        {sessionLabel} SESSION CLOSED — window expired
      </span>
    </div>
  )
}
