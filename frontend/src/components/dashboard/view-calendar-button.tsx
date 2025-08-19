'use client'

import { Button } from '@/components/ui/button'
import { Calendar, ChevronDown } from 'lucide-react'

export function ViewCalendarButton() {
  return (
    <Button 
      variant="outline" 
      className="bg-white border-[rgba(60,60,67,0.09)] gap-2 px-5 py-2 rounded-lg"
    >
      <Calendar className="h-6 w-6" />
      <span className="font-['Inter_Tight'] font-medium text-black text-[15px] leading-[22px]">
        View Calendar
      </span>
      <ChevronDown className="h-6 w-6" />
    </Button>
  )
}
