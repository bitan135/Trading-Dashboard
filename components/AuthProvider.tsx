'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { User } from 'firebase/auth'

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!mounted) setMounted(true)

    let unsub: (() => void) | undefined

    const init = async () => {
      try {
        const { getAuthInstance } = await import('@/lib/firebase')
        const { onAuthStateChanged, getRedirectResult } = await import('firebase/auth')
        const auth = getAuthInstance()

        // Check for redirect result (from signInWithRedirect)
        try {
          await getRedirectResult(auth)
        } catch (e) {
          // Redirect result errors are non-fatal
          console.warn('Redirect result check:', e)
        }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signIn = useCallback(async () => {
    try {
      const { getAuthInstance, getGoogleProvider } = await import('@/lib/firebase')
      const { signInWithPopup, signInWithRedirect, browserPopupRedirectResolver } = await import('firebase/auth')
      const auth = getAuthInstance()
      const provider = getGoogleProvider()

      try {
        // Try popup first
        await signInWithPopup(auth, provider, browserPopupRedirectResolver)
      } catch (popupError: unknown) {
        const errorCode = (popupError as { code?: string })?.code
        console.warn('Popup sign-in failed, trying redirect:', errorCode)

        // If popup blocked or failed, fall back to redirect
        if (
          errorCode === 'auth/popup-blocked' ||
          errorCode === 'auth/popup-closed-by-user' ||
          errorCode === 'auth/cancelled-popup-request' ||
          errorCode === 'auth/internal-error'
        ) {
          await signInWithRedirect(auth, provider)
        } else {
          throw popupError
        }
      }
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }, [])

  const signOutFn = useCallback(async () => {
    try {
      const { getAuthInstance } = await import('@/lib/firebase')
      const { signOut: firebaseSignOut } = await import('firebase/auth')
      await firebaseSignOut(getAuthInstance())
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }, [])

  // During SSR or before mount, show loading spinner
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut: signOutFn }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
