'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SessionResult } from '@/types'
import { cn } from '@/lib/utils'

interface OutcomeFormProps {
  session: 'london' | 'ny'
  onSave: (result: SessionResult, pips: number | null, notes: string) => void
  initialResult?: SessionResult | null
  initialPips?: number | null
  initialNotes?: string
  disabled?: boolean
}

const RESULTS: SessionResult[] = ['Win', 'Loss', 'Breakeven', 'No Setup', 'Skipped']

const RESULT_COLORS: Record<SessionResult, string> = {
  Win: 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/06',
  Loss: 'border-[#ff4444] text-[#ff4444] bg-[#ff4444]/06',
  Breakeven: 'border-[#ffaa00] text-[#ffaa00] bg-[#ffaa00]/06',
  'No Setup': 'border-[#555] text-[#888] bg-[#555]/06',
  Skipped: 'border-[#555] text-[#888] bg-[#555]/06',
}

export default function OutcomeForm({
  session,
  onSave,
  initialResult,
  initialPips,
  initialNotes,
  disabled,
}: OutcomeFormProps) {
  const [result, setResult] = useState<SessionResult | null>(initialResult ?? null)
  const [pips, setPips] = useState<string>(initialPips !== null && initialPips !== undefined ? String(initialPips) : '')
  const [notes, setNotes] = useState<string>(initialNotes ?? '')
  const [saved, setSaved] = useState(false)

  const showPips = result === 'Win' || result === 'Loss' || result === 'Breakeven'
  const sessionLabel = session === 'london' ? 'LONDON' : 'NY'

  const handleSave = () => {
    if (!result) return
    const pipsValue = showPips && pips !== '' ? parseFloat(pips) : null
    onSave(result, pipsValue, notes)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <motion.div
      className="panel-elevated p-5 flex flex-col gap-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="text-[11px] text-[#555] uppercase tracking-widest">
        <span className="text-[#00ff88] opacity-40">{`// `}</span>
        {sessionLabel} OUTCOME
      </div>

      {/* Result Selection */}
      <div className="flex flex-wrap gap-2">
        {RESULTS.map((r) => (
          <button
            key={r}
            onClick={() => !disabled && setResult(r)}
            className={cn(
              'radio-option',
              result === r && 'selected',
              result === r && RESULT_COLORS[r],
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <span className="text-[10px]">{result === r ? '◉' : '○'}</span>
            {r}
          </button>
        ))}
      </div>

      {/* Pips Input */}
      {showPips && (
        <div className="flex flex-col gap-2">
          <label className="text-[11px] text-[#888] uppercase tracking-widest">
            Pips {result === 'Loss' ? '(negative)' : '(positive)'}
          </label>
          <input
            type="number"
            step="0.1"
            value={pips}
            onChange={(e) => setPips(e.target.value)}
            placeholder="e.g. 15.5"
            className="w-40"
            disabled={disabled}
          />
        </div>
      )}

      {/* Notes */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] text-[#888] uppercase tracking-widest">
          Session Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What happened? What did you learn?"
          disabled={disabled}
          rows={3}
        />
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={!result || disabled}
          className={cn(
            'btn-primary',
            (!result || disabled) && 'opacity-30 cursor-not-allowed'
          )}
        >
          {saved ? '[SAVED ✓]' : '> SAVE_OUTCOME'}
        </button>
        {saved && (
          <span className="text-[#00ff88] text-xs animate-fade-in">
            Result logged to Firestore
          </span>
        )}
      </div>
    </motion.div>
  )
}
