'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Plus, CalendarBlank } from 'phosphor-react'
import { getCookie } from 'cookies-next'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AppointmentFormData {
    time: string
    date: string
    customerName: string
    customerType: 'Member' | 'Non-Member'
    customerPhone?: string
    customerEmail?: string
    serviceName: string
    serviceId?: string
    duration: string
    serviceCount: string
    genderType: 'Male' | 'Female' | 'Unisex'
    assignedStaff?: string
    price?: string
    notes?: string
}

interface Service {
    _id: string
    serviceName: string
    duration: string
    price: string
    options?: any[]
}

interface TeamMember {
    _id: string
    firstName: string
    lastName: string
    role: string
}

interface AppointmentFormModalProps {
    onSaveAction: (data: AppointmentFormData) => void
    appointment?: AppointmentFormData
    open?: boolean
    setOpen?: (open: boolean) => void
}

export function AppointmentFormModal({
    onSaveAction,
    appointment,
    open: controlledOpen,
    setOpen: setControlledOpen
}: AppointmentFormModalProps) {
    const [open, setOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [formData, setFormData] = useState<AppointmentFormData>({
        time: '',
        date: '',
        customerName: '',
        customerType: 'Non-Member',
        customerPhone: '',
        customerEmail: '',
        serviceName: '',
        serviceId: '',
        duration: '',
        serviceCount: '1 service',
        genderType: 'Unisex',
        assignedStaff: '',
        price: '',
        notes: ''
    })

    const [services, setServices] = useState<Service[]>([])
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const isControlled = controlledOpen !== undefined

    // Fetch services and team members
    useEffect(() => {
        const fetchData = async () => {
            const authToken = getCookie('authToken')
            if (!authToken) return

            try {
                // Fetch services
                const servicesRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/services`, {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                })
                if (servicesRes.ok) {
                    const servicesData = await servicesRes.json()
                    setServices(servicesData.services || [])
                }

                // Fetch team members
                const teamRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/team-members`, {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                })
                if (teamRes.ok) {
                    const teamData = await teamRes.json()
                    setTeamMembers(teamData.members || [])
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    // Set form data when appointment prop changes
    useEffect(() => {
        if (appointment) {
            setFormData({
                time: appointment.time || '',
                date: appointment.date || '',
                customerName: appointment.customerName || '',
                customerType: appointment.customerType || 'Non-Member',
                customerPhone: appointment.customerPhone || '',
                customerEmail: appointment.customerEmail || '',
                serviceName: appointment.serviceName || '',
                serviceId: appointment.serviceId || '',
                duration: appointment.duration || '',
                serviceCount: appointment.serviceCount || '1 service',
                genderType: appointment.genderType || 'Unisex',
                assignedStaff: appointment.assignedStaff || '',
                price: appointment.price || '',
                notes: appointment.notes || ''
            })
            if (appointment.date) {
                setSelectedDate(new Date(appointment.date))
            }
        }
    }, [appointment])

    const handleInputChange = (field: keyof AppointmentFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
        if (date) {
            setFormData(prev => ({
                ...prev,
                date: format(date, 'yyyy-MM-dd')
            }))
        }
    }

    const handleServiceChange = (serviceId: string) => {
        const selectedService = services.find(s => s._id === serviceId)
        if (selectedService) {
            setFormData(prev => ({
                ...prev,
                serviceId,
                serviceName: selectedService.serviceName,
                duration: selectedService.duration,
                price: selectedService.price
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await onSaveAction(formData)

            // Reset form
            setFormData({
                time: '',
                date: '',
                customerName: '',
                customerType: 'Non-Member',
                customerPhone: '',
                customerEmail: '',
                serviceName: '',
                serviceId: '',
                duration: '',
                serviceCount: '1 service',
                genderType: 'Unisex',
                assignedStaff: '',
                price: '',
                notes: ''
            })
            setSelectedDate(undefined)

            // Close modal
            if (isControlled && setControlledOpen) {
                setControlledOpen(false)
            } else {
                setOpen(false)
            }

            toast.success(appointment ? 'Appointment updated successfully!' : 'Appointment created successfully!')
        } catch (error) {
            console.error('Error saving appointment:', error)
            toast.error('Failed to save appointment. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const modalOpen = isControlled ? controlledOpen : open
    const setModalOpen = isControlled ? setControlledOpen : setOpen

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            {!isControlled && (
                <DialogTrigger asChild>
                    <Button className="bg-black text-white px-5 py-2 rounded-lg font-['Inter_Tight'] font-medium text-base flex items-center gap-2">
                        <Plus size={24} />
                        New Appointment
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-['Inter_Tight'] font-bold text-[24px] text-black">
                        {appointment ? 'Edit Appointment' : 'Create New Appointment'}
                    </DialogTitle>
                    <DialogDescription className="font-['Inter_Tight'] text-gray-600">
                        {appointment ? 'Update appointment details below.' : 'Fill in the details to create a new appointment.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 font-['Inter_Tight']">
                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="py-1">
                            <Label htmlFor="date" className="text-black font-medium font-['Inter_Tight'] py-1 block">Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal font-['Inter_Tight'] py-1",
                                            !selectedDate && "text-gray-500"
                                        )}
                                    >
                                        <CalendarBlank className="mr-2 h-4 w-4" />
                                        {selectedDate ? (
                                            <span className="text-black font-['Inter_Tight']">{format(selectedDate, "PPP")}</span>
                                        ) : (
                                            <span className="text-gray-500 font-['Inter_Tight']">Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={handleDateSelect}
                                        disabled={(date) =>
                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="py-1">
                            <Label htmlFor="time" className="text-black font-medium font-['Inter_Tight'] py-1 block">Time</Label>
                            <Input
                                id="time"
                                type="time"
                                value={formData.time}
                                onChange={(e) => handleInputChange('time', e.target.value)}
                                className="text-black placeholder:text-gray-500 font-['Inter_Tight'] py-1"
                                required
                            />
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="space-y-4">
                        <div className="py-1">
                            <Label htmlFor="customerName" className="text-black font-medium font-['Inter_Tight'] py-1 block">Customer Name</Label>
                            <Input
                                id="customerName"
                                value={formData.customerName}
                                onChange={(e) => handleInputChange('customerName', e.target.value)}
                                className="text-black placeholder:text-gray-500 font-['Inter_Tight'] py-1"
                                placeholder="Enter customer name"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="py-1">
                                <Label htmlFor="customerType" className="text-black font-medium font-['Inter_Tight'] py-1 block">Customer Type</Label>
                                <Select
                                    value={formData.customerType}
                                    onValueChange={(value) => handleInputChange('customerType', value)}
                                >
                                    <SelectTrigger className="text-black font-['Inter_Tight'] py-1">
                                        <SelectValue className="font-['Inter_Tight']" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Member" className="font-['Inter_Tight']">Member</SelectItem>
                                        <SelectItem value="Non-Member" className="font-['Inter_Tight']">Non-Member</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="py-1">
                                <Label htmlFor="genderType" className="text-black font-medium font-['Inter_Tight'] py-1 block">Gender Type</Label>
                                <Select
                                    value={formData.genderType}
                                    onValueChange={(value) => handleInputChange('genderType', value)}
                                >
                                    <SelectTrigger className="text-black font-['Inter_Tight'] py-1">
                                        <SelectValue className="font-['Inter_Tight']" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male" className="font-['Inter_Tight']">Male</SelectItem>
                                        <SelectItem value="Female" className="font-['Inter_Tight']">Female</SelectItem>
                                        <SelectItem value="Unisex" className="font-['Inter_Tight']">Unisex</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="py-1">
                                <Label htmlFor="customerPhone" className="text-black font-medium font-['Inter_Tight'] py-1 block">Phone (Optional)</Label>
                                <Input
                                    id="customerPhone"
                                    value={formData.customerPhone}
                                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                                    className="text-black placeholder:text-gray-500 font-['Inter_Tight'] py-1"
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div className="py-1">
                                <Label htmlFor="customerEmail" className="text-black font-medium font-['Inter_Tight'] py-1 block">Email (Optional)</Label>
                                <Input
                                    id="customerEmail"
                                    type="email"
                                    value={formData.customerEmail}
                                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                                    className="text-black placeholder:text-gray-500 font-['Inter_Tight'] py-1"
                                    placeholder="Enter email address"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Service Information */}
                    <div className="space-y-4">
                        <div className="py-1">
                            <Label htmlFor="service" className="text-black font-medium font-['Inter_Tight'] py-1 block">Service</Label>
                            <Select
                                value={formData.serviceId}
                                onValueChange={handleServiceChange}
                            >
                                <SelectTrigger className="text-black font-['Inter_Tight'] py-1">
                                    <SelectValue placeholder="Select a service" className="font-['Inter_Tight']" />
                                </SelectTrigger>
                                <SelectContent>
                                    {services.map((service) => (
                                        <SelectItem key={service._id} value={service._id} className="font-['Inter_Tight']">
                                            {service.serviceName} - {service.duration} - {service.price}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="py-1">
                                <Label htmlFor="duration" className="text-black font-medium font-['Inter_Tight'] py-1 block">Duration</Label>
                                <Input
                                    id="duration"
                                    value={formData.duration}
                                    className="text-black bg-gray-50 font-['Inter_Tight'] py-1 cursor-not-allowed"
                                    placeholder="Duration will be auto-filled"
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div className="py-1">
                                <Label htmlFor="price" className="text-black font-medium font-['Inter_Tight'] py-1 block">Price</Label>
                                <Input
                                    id="price"
                                    value={formData.price}
                                    className="text-black bg-gray-50 font-['Inter_Tight'] py-1 cursor-not-allowed"
                                    placeholder="Price will be auto-filled"
                                    readOnly
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="py-1">
                                <Label htmlFor="serviceCount" className="text-black font-medium font-['Inter_Tight'] py-1 block">Service Count</Label>
                                <Input
                                    id="serviceCount"
                                    value={formData.serviceCount}
                                    onChange={(e) => handleInputChange('serviceCount', e.target.value)}
                                    className="text-black placeholder:text-gray-500 font-['Inter_Tight'] py-1"
                                    placeholder="e.g., 1 service"
                                    required
                                />
                            </div>
                            <div className="py-1">
                                <Label htmlFor="assignedStaff" className="text-black font-medium font-['Inter_Tight'] py-1 block">Assigned Staff (Optional)</Label>
                                <Select
                                    value={formData.assignedStaff}
                                    onValueChange={(value) => handleInputChange('assignedStaff', value)}
                                >
                                    <SelectTrigger className="text-black font-['Inter_Tight'] py-1">
                                        <SelectValue placeholder="Select staff member" className="font-['Inter_Tight']" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teamMembers.map((member) => (
                                            <SelectItem key={member._id} value={member._id} className="font-['Inter_Tight']">
                                                {member.firstName} {member.lastName} - {member.role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="py-1">
                        <Label htmlFor="notes" className="text-black font-medium font-['Inter_Tight'] py-1 block">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            className="text-black placeholder:text-gray-500 font-['Inter_Tight'] py-1"
                            placeholder="Add any additional notes..."
                            rows={3}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setModalOpen?.(false)}
                            className="text-black border-gray-300 font-['Inter_Tight']"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-black text-white hover:bg-gray-800 font-['Inter_Tight']"
                        >
                            {isLoading ? 'Saving...' : (appointment ? 'Update Appointment' : 'Create Appointment')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
