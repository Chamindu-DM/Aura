'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Calendar, User, Scissors } from 'lucide-react'
import { ArrowsOutSimple } from 'phosphor-react'

interface Appointment {
    _id: string
    time: string
    date: string
    customerName: string
    customerType: 'Member' | 'Non-Member'
    serviceName: string
    duration: string
    serviceCount: string
    genderType: string
    status: string
    price?: string
    assignedStaff?: {
        _id: string
        firstName: string
        lastName: string
        role: string
    }
}

interface AppointmentRowProps {
    appointment: Appointment
    onEdit: (appointment: Appointment) => void
    onStatusChange: (id: string, status: string) => void
    onDelete: (id: string) => void
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Scheduled':
            return 'bg-blue-100 text-blue-800'
        case 'Confirmed':
            return 'bg-green-100 text-green-800'
        case 'In Progress':
            return 'bg-yellow-100 text-yellow-800'
        case 'Completed':
            return 'bg-emerald-100 text-emerald-800'
        case 'Cancelled':
            return 'bg-red-100 text-red-800'
        case 'No Show':
            return 'bg-gray-100 text-gray-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

const getCustomerTypeColor = (type: string) => {
    return type === 'Member' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
}

export function AppointmentRow({
    appointment,
    onEdit,
    onStatusChange,
    onDelete
}: AppointmentRowProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':')
        const date = new Date()
        date.setHours(parseInt(hours), parseInt(minutes))
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }

    return (
        <div className="flex w-full border-t border-black/10 py-5 items-center hover:bg-gray-50/50 transition-colors">
            {/* Date & Time Column */}
            <div className="flex-1 max-w-40 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-neutral-800 text-sm font-medium font-['Inter_Tight']">
                        {formatDate(appointment.date)}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-neutral-600 text-sm font-['Inter_Tight']">
                        {formatTime(appointment.time)}
                    </span>
                </div>
            </div>

            {/* Customer Info Column */}
            <div className="flex-1 max-w-60 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-neutral-800 text-base font-medium font-['Inter_Tight']">
                        {appointment.customerName}
                    </span>
                </div>
                <div className="flex gap-2">
                    <Badge variant="secondary" className={`text-xs ${getCustomerTypeColor(appointment.customerType)}`}>
                        {appointment.customerType}
                    </Badge>
                    <Badge variant="secondary" className="bg-neutral-100 text-neutral-700 text-xs">
                        {appointment.genderType}
                    </Badge>
                </div>
            </div>

            {/* Service Info Column */}
            <div className="flex-1 max-w-52 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-neutral-800 text-base font-medium font-['Inter_Tight']">
                        {appointment.serviceName}
                    </span>
                </div>
                <div className="flex flex-wrap gap-1 items-center text-sm text-neutral-600">
                    <span className="font-['Inter_Tight']">{appointment.duration}</span>
                    <div className="w-1 h-1 bg-neutral-400 rounded-full" />
                    <span className="font-['Inter_Tight']">{appointment.serviceCount}</span>
                    {appointment.price && (
                        <>
                            <div className="w-1 h-1 bg-neutral-400 rounded-full" />
                            <span className="font-['Inter_Tight']">{appointment.price}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Staff & Status Column */}
            <div className="flex-1 max-w-44 flex flex-col gap-1">
                {appointment.assignedStaff && (
                    <span className="text-neutral-700 text-sm font-['Inter_Tight']">
                        {appointment.assignedStaff.firstName} {appointment.assignedStaff.lastName}
                    </span>
                )}
                <Badge variant="secondary" className={`text-xs font-["Inter_Tight"] w-fit ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                </Badge>
            </div>

            {/* Actions Column */}
            <div className="flex-1 w-full flex gap-2 items-center justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusChange(appointment._id, 'Cancelled')}
                    className="text-red-600 border-red-200 hover:bg-red-50 font-['Inter_Tight']"
                >
                    Cancel
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(appointment)}
                    className="h-8 w-8"
                >
                    <ArrowsOutSimple size={16} className="text-[#212121]" />
                </Button>
            </div>
        </div>
    )
}
