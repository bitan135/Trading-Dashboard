'use client'

import { useState, useEffect } from 'react'
import { User, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { getAuthInstance, getGoogleProvider } from '@/lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuthInstance()
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const signIn = async () => {
    try {
      await signInWithPopup(getAuthInstance(), getGoogleProvider())
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(getAuthInstance())
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return { user, loading, signIn, signOut }
}
