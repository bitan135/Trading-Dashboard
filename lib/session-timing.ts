import { SessionStatus, CountdownTime } from '@/types'

interface SessionWindow {
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
}

export const LONDON_WINDOW: SessionWindow = {
  startHour: 9,
  startMinute: 0,
  endHour: 9,
  endMinute: 30,
}

export const NY_WINDOW: SessionWindow = {
  startHour: 14,
  startMinute: 0,
  endHour: 14,
  endMinute: 30,
}

export const SUMMARY_UNLOCK_HOUR = 15

function getLondonMinutes(now: Date): number {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  
  const [hour, minute] = formatter.format(now).split(':').map(Number)
  return hour * 60 + minute
}

function windowToMinutes(window: SessionWindow): { start: number; end: number } {
  return {
    start: window.startHour * 60 + window.startMinute,
    end: window.endHour * 60 + window.endMinute,
  }
}

export function getSessionStatus(
  window: SessionWindow,
  now: Date,
  prerequisiteMet: boolean
): SessionStatus {
  if (!prerequisiteMet || !isMarketOpen(now)) return 'locked'

  const currentMinutes = getLondonMinutes(now)
  const { start, end } = windowToMinutes(window)

  if (currentMinutes < start) return 'countdown'
  if (currentMinutes >= start && currentMinutes <= end) return 'live'
  return 'expired'
}

export function getCountdown(window: SessionWindow, now: Date): CountdownTime {
  // The 'now' value in London string format
  // Instead of complex date math, we'll just use minutes remaining locally to keep it perfectly accurate to DST
  const currentTotalMins = getLondonMinutes(now)
  const targetTotalMins = window.startHour * 60 + window.startMinute
  
  if (currentTotalMins >= targetTotalMins) return { hours: 0, minutes: 0, seconds: 0 }
  
  // Diff in pure seconds
  const currentSecs = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' })).getSeconds()
  const currentTotalSeconds = currentTotalMins * 60 + currentSecs
  const targetTotalSeconds = targetTotalMins * 60
  
  const diffSecs = targetTotalSeconds - currentTotalSeconds
  
  const hours = Math.floor(diffSecs / 3600)
  const minutes = Math.floor((diffSecs % 3600) / 60)
  const seconds = diffSecs % 60

  return { hours, minutes, seconds }
}

export function getElapsed(window: SessionWindow, now: Date): string {
  const currentTotalMins = getLondonMinutes(now)
  const startTotalMins = window.startHour * 60 + window.startMinute
  
  if (currentTotalMins < startTotalMins) return "00:00"
  
  const currentSecs = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' })).getSeconds()
  const currentTotalSeconds = currentTotalMins * 60 + currentSecs
  const startTotalSeconds = startTotalMins * 60
  
  const diffSecs = currentTotalSeconds - startTotalSeconds
  
  const minutes = Math.floor(diffSecs / 60)
  const seconds = diffSecs % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function isSummaryUnlocked(now: Date, londonResolved: boolean, nyResolved: boolean): boolean {
  const currentHour = parseInt(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', hour12: false }).format(now),
    10
  )
  if (londonResolved && nyResolved) return true
  if (currentHour >= SUMMARY_UNLOCK_HOUR) return true
  return false
}

export function formatCountdown(cd: CountdownTime): string {
  return `${String(cd.hours).padStart(2, '0')}:${String(cd.minutes).padStart(2, '0')}:${String(cd.seconds).padStart(2, '0')}`
}

export function isMarketOpen(now: Date): boolean {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'long',
    hour: '2-digit',
    hour12: false,
  })
  
  const parts = formatter.formatToParts(now)
  const day = parts.find(p => p.type === 'weekday')?.value
  const hourPart = parts.find(p => p.type === 'hour')?.value
  const hour = parseInt(hourPart || '0', 10)

  // Forex market: Opens Sunday 22:00 London, Closes Friday 22:00 London
  if (day === 'Saturday') return false
  if (day === 'Sunday' && hour < 22) return false
  if (day === 'Friday' && hour >= 22) return false
  
  return true
}

export function getActiveSessionLabel(now: Date): string {
  if (!isMarketOpen(now)) return 'Market Closed'
  
  const minutes = getLondonMinutes(now)
  const london = windowToMinutes(LONDON_WINDOW)
  const ny = windowToMinutes(NY_WINDOW)

  if (minutes < london.start) return 'Pre-Session'
  if (minutes >= london.start && minutes <= london.end) return 'London Session LIVE'
  if (minutes > london.end && minutes < ny.start) return 'Awaiting NY Session'
  if (minutes >= ny.start && minutes <= ny.end) return 'NY Session LIVE'
  return 'Sessions Closed'
}
