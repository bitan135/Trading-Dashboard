'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/AuthProvider'
import { useTradeDay } from '@/lib/hooks/useTradeDay'
import { useChecklistItems } from '@/lib/hooks/useChecklistItems'
import {
  getSessionStatus,
  isSummaryUnlocked,
  isMarketOpen,
  LONDON_WINDOW,
  NY_WINDOW,
} from '@/lib/session-timing'
import { getTodayDate, formatTime, getKolkataTime } from '@/lib/utils'
import {
  PRE_SESSION_ITEMS,
  LONDON_LIQ_ITEMS,
  LONDON_ENTRY_ITEMS,
  NY_LIQ_ITEMS,
  NY_ENTRY_ITEMS,
  SUMMARY_ITEMS,
  getGroupedItems,
} from '@/lib/checklist-config'
import { SessionResult, TradePair, Bias, Zone } from '@/types'
import Navbar from '@/components/Navbar'
import ChecklistSection from '@/components/ChecklistSection'
import ChecklistGroup from '@/components/ChecklistGroup'
import ProgressBar from '@/components/ProgressBar'
import SessionStatus from '@/components/SessionStatus'
import OutcomeForm from '@/components/OutcomeForm'
import ImageUploader from '@/components/ImageUploader'
import { AlertTriangle } from 'lucide-react'
import MarketClosedModal from '@/components/MarketClosedModal'

