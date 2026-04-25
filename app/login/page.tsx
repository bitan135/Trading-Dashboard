'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/AuthProvider'
import { Terminal } from 'lucide-react'

export default function LoginPage() {
  const { user, loading, signIn } = useAuthContext()
  const router = useRouter()
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleSignIn = async () => {
    setSigningIn(true)
    setError('')
    try {
      await signIn()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed'
      setError(message)
    } finally {
      setSigningIn(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (user) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="flex flex-col items-center gap-8 animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border border-[#00ff88]/30 rounded-sm flex items-center justify-center bg-[#0f0f0f]">
            <Terminal size={28} className="text-[#00ff88]" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-[#00ff88] text-2xl font-bold tracking-[6px] uppercase">
              S.C.A.L.P.
            </h1>
            <p className="text-[#555] text-[11px] tracking-[3px] uppercase">
              Trading Journal System
            </p>
          </div>
        </div>

        {/* Terminal prompt */}
        <div className="panel p-6 w-full max-w-sm flex flex-col gap-4">
          <div className="text-[12px] text-[#888]">
            <span className="text-[#00ff88]">system</span>
            <span className="text-[#555]">@</span>
            <span className="text-[#00d4ff]">scalp</span>
            <span className="text-[#555]">:~$ </span>
            <span className="text-[#e0e0e0]">authenticate</span>
            <span className="animate-blink text-[#00ff88]">_</span>
          </div>

          <button
            onClick={handleSignIn}
            disabled={signingIn}
            className="btn-primary w-full flex items-center justify-center gap-3 py-3 disabled:opacity-50"
          >
            {signingIn ? (
              <>
                <div className="loading-spinner w-4 h-4" />
                Authenticating...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                SIGN IN WITH GOOGLE
              </>
            )}
          </button>

          {error && (
            <p className="text-[11px] text-[#ff4444] text-center">
              ⚠ {error}
            </p>
          )}

          <p className="text-[10px] text-[#555] text-center tracking-wider">
            Authenticated sessions are encrypted and scoped to your UID
          </p>
        </div>

        {/* Credit */}
        <p className="text-[10px] text-[#333] tracking-widest uppercase">
          WWA Trading Framework v1.0
        </p>
      </div>
    </div>
  )
}
