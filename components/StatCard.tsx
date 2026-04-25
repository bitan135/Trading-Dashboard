'use client'

import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  color?: 'green' | 'red' | 'amber' | 'cyan' | 'muted'
  suffix?: string
}

const COLOR_MAP = {
  green: 'text-[#00ff88]',
  red: 'text-[#ff4444]',
  amber: 'text-[#ffaa00]',
  cyan: 'text-[#00d4ff]',
  muted: 'text-[#888]',
}

export default function StatCard({ label, value, color = 'green', suffix }: StatCardProps) {
  return (
    <div className="panel p-5 flex flex-col gap-2 animate-glow">
      <span className="text-[10px] text-[#555] uppercase tracking-widest">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className={cn('text-3xl font-bold tracking-tight', COLOR_MAP[color])}>
          {value}
        </span>
        {suffix && (
          <span className="text-[12px] text-[#555]">{suffix}</span>
        )}
      </div>
    </div>
  )
}