export default function SessionPage() {
  const { user, loading: authLoading } = useAuthContext()
  const router = useRouter()
  const today = getTodayDate()
  const { tradeDay, loading: dayLoading, updateTradeDay } = useTradeDay(today)
  const { items, toggleItem, loading: checklistLoading } = useChecklistItems(today)
  const [now, setNow] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Guard for market closed
  const checkMarketLock = () => {
    if (!isMarketOpen(now)) {
      setIsModalOpen(true)
      return true
    }
    return false
  }

  const guardedUpdateTradeDay = (fields: Partial<TradeDay>) => {
    if (checkMarketLock()) return
    updateTradeDay(fields)
  }

  const guardedToggleItem = (key: string, category: string) => {
    if (checkMarketLock()) return
    toggleItem(key, category)
  }

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Pre-session completion
  const preChecked = PRE_SESSION_ITEMS.filter(i => items[i.key]).length
  const preComplete = preChecked === PRE_SESSION_ITEMS.length
  const preGroups = useMemo(() => getGroupedItems(PRE_SESSION_ITEMS), [])

  // London
  const ldnLiqChecked = LONDON_LIQ_ITEMS.filter(i => items[i.key]).length
  const ldnLiqComplete = ldnLiqChecked === LONDON_LIQ_ITEMS.length
  const ldnEntryChecked = LONDON_ENTRY_ITEMS.filter(i => items[i.key]).length
  const ldnEntryComplete = ldnEntryChecked === LONDON_ENTRY_ITEMS.length
  const ldnLiqGroups = useMemo(() => getGroupedItems(LONDON_LIQ_ITEMS), [])
  const ldnEntryGroups = useMemo(() => getGroupedItems(LONDON_ENTRY_ITEMS), [])

  const londonStatus = getSessionStatus(LONDON_WINDOW, now, preComplete)
  const londonResolved = !!tradeDay?.london_result

  // NY
  const nyLiqChecked = NY_LIQ_ITEMS.filter(i => items[i.key]).length
  const nyLiqComplete = nyLiqChecked === NY_LIQ_ITEMS.length
  const nyEntryChecked = NY_ENTRY_ITEMS.filter(i => items[i.key]).length
  const nyEntryComplete = nyEntryChecked === NY_ENTRY_ITEMS.length
  const nyLiqGroups = useMemo(() => getGroupedItems(NY_LIQ_ITEMS), [])
  const nyEntryGroups = useMemo(() => getGroupedItems(NY_ENTRY_ITEMS), [])

  const nyPrereq = londonResolved
  const nyStatus = getSessionStatus(NY_WINDOW, now, nyPrereq)
  const nyResolved = !!tradeDay?.ny_result

  // Summary
  const summaryUnlocked = isSummaryUnlocked(now, londonResolved, nyResolved)
  const summaryGroups = useMemo(() => getGroupedItems(SUMMARY_ITEMS), [])
  const summaryChecked = SUMMARY_ITEMS.filter(i => items[i.key]).length

  // Auto-set pre_session_done when all checked
  useEffect(() => {
    if (preComplete && tradeDay && !tradeDay.pre_session_done) {
      guardedUpdateTradeDay({ pre_session_done: true })
    }
  }, [preComplete, tradeDay, updateTradeDay])

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

  const londonLockReason = !isMarketOpen(now)
    ? 'Market is currently closed'
    : !preComplete
      ? 'Complete Pre-Session Analysis first'
      : londonStatus === 'countdown'
        ? `London session opens at ${formatTime(LONDON_WINDOW.startHour, LONDON_WINDOW.startMinute)} London`
        : undefined

  const nyLockReason = !isMarketOpen(now)
    ? 'Market is currently closed'
    : !londonResolved
      ? 'Resolve London session first'
      : nyStatus === 'countdown'
        ? `NY session opens at ${formatTime(NY_WINDOW.startHour, NY_WINDOW.startMinute)} London`
        : undefined

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        <MarketClosedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        {/* SECTION 1 — PRE-SESSION */}
        <ChecklistSection
          title="PRE_SESSION_ANALYSIS"
          subtitle="S.C.A.L.P. Framework"
          status={preComplete ? 'complete' : 'unlocked'}
        >
          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[#555] uppercase tracking-widest">Pair</label>
              <select
                value={tradeDay?.pair ?? ''}
                onChange={(e) => guardedUpdateTradeDay({ pair: (e.target.value || null) as TradePair | null })}
              >
                <option value="">Select...</option>
                <option value="GBPUSD">GBPUSD</option>
                <option value="EURUSD">EURUSD</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[#555] uppercase tracking-widest">Bias</label>
              <select
                value={tradeDay?.bias ?? ''}
                onChange={(e) => guardedUpdateTradeDay({ bias: (e.target.value || null) as Bias | null })}
              >
                <option value="">Select...</option>
                <option value="Bullish">Bullish</option>
                <option value="Bearish">Bearish</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[#555] uppercase tracking-widest">Zone</label>
              <select
                value={tradeDay?.zone ?? ''}
                onChange={(e) => guardedUpdateTradeDay({ zone: (e.target.value || null) as Zone | null })}
              >
                <option value="">Select...</option>
                <option value="Premium">Premium</option>
                <option value="Discount">Discount</option>
              </select>
            </div>
          </div>

          {/* Checklist Groups */}
          <div className="flex flex-col gap-4">
            {Object.entries(preGroups).map(([group, groupItems]) => (
              <ChecklistGroup
                key={group}
                groupName={group}
                items={groupItems}
                checkedItems={items}
                onToggle={(key) => guardedToggleItem(key, 'pre')}
              />
            ))}
          </div>

          {/* Progress */}
          <div className="mt-6">
            <ProgressBar current={preChecked} total={PRE_SESSION_ITEMS.length} />
          </div>

          {/* Warning */}
          {!preComplete && (
            <div className="mt-4 flex items-center gap-2 text-[#ffaa00] text-[12px] px-3 py-2 bg-[#ffaa00]/5 border border-[#ffaa00]/20 rounded-sm">
              <AlertTriangle size={14} />
              <span>DO NOT proceed until this section is 100% complete</span>
            </div>
          )}
        </ChecklistSection>

        <ChecklistSection
          title="LONDON_SESSION"
          subtitle={`${formatTime(LONDON_WINDOW.startHour, LONDON_WINDOW.startMinute)} – ${formatTime(LONDON_WINDOW.endHour, LONDON_WINDOW.endMinute)} London (${getKolkataTime(LONDON_WINDOW.startHour, LONDON_WINDOW.startMinute)} – ${getKolkataTime(LONDON_WINDOW.endHour, LONDON_WINDOW.endMinute)} Kolkata)`}
          status={
            !preComplete ? 'locked' :
            londonResolved ? 'complete' :
            londonStatus
          }
          lockReason={londonLockReason}
        >
          <SessionStatus session="london" prerequisiteMet={preComplete} />

          {/* Liquidity sub-section */}
          <div className="mt-6 flex flex-col gap-4">
            {Object.entries(ldnLiqGroups).map(([group, groupItems]) => (
              <ChecklistGroup
                key={group}
                groupName={group}
                items={groupItems}
                checkedItems={items}
                onToggle={(key) => guardedToggleItem(key, 'london_liq')}
              />
            ))}
            <ProgressBar
              label="Liquidity Confirmation"
              current={ldnLiqChecked}
              total={LONDON_LIQ_ITEMS.length}
            />
          </div>

          {/* Entry sub-section — locked until liq complete */}
          <hr className="section-divider" />
          <div className={!ldnLiqComplete ? 'locked' : ''}>
            <div className="flex flex-col gap-4">
              {Object.entries(ldnEntryGroups).map(([group, groupItems]) => (
                <ChecklistGroup
                  key={group}
                  groupName={group}
                  items={groupItems}
                  checkedItems={items}
                  onToggle={(key) => guardedToggleItem(key, 'london_entry')}
                />
              ))}
              <ProgressBar
                label="Entry Protocol"
                current={ldnEntryChecked}
                total={LONDON_ENTRY_ITEMS.length}
              />
            </div>
          </div>

          {/* Outcome Form — after entry complete */}
          {ldnEntryComplete && !londonResolved && (
            <>
              <hr className="section-divider" />
              <OutcomeForm
                session="london"
                initialResult={tradeDay?.london_result}
                initialPips={tradeDay?.london_pips}
                initialNotes={tradeDay?.london_notes}
                onSave={(result: SessionResult, pips: number | null, notes: string) => {
                  guardedUpdateTradeDay({
                    london_result: result,
                    london_pips: pips,
                    london_notes: notes,
                    london_trade_taken: result !== 'No Setup' && result !== 'Skipped',
                  })
                }}
              />
            </>
          )}
        </ChecklistSection>

        {/* SECTION 3 — NY */}
        <ChecklistSection
          title="NY_SESSION"
          subtitle={`${formatTime(NY_WINDOW.startHour, NY_WINDOW.startMinute)} – ${formatTime(NY_WINDOW.endHour, NY_WINDOW.endMinute)} London (${getKolkataTime(NY_WINDOW.startHour, NY_WINDOW.startMinute)} – ${getKolkataTime(NY_WINDOW.endHour, NY_WINDOW.endMinute)} Kolkata)`}
          status={
            !nyPrereq ? 'locked' :
            nyResolved ? 'complete' :
            nyStatus
          }
          lockReason={nyLockReason}
        >
          <SessionStatus session="ny" prerequisiteMet={nyPrereq} />

          {/* Liquidity */}
          <div className="mt-6 flex flex-col gap-4">
            {Object.entries(nyLiqGroups).map(([group, groupItems]) => (
              <ChecklistGroup
                key={group}
                groupName={group}
                items={groupItems}
                checkedItems={items}
                onToggle={(key) => guardedToggleItem(key, 'ny_liq')}
              />
            ))}
            <ProgressBar
              label="Liquidity Confirmation"
              current={nyLiqChecked}
              total={NY_LIQ_ITEMS.length}
            />
          </div>

          {/* Entry */}
          <hr className="section-divider" />
          <div className={!nyLiqComplete ? 'locked' : ''}>
            <div className="flex flex-col gap-4">
              {Object.entries(nyEntryGroups).map(([group, groupItems]) => (
                <ChecklistGroup
                  key={group}
                  groupName={group}
                  items={groupItems}
                  checkedItems={items}
                  onToggle={(key) => guardedToggleItem(key, 'ny_entry')}
                />
              ))}
              <ProgressBar
                label="Entry Protocol"
                current={nyEntryChecked}
                total={NY_ENTRY_ITEMS.length}
              />
            </div>
          </div>

          {/* Outcome */}
          {nyEntryComplete && !nyResolved && (
            <>
              <hr className="section-divider" />
              <OutcomeForm
                session="ny"
                initialResult={tradeDay?.ny_result}
                initialPips={tradeDay?.ny_pips}
                initialNotes={tradeDay?.ny_notes}
                onSave={(result: SessionResult, pips: number | null, notes: string) => {
                  guardedUpdateTradeDay({
                    ny_result: result,
                    ny_pips: pips,
                    ny_notes: notes,
                    ny_trade_taken: result !== 'No Setup' && result !== 'Skipped',
                  })
                }}
              />
            </>
          )}
        </ChecklistSection>

        {/* SECTION 4 — DAY SUMMARY */}
        <ChecklistSection
          title="DAY_SUMMARY"
          subtitle="Discipline Review"
          status={summaryUnlocked ? 'unlocked' : 'locked'}
          lockReason={!summaryUnlocked ? 'Complete both sessions or wait until 3:00 PM London' : undefined}
        >
          <div className="flex flex-col gap-4">
            {Object.entries(summaryGroups).map(([group, groupItems]) => (
              <ChecklistGroup
                key={group}
                groupName={group}
                items={groupItems}
                checkedItems={items}
                onToggle={(key) => guardedToggleItem(key, 'summary')}
              />
            ))}
            <ProgressBar current={summaryChecked} total={SUMMARY_ITEMS.length} />
          </div>

          <hr className="section-divider" />

          {/* Day Notes */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-[#555] uppercase tracking-widest">
              End-of-Day Reflection
            </label>
            <textarea
              value={tradeDay?.day_summary_notes ?? ''}
              onChange={(e) => guardedUpdateTradeDay({ day_summary_notes: e.target.value })}
              placeholder="What did you learn today? What will you do differently tomorrow?"
              rows={4}
              disabled={!summaryUnlocked}
            />
          </div>

          <hr className="section-divider" />

          {/* Core Screenshots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ImageUploader 
              label="Before Trade (HTF / Setup)" 
              value={tradeDay?.screenshot_url_before} 
              onChange={(url) => guardedUpdateTradeDay({ screenshot_url_before: url })}
              disabled={!summaryUnlocked}
              dateString={today}
              uid={user.uid}
            />
            <ImageUploader 
              label="After Trade (Execution / Result)" 
              value={tradeDay?.screenshot_url_after} 
              onChange={(url) => guardedUpdateTradeDay({ screenshot_url_after: url })}
              disabled={!summaryUnlocked}
              dateString={today}
              uid={user.uid}
            />
          </div>
        </ChecklistSection>
      </main>
    </>
  )
}
