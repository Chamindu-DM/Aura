'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { AppointmentFormModal } from '@/components/appointments/appointment-form-modal'
import { AppointmentRow } from '@/components/appointments/appointment-row'
import { getCookie } from 'cookies-next'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
    MagnifyingGlass,
    Plus,
    CaretUp,
    CaretDown,
    CalendarBlank,
    Bell
} from 'phosphor-react'
import { MoreHorizontal } from "lucide-react"

interface Appointment {
    _id: string
    time: string
    date: string
    customerName: string
    customerType: 'Member' | 'Non-Member'
    customerPhone?: string
    customerEmail?: string
    serviceName: string
    serviceId?: string | { _id: string, serviceName: string, price: string }
    duration: string
    serviceCount: string
    genderType: string
    assignedStaff?: {
        _id: string
        firstName: string
        lastName: string
        role: string
    }
    status: string
    price?: string
    notes?: string
}

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const router = useRouter()

    // Fetch appointments from the backend API on page load
    useEffect(() => {
        const fetchAppointments = async () => {
            const authToken = getCookie('authToken')
            if (!authToken) {
                toast.error("Authentication failed. Please log in again.")
                router.push('/login')
                return
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointments`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                })

                if (!res.ok) {
                    throw new Error('Failed to fetch appointments')
                }

                const data = await res.json()
                console.log('Fetched appointments:', data.appointments)

                setAppointments(data.appointments || [])
                toast.success('Appointments loaded successfully!')

            } catch (error) {
                console.error('Error fetching appointments:', error)
                toast.error('Failed to load appointments. Please try again later.')
            } finally {
                setIsLoading(false)
            }
        }
        fetchAppointments()
    }, [router])

    // Handle creating new appointments
    const handleAppointmentSave = async (data: any) => {
        const authToken = getCookie('authToken')
        if (!authToken) {
            toast.error("Authentication failed. Please log in again.")
            router.push('/login')
            return
        }

        try {
            console.log('Creating new appointment:', data)

            // Ensure we're sending strings, not objects for IDs
            const appointmentData = {
                ...data,
                serviceId: typeof data.serviceId === 'object' ? data.serviceId._id : data.serviceId,
                assignedStaff: typeof data.assignedStaff === 'object' ? data.assignedStaff._id : data.assignedStaff
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(appointmentData)
            })

            const responseData = await res.json()
            console.log('Backend response:', responseData)

            if (!res.ok) {
                console.error('Backend error:', responseData)
                throw new Error(responseData.message || 'Failed to save appointment')
            }

            // Add the new appointment to the state immediately
            if (responseData.success && responseData.appointment) {
                setAppointments(prevAppointments => {
                    const newAppointments = [...prevAppointments, responseData.appointment]
                    console.log('Updated appointments list:', newAppointments)
                    return newAppointments
                })
                toast.success('Appointment created successfully!')
            } else {
                throw new Error('Invalid response from server')
            }

        } catch (error) {
            console.error('Error saving appointment:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to create new appointment.')
        }
    }

    // Handle updating existing appointments
    const handleAppointmentUpdate = async (data: any) => {
        const authToken = getCookie('authToken')
        if (!authToken) {
            toast.error("Authentication failed. Please log in again.")
            router.push('/login')
            return
        }

        try {
            console.log('Updating appointment:', selectedAppointment._id, data)

            // Ensure we're sending strings, not objects for IDs
            const appointmentData = {
                ...data,
                serviceId: typeof data.serviceId === 'object' ? data.serviceId._id : data.serviceId,
                assignedStaff: typeof data.assignedStaff === 'object' ? data.assignedStaff._id : data.assignedStaff
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointments/${selectedAppointment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(appointmentData)
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || 'Failed to update appointment')
            }

            const responseData = await res.json()

            setAppointments(prev => prev.map(appointment =>
                appointment._id === selectedAppointment._id ? responseData.appointment : appointment
            ))

            toast.success('Appointment updated successfully!')
            setEditModalOpen(false)
            setSelectedAppointment(null)

        } catch (error) {
            console.error('Error updating appointment:', error)
            toast.error('Failed to update appointment.')
        }
    }

    // Handle status change
    const handleStatusChange = async (id: string, status: string) => {
        const authToken = getCookie('authToken')
        if (!authToken) {
            toast.error("Authentication failed. Please log in again.")
            router.push('/login')
            return
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointments/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ status })
            })

            if (!res.ok) {
                throw new Error('Failed to update status')
            }

            setAppointments(prev => prev.map(appointment =>
                appointment._id === id ? { ...appointment, status } : appointment
            ))

            toast.success(`Appointment ${status.toLowerCase()} successfully!`)

        } catch (error) {
            console.error('Error updating status:', error)
            toast.error('Failed to update appointment status.')
        }
    }

    // Handle delete appointment
    const handleDelete = async (id: string) => {
        const authToken = getCookie('authToken')
        if (!authToken) {
            toast.error("Authentication failed. Please log in again.")
            router.push('/login')
            return
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })

            if (!res.ok) {
                throw new Error('Failed to delete appointment')
            }

            setAppointments(prev => prev.filter(appointment => appointment._id !== id))
            toast.success('Appointment deleted successfully!')

        } catch (error) {
            console.error('Error deleting appointment:', error)
            toast.error('Failed to delete appointment.')
        }
    }

    // Handle edit appointment
    const handleEdit = (appointment: Appointment) => {
        setSelectedAppointment({
            ...appointment,
            date: appointment.date.split('T')[0], // Format date for input
            assignedStaff: appointment.assignedStaff?._id || ''
        })
        setEditModalOpen(true)
    }

    // Filter appointments based on search and status
    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
        return matchesSearch && matchesStatus
    })

    // Get today's appointments count
    const todayAppointments = appointments.filter(apt => {
        const today = new Date().toDateString()
        const appointmentDate = new Date(apt.date).toDateString()
        return appointmentDate === today
    }).length

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
                <p>Loading appointments...</p>
            </div>
        )
    }

    return (
        <main className="bg-white rounded-lg flex flex-col px-10 pb-10 size-full">
            {/* Header */}
            <div className="py-7 flex flex-col gap-7">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-['Inter_Tight'] font-bold text-black text-[34px] leading-normal">
                            Appointments
                        </h1>
                        <p className="text-neutral-800/60 text-base font-medium font-['Inter_Tight']">
                            Manage your salon appointments and schedules.
                        </p>
                    </div>

                    <div className="flex gap-3 py-1">
                        <AppointmentFormModal onSaveAction={handleAppointmentSave} />
                        <Button variant="outline" size="icon" className="bg-neutral-50 border-zinc-600/20 p-2 rounded-[10px]">
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="flex gap-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex-1">
                        <div className="flex items-center gap-2">
                            <CalendarBlank size={20} className="text-blue-600" />
                            <span className="font-['Inter_Tight'] font-medium text-blue-900">Today's Appointments</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900 mt-1">{todayAppointments}</p>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex-1">
                        <div className="flex items-center gap-2">
                            <Bell size={20} className="text-green-600" />
                            <span className="font-['Inter_Tight'] font-medium text-green-900">Total Appointments</span>
                        </div>
                        <p className="text-2xl font-bold text-green-900 mt-1">{appointments.length}</p>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="bg-[#fcfcfc] rounded-3xl p-4 flex flex-col gap-4">
                {/* Search and Filter */}
                <div className="flex gap-4 items-center">
                    <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                        <TabsList className='font-["Inter_Tight"]'>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="Scheduled">Scheduled</TabsTrigger>
                            <TabsTrigger value="Confirmed">Confirmed</TabsTrigger>
                            <TabsTrigger value="Completed">Completed</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Appointments Table */}
                {filteredAppointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <CalendarBlank size={64} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2 font-['Inter_Tight']">
                            {appointments.length === 0 ? 'No appointments yet' : 'No appointments found'}
                        </h3>
                        <p className="text-gray-500 mb-6 font-['Inter_Tight']">
                            {appointments.length === 0
                                ? 'Get started by creating your first appointment.'
                                : 'Try adjusting your search or filter criteria.'
                            }
                        </p>
                        {appointments.length === 0 && (
                            <AppointmentFormModal onSaveAction={handleAppointmentSave} />
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {/* Table Header */}
                        <div className="flex w-full border-b border-[rgba(0,0,0,0.1)] py-2 text-[13px] text-[rgba(60,60,67,0.6)] font-['Inter_Tight'] font-medium">
                            <div className="flex-1 max-w-40 flex items-center gap-2">
                                <span>Date & Time</span>
                            </div>
                            <div className="flex-1 max-w-48 flex items-center gap-2">
                                <span>Customer</span>
                            </div>
                            <div className="flex-1 max-w-52 flex items-center gap-2">
                                <span>Service</span>
                            </div>
                            <div className="flex-1 max-w-44 flex items-center gap-2">
                                <span>Staff & Status</span>
                            </div>
                            <div className="flex-1 max-w-32 flex items-center justify-end gap-2">
                                <span>Actions</span>
                            </div>
                        </div>

                        {/* Table Body */}
                        {filteredAppointments.map((appointment) => (
                            <AppointmentRow
                                key={appointment._id}
                                appointment={appointment}
                                onEdit={handleEdit}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                {/* Edit Modal */}
                {editModalOpen && (
                    <AppointmentFormModal
                        open={editModalOpen}
                        setOpen={setEditModalOpen}
                        appointment={selectedAppointment}
                        onSaveAction={handleAppointmentUpdate}
                    />
                )}
            </div>
        </main>
    )
}
