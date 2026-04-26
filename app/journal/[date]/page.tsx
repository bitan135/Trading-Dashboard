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
import { formatDate, getResultColor, formatPips, formatTime, getKolkataTime } from '@/lib/utils'
import { LONDON_WINDOW, NY_WINDOW } from '@/lib/session-timing'
import { ChecklistItemConfig, TradeDay } from '@/types'
import Navbar from '@/components/Navbar'
import { Pencil, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'

function ReadOnlyChecklist({ items, checkedItems }: { items: ChecklistItemConfig[]; checkedItems: Record<string, boolean> }) {
  const grouped = getGroupedItems(items)
  return (
    <div className="flex flex-col gap-3">
      {Object.entries(grouped).map(([group, groupItems]) => (
        <div key={group}>
          <div className="text-[10px] text-[#555] uppercase tracking-widest px-3 py-1 mb-1">
            <span className="text-[#00ff88] opacity-40">{`// `}</span>{group}
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
  const { tradeDay, loading: dayLoading, updateTradeDay, deleteTradeDay } = useTradeDay(dateString)
  const { items, loading: checklistLoading } = useChecklistItems(dateString)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Partial<TradeDay>>({})

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  const handleEditToggle = () => {
    if (editing) {
      // Save changes
      if (Object.keys(draft).length > 0) {
        updateTradeDay(draft)
        setDraft({})
      }
    }
    setEditing(!editing)
  }

  const updateDraft = (fields: Partial<TradeDay>) => {
    setDraft(prev => ({ ...prev, ...fields }))
  }

  // Helper to get current value (draft or saved)
  const getValue = <K extends keyof TradeDay>(key: K): TradeDay[K] => {
    if (draft.hasOwnProperty(key)) return draft[key] as TradeDay[K]
    return tradeDay?.[key] as TradeDay[K]
  }

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
              <span className="subtitle">{`// ${formatDate(dateString)}`}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to delete this journal entry? This action cannot be undone.')) {
                  await deleteTradeDay()
                  router.push('/journal')
                }
              }}
              className="btn-primary border-[#ff4444] text-[#ff4444] hover:bg-[#ff4444]/10 flex items-center gap-2 text-xs"
            >
              <Trash2 size={12} />
              DELETE
            </button>
            <button
              onClick={handleEditToggle}
              className={`btn-primary flex items-center gap-2 text-xs ${editing ? 'btn-danger' : ''}`}
            >
              <Pencil size={12} />
              {editing ? 'DONE' : 'EDIT'}
            </button>
          </div>
        </div>

        {/* Meta Info */}
        <div className="panel p-5 flex flex-wrap gap-6 items-end">
          <div className="flex flex-col gap-1 min-w-[100px]">
            <span className="text-[10px] text-[#555] uppercase tracking-widest">Pair</span>
            {editing ? (
              <select
                value={getValue('pair') ?? ''}
                onChange={e => updateDraft({ pair: (e.target.value || null) as any })}
                className="bg-[#141414] border-[#333] text-xs py-1"
              >
                <option value="">Select...</option>
                <option value="GBPUSD">GBPUSD</option>
                <option value="EURUSD">EURUSD</option>
                <option value="Both">Both</option>
              </select>
            ) : (
              <span className="text-sm text-[#00d4ff]">{getValue('pair') ?? '—'}</span>
            )}
          </div>
          <div className="flex flex-col gap-1 min-w-[100px]">
            <span className="text-[10px] text-[#555] uppercase tracking-widest">Bias</span>
            {editing ? (
              <select
                value={getValue('bias') ?? ''}
                onChange={e => updateDraft({ bias: (e.target.value || null) as any })}
                className="bg-[#141414] border-[#333] text-xs py-1"
              >
                <option value="">Select...</option>
                <option value="Bullish">Bullish</option>
                <option value="Bearish">Bearish</option>
              </select>
            ) : (
              <span className={`text-sm ${getValue('bias') === 'Bullish' ? 'text-[#00ff88]' : 'text-[#ff4444]'}`}>
                {getValue('bias') ?? '—'}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 min-w-[100px]">
            <span className="text-[10px] text-[#555] uppercase tracking-widest">Zone</span>
            {editing ? (
              <select
                value={getValue('zone') ?? ''}
                onChange={e => updateDraft({ zone: (e.target.value || null) as any })}
                className="bg-[#141414] border-[#333] text-xs py-1"
              >
                <option value="">Select...</option>
                <option value="Premium">Premium</option>
                <option value="Discount">Discount</option>
              </select>
            ) : (
              <span className="text-sm text-[#ffaa00]">{getValue('zone') ?? '—'}</span>
            )}
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
            <span className="subtitle">{`// ${PRE_SESSION_ITEMS.filter(i => items[i.key]).length}/${PRE_SESSION_ITEMS.length}`}</span>
          </div>
          <ReadOnlyChecklist items={PRE_SESSION_ITEMS} checkedItems={items} />
        </div>

        {/* London Session */}
        <div className="panel p-5 flex flex-col gap-4">
          <div className="terminal-header mb-2">
            <span className="prefix">&gt;</span>
            <span>LONDON_SESSION</span>
            <span className="subtitle">{`// ${formatTime(LONDON_WINDOW.startHour, LONDON_WINDOW.startMinute)} – ${formatTime(LONDON_WINDOW.endHour, LONDON_WINDOW.endMinute)} London (${getKolkataTime(LONDON_WINDOW.startHour, LONDON_WINDOW.startMinute)} – ${getKolkataTime(LONDON_WINDOW.endHour, LONDON_WINDOW.endMinute)} Kolkata)`}</span>
          </div>
          <div className="flex flex-wrap gap-6 mb-3 items-end">
            <div className="flex flex-col gap-1 min-w-[120px]">
              <span className="text-[10px] text-[#555] uppercase tracking-widest">Result</span>
              {editing ? (
                <select
                  value={getValue('london_result') ?? ''}
                  onChange={e => updateDraft({ london_result: (e.target.value || null) as any })}
                  className="bg-[#141414] border-[#333] text-sm py-1"
                >
                  <option value="">Select...</option>
                  <option value="Win">Win</option>
                  <option value="Loss">Loss</option>
                  <option value="Breakeven">Breakeven</option>
                  <option value="No Setup">No Setup</option>
                  <option value="Skipped">Skipped</option>
                </select>
              ) : (
                <span className={`text-lg font-bold ${getResultColor(getValue('london_result'))}`}>
                  {getValue('london_result') ?? '—'}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 min-w-[80px]">
              <span className="text-[10px] text-[#555] uppercase tracking-widest">Pips</span>
              {editing ? (
                <input
                  type="number"
                  step="0.1"
                  value={getValue('london_pips') ?? ''}
                  onChange={e => updateDraft({ london_pips: e.target.value ? parseFloat(e.target.value) : null })}
                  className="bg-[#141414] border-[#333] text-sm py-1 w-20"
                />
              ) : (
                <span className="text-lg font-bold text-[#e0e0e0]">{formatPips(getValue('london_pips'))}</span>
              )}
            </div>
          </div>
          <ReadOnlyChecklist items={[...LONDON_LIQ_ITEMS, ...LONDON_ENTRY_ITEMS]} checkedItems={items} />
          <div className="flex flex-col gap-2 mt-3">
            <span className="text-[10px] text-[#555] uppercase tracking-widest">Notes</span>
            {editing ? (
              <textarea
                value={getValue('london_notes')}
                onChange={e => updateDraft({ london_notes: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="text-xs text-[#888] whitespace-pre-wrap">{getValue('london_notes') || 'No notes recorded.'}</p>
            )}
          </div>
        </div>

        {/* NY Session */}
        <div className="panel p-5 flex flex-col gap-4">
          <div className="terminal-header mb-2">
            <span className="prefix">&gt;</span>
            <span>NY_SESSION</span>
            <span className="subtitle">{`// ${formatTime(NY_WINDOW.startHour, NY_WINDOW.startMinute)} – ${formatTime(NY_WINDOW.endHour, NY_WINDOW.endMinute)} London (${getKolkataTime(NY_WINDOW.startHour, NY_WINDOW.startMinute)} – ${getKolkataTime(NY_WINDOW.endHour, NY_WINDOW.endMinute)} Kolkata)`}</span>
          </div>
          <div className="flex flex-wrap gap-6 mb-3 items-end">
            <div className="flex flex-col gap-1 min-w-[120px]">
              <span className="text-[10px] text-[#555] uppercase tracking-widest">Result</span>
              {editing ? (
                <select
                  value={getValue('ny_result') ?? ''}
                  onChange={e => updateDraft({ ny_result: (e.target.value || null) as any })}
                  className="bg-[#141414] border-[#333] text-sm py-1"
                >
                  <option value="">Select...</option>
                  <option value="Win">Win</option>
                  <option value="Loss">Loss</option>
                  <option value="Breakeven">Breakeven</option>
                  <option value="No Setup">No Setup</option>
                  <option value="Skipped">Skipped</option>
                </select>
              ) : (
                <span className={`text-lg font-bold ${getResultColor(getValue('ny_result'))}`}>
                  {getValue('ny_result') ?? '—'}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 min-w-[80px]">
              <span className="text-[10px] text-[#555] uppercase tracking-widest">Pips</span>
              {editing ? (
                <input
                  type="number"
                  step="0.1"
                  value={getValue('ny_pips') ?? ''}
                  onChange={e => updateDraft({ ny_pips: e.target.value ? parseFloat(e.target.value) : null })}
                  className="bg-[#141414] border-[#333] text-sm py-1 w-20"
                />
              ) : (
                <span className="text-lg font-bold text-[#e0e0e0]">{formatPips(getValue('ny_pips'))}</span>
              )}
            </div>
          </div>
          <ReadOnlyChecklist items={[...NY_LIQ_ITEMS, ...NY_ENTRY_ITEMS]} checkedItems={items} />
          <div className="flex flex-col gap-2 mt-3">
            <span className="text-[10px] text-[#555] uppercase tracking-widest">Notes</span>
            {editing ? (
              <textarea
                value={getValue('ny_notes')}
                onChange={e => updateDraft({ ny_notes: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="text-xs text-[#888] whitespace-pre-wrap">{getValue('ny_notes') || 'No notes recorded.'}</p>
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
                value={getValue('day_summary_notes')}
                onChange={e => updateDraft({ day_summary_notes: e.target.value })}
                rows={4}
              />
            ) : (
              <p className="text-xs text-[#888] whitespace-pre-wrap">{getValue('day_summary_notes') || 'No reflection recorded.'}</p>
            )}
          </div>

          {(tradeDay.screenshot_url_before || tradeDay.screenshot_url_after) && (
            <div className="mt-4 pt-4 border-t border-[rgba(0,255,136,0.08)]">
              <span className="text-[10px] text-[#555] uppercase tracking-widest block mb-3">Screenshots</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tradeDay.screenshot_url_before && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#888] uppercase tracking-wider">Before</span>
                    <a href={tradeDay.screenshot_url_before} target="_blank" rel="noopener noreferrer">
                      <img src={tradeDay.screenshot_url_before} alt="Before Trade" className="rounded border border-[#333] hover:border-[#00ff88] transition-colors" />
                    </a>
                  </div>
                )}
                {tradeDay.screenshot_url_after && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#888] uppercase tracking-wider">After</span>
                    <a href={tradeDay.screenshot_url_after} target="_blank" rel="noopener noreferrer">
                      <img src={tradeDay.screenshot_url_after} alt="After Trade" className="rounded border border-[#333] hover:border-[#00ff88] transition-colors" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
