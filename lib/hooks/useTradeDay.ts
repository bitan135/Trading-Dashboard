'use client'

import { useState, useEffect, useCallback } from 'react'
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore'
import { useAuthContext } from '@/components/AuthProvider'
import { TradeDay, DEFAULT_TRADE_DAY } from '@/types'
import { getTodayDate, getWeekNumber } from '@/lib/utils'

export function useTradeDay(dateString?: string) {
  const { user } = useAuthContext()
  const date = dateString || getTodayDate()
  const [tradeDay, setTradeDay] = useState<TradeDay | null>(null)
  const [optimisticTradeDay, setOptimisticTradeDay] = useState<TradeDay | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      // Use microtask to avoid synchronous state update in effect
      Promise.resolve().then(() => setLoading(false))
      return
    }

    let unsub: (() => void) | undefined

    const init = async () => {
      const { getDb } = await import('@/lib/firebase')
      const docRef = doc(getDb(), 'users', user.uid, 'trade_days', date)

      try {
        await setDoc(docRef, {
          ...DEFAULT_TRADE_DAY,
          date,
          week_number: getWeekNumber(date),
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        }, { merge: true })
      } catch (error) {
        console.error('Error initializing trade day:', error)
      }

      unsub = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const data = { ...DEFAULT_TRADE_DAY, ...snap.data() } as TradeDay
          setTradeDay(data)
          setOptimisticTradeDay(data)
        }
        setLoading(false)
      }, (err) => {
        console.error('TradeDay snapshot error:', err)
        setLoading(false)
      })
    }

    init()

    return () => { if (unsub) unsub() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, date])

  const updateTradeDay = useCallback(async (fields: Partial<TradeDay>) => {
    if (!user) return
    
    // Optimistic Update
    setOptimisticTradeDay(prev => prev ? { ...prev, ...fields } : null)
    
    const { getDb } = await import('@/lib/firebase')
    const docRef = doc(getDb(), 'users', user.uid, 'trade_days', date)
    try {
      await setDoc(docRef, {
        ...fields,
        updated_at: serverTimestamp(),
      }, { merge: true })
    } catch (error) {
      console.error('Error updating trade day:', error)
      // Rollback on error - use the last stable state from the parent scope
      setOptimisticTradeDay(tradeDay)
    }
  }, [user, date, tradeDay])

  return { tradeDay: optimisticTradeDay, loading, updateTradeDay }
}
