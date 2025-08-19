'use client'

import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  change: string
  icon?: React.ReactNode
}

export function StatsCard({ title, value, change }: StatsCardProps) {
  return (
    <div className="bg-[#f2f2f7] rounded-xl border border-black/[0.04] p-7 flex-1">
      <div className="flex items-center justify-between mb-[18px]">
        <h3 className="font-['Inter_Tight'] font-bold text-black text-[17px] leading-normal">
          {title}
        </h3>
        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <div className="font-['Inter_Tight'] font-bold text-black text-[34px] leading-normal">
          {value}
        </div>
        <div className="font-['Inter_Tight'] font-medium text-[rgba(60,60,67,0.6)] text-[12px] tracking-[0.24px] leading-normal">
          {change}
        </div>
      </div>
    </div>
  )
}
