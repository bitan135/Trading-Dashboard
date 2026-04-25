'use client'

import { useState, useEffect } from 'react'
import { User } from 'firebase/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Dynamic import to avoid SSR issues
    const init = async () => {
      try {
        const { getAuthInstance } = await import('@/lib/firebase')
        const { onAuthStateChanged } = await import('firebase/auth')
        const auth = getAuthInstance()
        const unsub = onAuthStateChanged(auth, (user) => {
          setUser(user)
          setLoading(false)
        })
        return unsub
      } catch (error) {
        console.error('Auth init error:', error)
        setLoading(false)
      }
    }

    let unsub: (() => void) | undefined
    init().then((u) => { unsub = u })

    return () => { if (unsub) unsub() }
  }, [])

  const signIn = async () => {
    try {
      const { getAuthInstance, getGoogleProvider } = await import('@/lib/firebase')
      const { signInWithPopup } = await import('firebase/auth')
      await signInWithPopup(getAuthInstance(), getGoogleProvider())
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  const signOut = async () => {
    try {
      const { getAuthInstance } = await import('@/lib/firebase')
      const { signOut: firebaseSignOut } = await import('firebase/auth')
      await firebaseSignOut(getAuthInstance())
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return { user, loading, signIn, signOut }
}
