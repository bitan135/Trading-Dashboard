'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from 'firebase/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    let unsub: (() => void) | undefined

    const init = async () => {
      try {
        const { getAuthInstance } = await import('@/lib/firebase')
        const { onAuthStateChanged } = await import('firebase/auth')
        const auth = getAuthInstance()
        unsub = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser)
          setLoading(false)
        })
      } catch (error) {
        console.error('Auth init error:', error)
        setLoading(false)
      }
    }

    init()

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

  // During SSR or before mount, show nothing (let the body bg show)
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
