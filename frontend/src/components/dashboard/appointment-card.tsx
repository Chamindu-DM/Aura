'use client'

import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'

interface AppointmentCardProps {
  time: string
  customerName: string
  customerType: 'Member' | 'Non-Member'
  serviceName: string
  duration: string
  serviceCount: string
  genderType: string
}

export function AppointmentCard({
  time,
  customerName,
  customerType,
  serviceName,
  duration,
  serviceCount,
  genderType
}: AppointmentCardProps) {
  return (
    <div className="bg-[#f6f6f6] rounded-xl border border-black/[0.04] overflow-hidden">
      <div className="flex gap-10 items-center pl-0 pr-4 py-0">
        {/* Time Section */}
        <div className="flex-1 flex items-center gap-2">
          <div className="bg-[rgba(255,255,255,0.5)] flex flex-col gap-3 h-full items-start justify-center p-4">
            <div className="flex gap-2 items-center">
              <Clock className="h-4 w-4" />
              <div className="font-['Inter_Tight'] font-medium text-black text-[15px] leading-[22px]">
                {time}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex-1 flex flex-col gap-1 px-4 py-2">
          <div className="font-['Inter_Tight'] font-semibold text-black text-[20px] leading-[24px]">
            {customerName}
          </div>
          <div className="font-['Inter_Tight'] font-medium text-[#a7a6a7] text-[13px] leading-[16px] tracking-[-0.08px]">
            {customerType}
          </div>
        </div>

        {/* Service Info */}
        <div className="flex-1 flex flex-col gap-1 p-4">
          <div className="font-['Inter_Tight'] font-medium text-black text-[17px] leading-[22px]">
            {serviceName}
          </div>
          <div className="flex flex-wrap gap-1 items-center">
            <span className="font-['Inter_Tight'] text-[rgba(60,60,67,0.6)] text-[15px] leading-[20px] tracking-[-0.23px]">
              {duration}
            </span>
            <div className="w-0.5 h-0.5 bg-[rgba(60,60,67,0.6)] rounded-full" />
            <span className="font-['Inter_Tight'] text-[rgba(60,60,67,0.6)] text-[15px] leading-[20px] tracking-[-0.23px]">
              {serviceCount}
            </span>
            <div className="w-0.5 h-0.5 bg-[rgba(60,60,67,0.6)] rounded-full" />
            <span className="font-['Inter_Tight'] text-[rgba(60,60,67,0.6)] text-[15px] leading-[20px] tracking-[-0.23px]">
              {genderType}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-1 flex gap-2 h-full items-center justify-center max-w-[260px]">
          <Button 
            variant="outline" 
            className="flex-1 bg-white border-[rgba(60,60,67,0.09)] font-['Inter_Tight'] font-medium text-black text-[15px] leading-[22px]"
          >
            Cancel
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 bg-white border-[rgba(60,60,67,0.09)] font-['Inter_Tight'] font-medium text-black text-[15px] leading-[22px]"
          >
            Change Date
          </Button>
        </div>
      </div>
    </div>
  )
}
