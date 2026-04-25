'use client'

import { useState, useEffect } from 'react'

export default function UtcClock() {
  const [time, setTime] = useState<string>('')
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'UTC',
        })
      )
      setDate(
        now.toLocaleDateString('en-GB', {
          weekday: 'long',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: 'UTC',
        })
      )
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!time) {
    return (
      <div className="flex items-center gap-3">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-2">
        <span className="text-[#00ff88] text-2xl font-bold tracking-wider">{time}</span>
        <span className="text-[#555] text-xs uppercase tracking-widest">UTC</span>
      </div>
      <span className="text-[#888] text-xs tracking-wide">{date}</span>
    </div>
  )
}
