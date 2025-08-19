'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface TabItem {
  label: string
  count: number
  active?: boolean
}

interface AppointmentTabsProps {
  tabs: TabItem[]
  onTabChange?: (index: number) => void
}

export function AppointmentTabs({ tabs, onTabChange }: AppointmentTabsProps) {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabClick = (index: number) => {
    setActiveTab(index)
    onTabChange?.(index)
  }

  return (
    <div className="border-b border-[rgba(92,92,92,0.2)] pb-0">
      <div className="flex gap-10 items-center">
        {tabs.map((tab, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`flex gap-4 items-center px-2 py-4 relative ${
              activeTab === index 
                ? 'border-b border-black text-black' 
                : 'text-[rgba(33,33,33,0.62)]'
            }`}
            onClick={() => handleTabClick(index)}
          >
            <span className="font-['Inter_Tight'] font-medium text-[15px] leading-[22px]">
              {tab.label}
            </span>
            <Badge className="bg-black text-white rounded-lg px-2 py-1">
              <span className="font-['Inter'] font-semibold text-[12px] leading-normal tracking-[-0.048px]">
                {tab.count}
              </span>
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  )
}
