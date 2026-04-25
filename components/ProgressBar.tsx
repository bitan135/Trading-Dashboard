'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  total: number
  label?: string
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0
  const filled = total > 0 ? Math.round((current / total) * 20) : 0
  const empty = 20 - filled

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-[11px] text-[#888] uppercase tracking-widest">{label}</span>
      )}
      <div className="flex items-center gap-3">
        <div className="progress-track flex-1">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        <span className="text-[12px] text-[#888] font-mono whitespace-nowrap min-w-[80px] text-right">
          <span className="text-[#00ff88]">{current}</span>
          <span className="text-[#555]">/{total}</span>
          <span className="text-[#555] ml-2">({percent}%)</span>
        </span>
      </div>
      <div className="text-[11px] font-mono text-[#555] hidden sm:block">
        [<span className="text-[#00ff88]">{'█'.repeat(filled)}</span>
        <span className="text-[#333]">{'░'.repeat(empty)}</span>]
      </div>
    </div>
  )
}
