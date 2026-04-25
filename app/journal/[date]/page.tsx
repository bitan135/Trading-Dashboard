'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuthContext } from '@/components/AuthProvider'
import { useTradeDay } from '@/lib/hooks/useTradeDay'
import { useChecklistItems } from '@/lib/hooks/useChecklistItems'
import {
  PRE_SESSION_ITEMS,
  LONDON_LIQ_ITEMS,
  LONDON_ENTRY_ITEMS,
  NY_LIQ_ITEMS,
  NY_ENTRY_ITEMS,
  SUMMARY_ITEMS,
  getGroupedItems,
} from '@/lib/checklist-config'
import { formatDate, getResultColor, formatPips } from '@/lib/utils'
import { ChecklistItemConfig } from '@/types'
import Navbar from '@/components/Navbar'
import { Pencil, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function ReadOnlyChecklist({ items, checkedItems }: { items: ChecklistItemConfig[]; checkedItems: Record<string, boolean> }) {
  const grouped = getGroupedItems(items)
  return (
    <div className="flex flex-col gap-3">
      {Object.entries(grouped).map(([group, groupItems]) => (
        <div key={group}>
          <div className="text-[10px] text-[#555] uppercase tracking-widest px-3 py-1 mb-1">
            <span className="text-[#00ff88] opacity-40">// </span>{group}
          </div>
          {groupItems.map(item => (
            <div key={item.key} className="flex items-start gap-3 px-3 py-1">
              <span className={`text-sm font-bold ${checkedItems[item.key] ? 'text-[#00ff88]' : 'text-[#555]'}`}>
                {checkedItems[item.key] ? '[✓]' : '[ ]'}
              </span>
              <span className={`text-xs ${checkedItems[item.key] ? 'text-[#00ff88] opacity-80' : 'text-[#888]'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function JournalDayPage() {
  const { user, loading: authLoading } = useAuthContext()
  const router = useRouter()
  const params = useParams()
  const dateString = params.date as string
  const { tradeDay, loading: dayLoading, updateTradeDay } = useTradeDay(dateString)
  const { items, loading: checklistLoading } = useChecklistItems(dateString)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  if (authLoading || !user || dayLoading || checklistLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="loading-spinner" />
        </div>
      </>
    )
  }

  if (!tradeDay) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="panel p-8 text-center text-[#555]">
            No data found for {dateString}
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/journal" className="text-[#555] hover:text-[#00ff88] transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div className="terminal-header">
              <span className="prefix">&gt;</span>
              <span>DAY_REVIEW</span>
              <span className="subtitle">// {formatDate(dateString)}</span>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={`btn-primary flex items-center gap-2 text-xs ${editing ? 'btn-danger' : ''}`}
          >
            <Pencil size={12} />
            {editing ? 'DONE' : 'EDIT'}
          </button>
        </div>

        {/* Meta Info */}
        <div className="panel p-5 flex flex-wrap gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[#555] uppercase tracking-widest">Pair</span>
            <span className="text-sm text-[#00d4ff]">{tradeDay.pair ?? '—'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[#555] uppercase tracking-widest">Bias</span>
            <span className={`text-sm ${tradeDay.bias === 'Bullish' ? 'text-[#00ff88]' : 'text-[#ff4444]'}`}>
              {tradeDay.bias ?? '—'}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[#555] uppercase tracking-widest">Zone</span>
            <span className="text-sm text-[#ffaa00]">{tradeDay.zone ?? '—'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[#555] uppercase tracking-widest">Week</span>
            <span className="text-sm text-[#888]">W{tradeDay.week_number}</span>
          </div>
        </div>

        {/* Pre-Session */}
        <div className="panel p-5 flex flex-col gap-3">
          <div className="terminal-header mb-2">
            <span className="prefix">&gt;</span>
            <span>PRE_SESSION</span>
            <span className="subtitle">// {PRE_SESSION_ITEMS.filter(i => items[i.key]).length}/{PRE_SESSION_ITEMS.length}</span>
          </div>
          <ReadOnlyChecklist items={PRE_SESSION_ITEMS} checkedItems={items} />
        </div>

        {/* London Session */}
        <div className="panel p-5 flex flex-col gap-4">
          <div className="terminal-header mb-2">
            <span className="prefix">&gt;</span>
            <span>LONDON_SESSION</span>
          </div>
          <div className="flex flex-wrap gap-6 mb-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[#555] uppercase tracking-widest">Result</span>
              <span className={`text-lg font-bold ${getResultColor(tradeDay.london_result)}`}>
                {tradeDay.london_result ?? '—'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[#555] uppercase tracking-widest">Pips</span>
              <span className="text-lg font-bold text-[#e0e0e0]">{formatPips(tradeDay.london_pips)}</span>
            </div>
          </div>
          <ReadOnlyChecklist items={[...LONDON_LIQ_ITEMS, ...LONDON_ENTRY_ITEMS]} checkedItems={items} />
          <div className="flex flex-col gap-2 mt-3">
            <span className="text-[10px] text-[#555] uppercase tracking-widest">Notes</span>
            {editing ? (
              <textarea
                value={tradeDay.london_notes}
                onChange={e => updateTradeDay({ london_notes: e.target.value })}
                onBlur={() => updateTradeDay({ london_notes: tradeDay.london_notes })}
                rows={3}
              />
            ) : (
              <p className="text-xs text-[#888] whitespace-pre-wrap">{tradeDay.london_notes || 'No notes recorded.'}</p>
            )}
          </div>
        </div>

        {/* NY Session */}
        <div className="panel p-5 flex flex-col gap-4">
          <div className="terminal-header mb-2">
            <span className="prefix">&gt;</span>
            <span>NY_SESSION</span>
          </div>
          <div className="flex flex-wrap gap-6 mb-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[#555] uppercase tracking-widest">Result</span>
              <span className={`text-lg font-bold ${getResultColor(tradeDay.ny_result)}`}>
                {tradeDay.ny_result ?? '—'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[#555] uppercase tracking-widest">Pips</span>
              <span className="text-lg font-bold text-[#e0e0e0]">{formatPips(tradeDay.ny_pips)}</span>
            </div>
          </div>
          <ReadOnlyChecklist items={[...NY_LIQ_ITEMS, ...NY_ENTRY_ITEMS]} checkedItems={items} />
          <div className="flex flex-col gap-2 mt-3">
            <span className="text-[10px] text-[#555] uppercase tracking-widest">Notes</span>
            {editing ? (
              <textarea
                value={tradeDay.ny_notes}
                onChange={e => updateTradeDay({ ny_notes: e.target.value })}
                onBlur={() => updateTradeDay({ ny_notes: tradeDay.ny_notes })}
                rows={3}
              />
            ) : (
              <p className="text-xs text-[#888] whitespace-pre-wrap">{tradeDay.ny_notes || 'No notes recorded.'}</p>
            )}
          </div>
        </div>

        {/* Day Summary */}
        <div className="panel p-5 flex flex-col gap-4">
          <div className="terminal-header mb-2">
            <span className="prefix">&gt;</span>
            <span>DAY_SUMMARY</span>
          </div>
          <ReadOnlyChecklist items={SUMMARY_ITEMS} checkedItems={items} />
          <div className="flex flex-col gap-2 mt-3">
            <span className="text-[10px] text-[#555] uppercase tracking-widest">Reflection</span>
            {editing ? (
              <textarea
                value={tradeDay.day_summary_notes}
                onChange={e => updateTradeDay({ day_summary_notes: e.target.value })}
                onBlur={() => updateTradeDay({ day_summary_notes: tradeDay.day_summary_notes })}
                rows={4}
              />
            ) : (
              <p className="text-xs text-[#888] whitespace-pre-wrap">{tradeDay.day_summary_notes || 'No reflection recorded.'}</p>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
