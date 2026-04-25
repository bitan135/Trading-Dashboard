'use client'

import { ChecklistItemConfig } from '@/types'
import ChecklistItem from './ChecklistItem'

interface ChecklistGroupProps {
  groupName: string
  items: ChecklistItemConfig[]
  checkedItems: Record<string, boolean>
  onToggle: (key: string) => void
  disabled?: boolean
}

export default function ChecklistGroup({ groupName, items, checkedItems, onToggle, disabled }: ChecklistGroupProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[11px] text-[#555] uppercase tracking-widest px-3 py-2 border-b border-[rgba(0,255,136,0.06)]">
        <span className="text-[#00ff88] opacity-40">// </span>
        {groupName}
      </div>
      <div className="flex flex-col">
        {items.map((item) => (
          <ChecklistItem
            key={item.key}
            item={item}
            checked={!!checkedItems[item.key]}
            onToggle={() => onToggle(item.key)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  )
}
