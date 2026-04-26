'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { collection, doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore'
import { useAuthContext } from '@/components/AuthProvider'
import { ChecklistSection } from '@/types'

export function useChecklistItems(dateString: string) {
  const { user } = useAuthContext()
  const [items, setItems] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({})

  useEffect(() => {
    if (!user || !dateString) {
      Promise.resolve().then(() => setLoading(false))
      return
    }

    let unsub: (() => void) | undefined

    const init = async () => {
      const { getDb } = await import('@/lib/firebase')
      const colRef = collection(getDb(), 'users', user.uid, 'trade_days', dateString, 'checklist_items')
      unsub = onSnapshot(colRef, (snap) => {
        const data: Record<string, boolean> = {}
        snap.forEach((doc) => {
          const docData = doc.data()
          data[doc.id] = docData.checked ?? false
        })
        setItems(data)
        setLoading(false)
      }, (err) => {
        console.error('Checklist snapshot error:', err)
        setError(err.message)
        setLoading(false)
      })
    }

    init()

    return () => {
      if (unsub) unsub()
      Object.values(debounceTimers.current).forEach(clearTimeout)
    }
  }, [user, dateString])

  const toggleItem = useCallback((itemKey: string, section: ChecklistSection) => {
    if (!user) return

    setItems(prev => {
      const currentValue = prev[itemKey] ?? false
      const newValue = !currentValue

      // Clear existing debounce for this key
      if (debounceTimers.current[itemKey]) {
        clearTimeout(debounceTimers.current[itemKey])
      }

      // Debounced Firestore write
      debounceTimers.current[itemKey] = setTimeout(async () => {
        try {
          const { getDb } = await import('@/lib/firebase')
          const docRef = doc(getDb(), 'users', user.uid, 'trade_days', dateString, 'checklist_items', itemKey)
          await setDoc(docRef, {
            section,
            checked: newValue,
            updated_at: serverTimestamp(),
          }, { merge: true })
        } catch (error) {
          console.error('Error toggling checklist item:', error)
          // Revert on error
          setItems(p => ({ ...p, [itemKey]: currentValue }))
        }
      }, 300)

      return { ...prev, [itemKey]: newValue }
    })
  }, [user, dateString])

  return { items, toggleItem, loading, error }
}
