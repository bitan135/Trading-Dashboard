export function getTodayUTC(): string {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

export function getWeekNumber(dateString: string): number {
  const date = new Date(dateString + 'T00:00:00Z')
  const jan1 = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const dayOfYear = Math.floor((date.getTime() - jan1.getTime()) / 86400000) + 1
  return Math.ceil((dayOfYear + jan1.getUTCDay()) / 7)
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
  const date = new Date(dateString + 'T00:00:00Z')
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function getMonthLabel(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00Z')
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
}
