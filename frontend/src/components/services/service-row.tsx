"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ArrowsOutSimple } from 'phosphor-react'
import { ServiceFormModal } from './service-form-modal'

export type Service = {
  id: string
  name: string
  description: string
  duration: string
  price: string
  available: boolean
}

export type ServiceRowProps = {
  service: Service
  onToggle: (id: string, checked: boolean) => void
  onSave: (data: any) => void
}

export default function ServiceRow({ service, onToggle, onSave }: ServiceRowProps) {
    const textColorClass = service.available ? 'text-[#212121]' : 'text-gray-400';
    
    return (
        <div className="flex w-full border-b border-[rgba(0,0,0,0.1)] py-4 items-center font-['Inter_Tight']">
            <div className={`flex-1 max-w-[248px] truncate ${textColorClass}`}>{service.name}</div>
            <div className={`flex-1 truncate pr-8 ${textColorClass}`}>{service.description}</div>
            <div className={`flex-shrink-0 w-[120px] ${textColorClass}`}>{service.duration}</div>
            <div className={`flex-shrink-0 w-[120px] ${textColorClass}`}>{service.price}</div>
            
            <div className="flex-shrink-0 w-20">
                <Switch
                    checked={service.available}
                    onCheckedChange={(checked) => onToggle(service.id, checked)}
                />
            </div>
            <div className="flex-shrink-0 w-10 flex justify-center">
                <ServiceFormModal
                    trigger={
                        <Button variant="ghost" size="icon">
                            <ArrowsOutSimple size={24} className="text-[#212121]" />
                        </Button>
                    }
                    onSave={onSave}
                />
            </div>
        </div>
    )
}
