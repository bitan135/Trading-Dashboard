'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SessionStatus as StatusType } from '@/types'

interface ChecklistSectionProps {
  title: string
  subtitle?: string
  status: StatusType | 'unlocked' | 'complete'
  lockReason?: string
  children: ReactNode
}

export default function ChecklistSection({ title, subtitle, status, lockReason, children }: ChecklistSectionProps) {
  const isLocked = status === 'locked'

  return (
    <motion.section
      className={cn('panel p-6', isLocked && 'locked')}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isLocked ? 0.4 : 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="terminal-header">
          <span className="prefix">&gt;</span>
          <span>{title}</span>
          {subtitle && (
            <span className="subtitle">{`// ${subtitle}`}</span>
          )}
        </div>
        {isLocked && (
          <div className="flex items-center gap-2 text-[#ff4444]">
            <Lock size={14} />
            <span className="text-[11px] uppercase tracking-wider">Locked</span>
          </div>
        )}
        {status === 'complete' && (
          <div className="flex items-center gap-2 text-[#00ff88] text-[12px] font-semibold uppercase tracking-wider border border-[#00ff88]/30 px-3 py-1 rounded-sm">
            [COMPLETE ✓]
          </div>
        )}
      </div>

      {/* Lock Reason */}
      {isLocked && lockReason && (
        <div className="flex items-center gap-2 text-[#ffaa00] text-[12px] mb-4 px-3 py-2 bg-[#ffaa00]/5 border border-[#ffaa00]/20 rounded-sm">
          <span>⚠</span>
          <span>{lockReason}</span>
        </div>
      )}

      {/* Content */}
      <div>
        {children}
      </div>
    </motion.section>
  )
}
