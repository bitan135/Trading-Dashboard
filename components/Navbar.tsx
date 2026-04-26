'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthContext } from '@/components/AuthProvider'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ListChecks,
  BookOpen,
  BarChart3,
  ScrollText,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/',        label: 'Dashboard', icon: LayoutDashboard },
  { href: '/session', label: 'Session',   icon: ListChecks },
  { href: '/journal', label: 'Journal',   icon: BookOpen },
  { href: '/stats',   label: 'Stats',     icon: BarChart3 },
  { href: '/rules',   label: 'Rules',     icon: ScrollText },
]

export default function Navbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuthContext()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) return null

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[rgba(0,255,136,0.1)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-[#00ff88] font-bold text-sm tracking-widest">S.C.A.L.P.</span>
              <span className="text-[#555] text-[10px] tracking-wider hidden sm:inline">JOURNAL</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-[12px] uppercase tracking-wider transition-colors duration-150 rounded-sm',
                    isActive
                      ? 'text-[#00ff88] bg-[#00ff88]/08'
                      : 'text-[#888] hover:text-[#e0e0e0] hover:bg-[#141414]'
                  )}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt=""
                className="w-7 h-7 rounded-full border border-[rgba(0,255,136,0.2)] hidden sm:block"
              />
            )}
            <button
              onClick={signOut}
              className="flex items-center gap-1 text-[#555] hover:text-[#ff4444] text-[11px] uppercase tracking-wider transition-colors duration-150 hidden sm:flex"
            >
              <LogOut size={12} />
              Exit
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-[#888] hover:text-[#00ff88] transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[rgba(0,255,136,0.08)] py-2 animate-fade-in">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-[12px] uppercase tracking-wider transition-colors duration-150',
                    isActive
                      ? 'text-[#00ff88] bg-[#00ff88]/08'
                      : 'text-[#888] hover:text-[#e0e0e0]'
                  )}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              )
            })}
            <div className="border-t border-[rgba(0,255,136,0.08)] mt-2 pt-2">
              <button
                onClick={() => { signOut(); setMobileOpen(false) }}
                className="flex items-center gap-3 px-4 py-3 text-[12px] text-[#ff4444] uppercase tracking-wider w-full"
              >
                <LogOut size={16} />
                Exit System
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
