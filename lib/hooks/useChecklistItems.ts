'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { collection, doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore'
import { getDb } from '@/lib/firebase'
import { useAuthContext } from '@/components/AuthProvider'
import { ChecklistSection } from '@/types'

export function useChecklistItems(dateString: string) {
  const { user } = useAuthContext()
  const [items, setItems] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({})

  useEffect(() => {
    if (!user || !dateString) {
      setLoading(false)
      return
    }

    const colRef = collection(getDb(), 'users', user.uid, 'trade_days', dateString, 'checklist_items')
    const unsub = onSnapshot(colRef, (snap) => {
      const data: Record<string, boolean> = {}
      snap.forEach((doc) => {
        const docData = doc.data()
        data[doc.id] = docData.checked ?? false
      })
      setItems(data)
      setLoading(false)
    }, (error) => {
      console.error('Checklist snapshot error:', error)
      setLoading(false)
    })

    return () => {
      unsub()
      // Clear all pending debounce timers
      Object.values(debounceTimers.current).forEach(clearTimeout)
    }
  }, [user, dateString])

  const toggleItem = useCallback((itemKey: string, section: ChecklistSection) => {
    if (!user) return

    const newValue = !items[itemKey]

    // Optimistic update
    setItems(prev => ({ ...prev, [itemKey]: newValue }))

    // Clear existing debounce for this key
    if (debounceTimers.current[itemKey]) {
      clearTimeout(debounceTimers.current[itemKey])
    }

    // Debounced Firestore write
    debounceTimers.current[itemKey] = setTimeout(async () => {
      try {
        const docRef = doc(getDb(), 'users', user.uid, 'trade_days', dateString, 'checklist_items', itemKey)
        await setDoc(docRef, {
          section,
          checked: newValue,
          updated_at: serverTimestamp(),
        }, { merge: true })
      } catch (error) {
        console.error('Error toggling checklist item:', error)
        // Revert optimistic update on error
        setItems(prev => ({ ...prev, [itemKey]: !newValue }))
      }
    }, 200)
  }, [user, dateString, items])

  return { items, toggleItem, loading }
}
