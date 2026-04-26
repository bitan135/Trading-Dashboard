'use client'

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { useAuthContext } from '@/components/AuthProvider'
import { TradeDay, DEFAULT_TRADE_DAY } from '@/types'

export function useJournal(maxDays: number = 60) {
  const { user } = useAuthContext()
  const [days, setDays] = useState<TradeDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      Promise.resolve().then(() => setLoading(false))
      return
    }

    let unsub: (() => void) | undefined

    const init = async () => {
      const { getDb } = await import('@/lib/firebase')
      const colRef = collection(getDb(), 'users', user.uid, 'trade_days')
      const q = query(colRef, orderBy('date', 'desc'), limit(maxDays))

      unsub = onSnapshot(q, (snap) => {
        const data: TradeDay[] = []
        snap.forEach((doc) => {
          data.push({ ...DEFAULT_TRADE_DAY, ...doc.data() } as TradeDay)
        })
        setDays(data)
        setLoading(false)
      }, (error) => {
        console.error('Journal snapshot error:', error)
        setLoading(false)
      })
    }

    init()

    return () => { if (unsub) unsub() }
  }, [user, maxDays])

  return { days, loading }
}
