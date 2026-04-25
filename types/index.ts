import { Timestamp } from 'firebase/firestore'

export type TradePair = 'GBPUSD' | 'EURUSD' | 'Both'
export type Bias = 'Bullish' | 'Bearish'
export type Zone = 'Premium' | 'Discount'
export type SessionResult = 'Win' | 'Loss' | 'Breakeven' | 'No Setup' | 'Skipped'
export type ChecklistSection = 'pre' | 'london_liq' | 'london_entry' | 'ny_liq' | 'ny_entry' | 'summary'

export interface TradeDay {
  date: string                              // "2026-04-24"
  pair: TradePair | null
  bias: Bias | null
  zone: Zone | null
  week_number: number
  pre_session_done: boolean
  london_trade_taken: boolean
  london_result: SessionResult | null
  london_pips: number | null
  london_notes: string
  ny_trade_taken: boolean
  ny_result: SessionResult | null
  ny_pips: number | null
  ny_notes: string
  day_summary_notes: string
  created_at: Timestamp | null
  updated_at: Timestamp | null
}

export interface ChecklistItem {
  section: ChecklistSection
  checked: boolean
  updated_at: Timestamp | null
}

export interface ChecklistItemConfig {
  key: string
  label: string
  group: string
  section: ChecklistSection
  warning?: string
}

export type SessionStatus = 'locked' | 'countdown' | 'live' | 'expired'

export interface CountdownTime {
  hours: number
  minutes: number
  seconds: number
}

export interface WeekStats {
  week_number: number
  trades: number
  wins: number
  losses: number
  breakeven: number
  pips: number
}

export interface PerformanceStats {
  total_trades: number
  wins: number
  losses: number
  breakeven: number
  no_setup: number
  skipped: number
  win_rate: number
  total_pips: number
  current_streak: number
  best_streak: number
  weekly_data: WeekStats[]
  monthly_data: { month: string; pips: number; trades: number }[]
}

export const DEFAULT_TRADE_DAY: Omit<TradeDay, 'created_at' | 'updated_at'> = {
  date: '',
  pair: null,
  bias: null,
  zone: null,
  week_number: 0,
  pre_session_done: false,
  london_trade_taken: false,
  london_result: null,
  london_pips: null,
  london_notes: '',
  ny_trade_taken: false,
  ny_result: null,
  ny_pips: null,
  ny_notes: '',
  day_summary_notes: '',
}
