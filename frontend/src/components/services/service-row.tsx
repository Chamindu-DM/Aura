"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ArrowsOutSimple } from 'phosphor-react'
import { ServiceFormModal } from './service-form-modal'

export type Service = {
    _id: string
    serviceName: string  // Changed to match backend
    description: string
    duration: string
    price: string
    available: boolean
    multipleOptions?: boolean
    options?: any[]
}

export type ServiceRowProps = {
    service: Service
    onToggleAction: (id: string, checked: boolean) => void
    onUpdateAction: (data: any, serviceId: string) => void  // Changed from onSaveAction to onUpdateAction
}

export default function ServiceRow({ service, onToggleAction, onUpdateAction }: ServiceRowProps) {
    const textColorClass = service.available ? 'text-[#212121]' : 'text-gray-400';

    // Helper function to get display values
    const getDisplayValue = (value: string | undefined | null) => {
        return value && value.trim() ? value : 'Not specified'
    }

    return (
        <div className="flex w-full border-b border-[rgba(0,0,0,0.1)] py-4 items-center font-['Inter_Tight']">
            {/* Service Name - Fixed field name */}
            <div className={`flex-1 max-w-[248px] truncate ${textColorClass}`}>
                {getDisplayValue(service.serviceName)}
            </div>

            {/* Description */}
            <div className={`flex-1 truncate pr-8 ${textColorClass}`}>
                {getDisplayValue(service.description)}
            </div>

            {/* Duration */}
            <div className={`flex-shrink-0 w-[120px] ${textColorClass}`}>
                {getDisplayValue(service.duration)}
            </div>

            {/* Price */}
            <div className={`flex-shrink-0 w-[120px] ${textColorClass}`}>
                {getDisplayValue(service.price)}
            </div>

            {/* Available Switch */}
            <div className="flex-shrink-0 w-20">
                <Switch
                    checked={service.available}
                    onCheckedChange={(checked) => onToggleAction(service._id, checked)}
                />
            </div>

            {/* Edit Button */}
            <div className="flex-shrink-0 w-10 flex justify-center">
                <ServiceFormModal
                    trigger={
                        <Button variant="ghost" size="icon">
                            <ArrowsOutSimple size={24} className="text-[#212121]" />
                        </Button>
                    }
                    onSave={(data) => onUpdateAction(data, service._id)}  // Pass service ID for updates
                    existingService={service}  // Pass existing service data
                    isEdit={true}  // Mark as edit mode
                />
            </div>
        </div>
    )
}