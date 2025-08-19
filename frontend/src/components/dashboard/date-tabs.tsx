'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DateTabsProps {
  dates: string[]
  activeDate?: number
  onDateChange?: (index: number) => void
}

export function DateTabs({ dates, activeDate = 0, onDateChange }: DateTabsProps) {
  const [currentDate, setCurrentDate] = useState(activeDate)

  const handleDateClick = (index: number) => {
    setCurrentDate(index)
    onDateChange?.(index)
  }

  const handlePrevious = () => {
    // Handle previous navigation
  }

  const handleNext = () => {
    // Handle next navigation
  }

  return (
    <div className="flex gap-4 items-center px-0 py-2">
      <div className="flex-1 flex gap-16 items-center font-['Inter_Tight'] font-bold text-[40px] leading-[48px] tracking-[0.4px]">
        {dates.map((date, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`p-0 h-auto font-['Inter_Tight'] font-bold text-[40px] leading-[48px] tracking-[0.4px] ${
              currentDate === index 
                ? 'text-[#212121]' 
                : 'text-[rgba(33,33,33,0.4)]'
            }`}
            onClick={() => handleDateClick(index)}
          >
            {date}
          </Button>
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="rotate-180 scale-y-[-100%]"
        onClick={handleNext}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
    </div>
  )
}
