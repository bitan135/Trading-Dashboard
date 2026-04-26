'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChecklistItemConfig } from '@/types'
import { cn } from '@/lib/utils'

interface ChecklistItemProps {
  item: ChecklistItemConfig
  checked: boolean
  onToggle: () => void
  disabled?: boolean
}

export default function ChecklistItem({ item, checked, onToggle, disabled }: ChecklistItemProps) {
  const [justToggled, setJustToggled] = useState(false)

  const handleToggle = () => {
    if (disabled) return
    onToggle()
    if (!checked) {
      setJustToggled(true)
      setTimeout(() => setJustToggled(false), 400)
    }
  }

  return (
    <motion.div
      className={cn(
        'terminal-checkbox',
        checked && 'checked',
        justToggled && 'animate-flash-green',
        disabled && 'opacity-40 cursor-not-allowed'
      )}
      onClick={handleToggle}
      whileTap={!disabled ? { scale: 0.99 } : undefined}
    >
      <span className="check-box">
        {checked ? '[✓]' : '[ ]'}
      </span>
      <div className="flex flex-col gap-1">
        <span className="check-label">{item.label}</span>
        {item.warning && (
          <span className="text-[11px] text-[#ff4444] leading-tight opacity-80">
            {item.warning}
          </span>
        )}
      </div>
    </motion.div>
  )
}
