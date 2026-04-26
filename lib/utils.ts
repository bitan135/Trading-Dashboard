export function formatTime(hour: number, minute: number): string {
  // Handle minute rollover (e.g. 30 + 30 = 60 becomes 1 hour)
  let h = hour + Math.floor(minute / 60)
  const m = minute % 60
  
  const ampm = h >= 12 && h < 24 ? 'PM' : 'AM'
  h = h % 12 || 12
  
  const mStr = m.toString().padStart(2, '0')
  return `${h}:${mStr} ${ampm}`
}

export function getKolkataTime(londonHour: number, londonMinute: number): string {
  // Kolkata is UTC+5:30, London is UTC+1 (BST) currently. Offset is +4:30.
  return formatTime(londonHour + 4, londonMinute + 30)
}

export function getTodayDate(): string {
  // Returns 'YYYY-MM-DD' exactly for London time
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date()) // 'en-CA' inherently formats as YYYY-MM-DD
}

export function getWeekNumber(dateString: string): number {
  const date = new Date(dateString + 'T12:00:00Z') // Use midday UTC to prevent timezone jump
  const target = new Date(date.valueOf())
  const dayNr = (date.getUTCDay() + 6) % 7
  target.setUTCDate(target.getUTCDate() - dayNr + 3)
  const firstThursday = target.valueOf()
  target.setUTCMonth(0, 1)
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7)
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)
}

export function formatPips(pips: number | null): string {
  if (pips === null || pips === undefined) return '—'
  if (pips === 0) return '0.0'
  return pips > 0 ? `+${pips.toFixed(1)}` : pips.toFixed(1)
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function getResultColor(result: string | null): string {
  switch (result) {
    case 'Win': return 'text-[#00ff88]'
    case 'Loss': return 'text-[#ff4444]'
    case 'Breakeven': return 'text-[#ffaa00]'
    case 'No Setup': return 'text-[#555]'
    case 'Skipped': return 'text-[#555]'
    default: return 'text-[#555]'
  }
}

export function getResultBgColor(result: string | null): string {
  switch (result) {
    case 'Win': return 'bg-[#00ff88]/10 border-[#00ff88]/30'
    case 'Loss': return 'bg-[#ff4444]/10 border-[#ff4444]/30'
    case 'Breakeven': return 'bg-[#ffaa00]/10 border-[#ffaa00]/30'
    default: return 'bg-[#1a1a1a] border-[#333]'
  }
}

export function getRowBgClass(londonResult: string | null, nyResult: string | null): string {
  if (londonResult === 'Win' || nyResult === 'Win') return 'bg-[#00ff88]/5 hover:bg-[#00ff88]/10'
  if (londonResult === 'Loss' || nyResult === 'Loss') return 'bg-[#ff4444]/5 hover:bg-[#ff4444]/10'
  if (londonResult === 'Breakeven' || nyResult === 'Breakeven') return 'bg-[#ffaa00]/5 hover:bg-[#ffaa00]/10'
  return 'bg-[#0f0f0f] hover:bg-[#141414]'
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00Z')
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC', // the date string is artificially set, so use UTC to display it literally
  })
}

export function getMonthLabel(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00Z')
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
}
