'use client'

import { useState, useEffect, useCallback } from 'react'
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore'
import { getDb } from '@/lib/firebase'
import { useAuthContext } from '@/components/AuthProvider'
import { TradeDay, DEFAULT_TRADE_DAY } from '@/types'
import { getTodayUTC, getWeekNumber } from '@/lib/utils'

export function useTradeDay(dateString?: string) {
  const { user } = useAuthContext()
  const date = dateString || getTodayUTC()
  const [tradeDay, setTradeDay] = useState<TradeDay | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const docRef = doc(getDb(), 'users', user.uid, 'trade_days', date)

    // Auto-create today's doc if it doesn't exist
    const initDoc = async () => {
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
    }

    initDoc()

    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setTradeDay({ ...DEFAULT_TRADE_DAY, ...snap.data() } as TradeDay)
      }
      setLoading(false)
    }, (error) => {
      console.error('TradeDay snapshot error:', error)
      setLoading(false)
    })

    return () => unsub()
  }, [user, date])

  const updateTradeDay = useCallback(async (fields: Partial<TradeDay>) => {
    if (!user) return
    const docRef = doc(getDb(), 'users', user.uid, 'trade_days', date)
    try {
      await setDoc(docRef, {
        ...fields,
        updated_at: serverTimestamp(),
      }, { merge: true })
    } catch (error) {
      console.error('Error updating trade day:', error)
    }
  }, [user, date])

  return { tradeDay, loading, updateTradeDay }
}
