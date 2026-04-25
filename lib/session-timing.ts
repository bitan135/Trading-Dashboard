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

function getUtcMinutes(now: Date): number {
  return now.getUTCHours() * 60 + now.getUTCMinutes()
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
  if (!prerequisiteMet) return 'locked'

  const currentMinutes = getUtcMinutes(now)
  const { start, end } = windowToMinutes(window)

  if (currentMinutes < start) return 'countdown'
  if (currentMinutes >= start && currentMinutes <= end) return 'live'
  return 'expired'
}

export function getCountdown(window: SessionWindow, now: Date): CountdownTime {
  const targetMs = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    window.startHour,
    window.startMinute,
    0
  )
  const nowMs = now.getTime()
  const diffMs = Math.max(0, targetMs - nowMs)

  const totalSeconds = Math.floor(diffMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { hours, minutes, seconds }
}

export function getElapsed(window: SessionWindow, now: Date): string {
  const startMs = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    window.startHour,
    window.startMinute,
    0
  )
  const nowMs = now.getTime()
  const diffMs = Math.max(0, nowMs - startMs)

  const totalSeconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function isSummaryUnlocked(now: Date, londonResolved: boolean, nyResolved: boolean): boolean {
  const currentHour = now.getUTCHours()
  if (londonResolved && nyResolved) return true
  if (currentHour >= SUMMARY_UNLOCK_HOUR) return true
  return false
}

export function formatCountdown(cd: CountdownTime): string {
  return `${String(cd.hours).padStart(2, '0')}:${String(cd.minutes).padStart(2, '0')}:${String(cd.seconds).padStart(2, '0')}`
}

export function getActiveSessionLabel(now: Date): string {
  const minutes = getUtcMinutes(now)
  const london = windowToMinutes(LONDON_WINDOW)
  const ny = windowToMinutes(NY_WINDOW)

  if (minutes < london.start) return 'Pre-Session'
  if (minutes >= london.start && minutes <= london.end) return 'London Session LIVE'
  if (minutes > london.end && minutes < ny.start) return 'Awaiting NY Session'
  if (minutes >= ny.start && minutes <= ny.end) return 'NY Session LIVE'
  return 'Sessions Closed'
}
