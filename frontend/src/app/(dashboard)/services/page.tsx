'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ServiceFormModal } from '@/components/services/service-form-modal'
import ServiceRow from '@/components/services/service-row'
import {getCookie} from 'cookies-next'
import {toast} from 'sonner'
import { useRouter } from 'next/navigation'
import {
    MagnifyingGlass,
    Plus,
    CaretUp,
    CaretDown,
    ArrowsOutSimple,
    Bell
} from 'phosphor-react'
import {MoreHorizontal} from "lucide-react";

interface Service {
    _id: string;
    serviceName: string;  // Changed to match backend
    description: string;
    duration: string;
    price: string;
    available: boolean;
    multipleOptions?: boolean;
    options?: any[];
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Fetch services from the backend API on page load
    useEffect(() => {
        const fetchServices = async () => {
            const authToken = getCookie('authToken')
            if (!authToken) {
                toast.error("Authentication failed. Please log in again.");
                router.push('/login')
                return
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/services`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                })

                if (!res.ok) {
                    throw new Error('Failed to fetch services')
                }

                const data = await res.json()
                console.log('Fetched services:', data.services) // Debug log

                // Process services to ensure they have the right structure for display
                const processedServices = data.services.map((service: any) => ({
                    _id: service._id,
                    serviceName: service.serviceName,
                    description: service.description || '',
                    // Use first option's duration and price if available, otherwise use service level values
                    duration: service.options?.[0]?.duration || service.duration || '',
                    price: service.options?.[0]?.price || service.price || '',
                    available: service.available,
                    multipleOptions: service.multipleOptions,
                    options: service.options
                }))

                setServices(processedServices)
                toast.success('Services loaded successfully!')

            } catch (error) {
                console.error('Error fetching services:', error)
                toast.error('Failed to load services. Please try again later.')
            } finally {
                setIsLoading(false)
            }
        }
        fetchServices()
    }, [router])

    // Handle creating new services
    const handleServiceSave = async (data: any) => {
        const authToken = getCookie('authToken')
        if (!authToken) {
            toast.error("Authentication failed. Please log in again.");
            router.push('/login');
            return;
        }

        try {
            console.log('Creating new service:', data)

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(data)
            })

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Backend error:', errorData);
                throw new Error(errorData.message || 'Failed to save service')
            }

            const responseData = await res.json();
            console.log('Backend response:', responseData)

            // Process the new service for display
            const newService = {
                _id: responseData.service._id,
                serviceName: responseData.service.serviceName,
                description: responseData.service.description || '',
                duration: responseData.service.options?.[0]?.duration || '',
                price: responseData.service.options?.[0]?.price || '',
                available: responseData.service.available ?? true,
                multipleOptions: responseData.service.multipleOptions,
                options: responseData.service.options
            }

            setServices(prevServices => [...prevServices, newService]);
            toast.success('Service added successfully!')

        } catch (error) {
            console.error('Error saving service:', error)
            toast.error('Failed to add new service.')
        }
    }

    // Handle updating existing services
    const handleServiceUpdate = async (data: any, serviceId: string) => {
        const authToken = getCookie('authToken')
        if (!authToken) {
            toast.error("Authentication failed. Please log in again.");
            router.push('/login');
            return;
        }

        try {
            console.log('Updating service:', serviceId, data)

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/services/${serviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(data)
            })

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Backend error:', errorData);
                throw new Error(errorData.message || 'Failed to update service')
            }

            const responseData = await res.json();
            console.log('Update response:', responseData)

            // Update the service in local state
            setServices(prevServices =>
                prevServices.map(service =>
                    service._id === serviceId
                        ? {
                            ...service,
                            serviceName: responseData.service.serviceName,
                            description: responseData.service.description || '',
                            duration: responseData.service.options?.[0]?.duration || '',
                            price: responseData.service.options?.[0]?.price || '',
                            multipleOptions: responseData.service.multipleOptions,
                            options: responseData.service.options
                        }
                        : service
                )
            );

            toast.success('Service updated successfully!')

        } catch (error) {
            console.error('Error updating service:', error)
            toast.error('Failed to update service.')
        }
    }

    // Handle toggling service availability
    const handleServiceToggle = async (serviceId: string, available: boolean) => {
        const authToken = getCookie('authToken')
        if (!authToken) {
            toast.error("Authentication failed. Please log in again.");
            router.push('/login');
            return;
        }

        // Optimistically update UI
        setServices(prev =>
            prev.map(service =>
                service._id === serviceId ? { ...service, available } : service
            )
        );

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/services/${serviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({available})
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to toggle service availability');
            }

            toast.success(`Service ${available ? 'activated' : 'deactivated'} successfully!`);
        } catch (error) {
            console.error("Error toggling service:", error);
            toast.error('Failed to update service availability.');

            // Revert the optimistic update
            setServices(prev =>
                prev.map(service =>
                    service._id === serviceId ? { ...service, available: !available } : service
                )
            );
        }
    }

    // Handle service deletion
    const handleServiceDelete = (serviceId: string) => {
        // Remove the deleted service from local state
        setServices(prevServices =>
            prevServices.filter(service => service._id !== serviceId)
        )
    }

    const activeServices = services.filter(service => service.available)
    const draftServices = services.filter(service => !service.available)

    // showing loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
                <p>Loading services...</p>
            </div>
        )
    }

    return (
        <main className="bg-white rounded-lg flex flex-col px-10 pb-10 size-full">
            {/* Header */}
            <div className="flex flex-col gap-7 items-start justify-start overflow-hidden px-0 py-7 w-full z-[2]">
                <div className="flex items-center justify-between w-full">
                    {/* Title */}
                    <div className="flex gap-1 items-center">
                        <h1 className="font-['Inter_Tight'] font-bold text-black text-[34px] leading-normal">
                            Manage Services
                        </h1>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 items-center">
                        <ServiceFormModal
                            trigger={
                                <Button className="bg-black text-white px-5 py-2 rounded-lg font-['Inter_Tight'] font-medium text-[15px] flex items-center gap-2">
                                    <Plus size={24} weight="regular" />
                                    Add New Service
                                </Button>
                            }
                            onSave={handleServiceSave}
                            isEdit={false}
                        />
                        <Button variant="outline" size="icon" className="bg-[#fcfcfc] border-[1.5px] border-[rgba(92,92,92,0.2)] p-2 rounded-[10px]">
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Services Table Container */}
            <div className="bg-[#fcfcfc] flex flex-col gap-4 items-start justify-start p-4 rounded-3xl w-full z-[1]">
                {/* Tabs */}
                <div className="flex items-center justify-start w-full">
                    <Tabs defaultValue="active">
                        <TabsList>
                            <TabsTrigger value="active">
                <span className="font-['Inter_Tight'] font-medium text-[15px] leading-[22px]">
                  Active
                </span>
                                <Badge className="bg-black text-white font-['Inter_Tight'] rounded-lg px-2">
                  <span className="font-['Inter_Tight'] font-semibold text-[12px] leading-normal tracking-[-0.048px]">
                    {activeServices.length}
                  </span>
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="drafts">
                <span className="font-['Inter_Tight'] font-medium text-[15px] leading-[22px]">
                  Drafts
                </span>
                                <Badge className="bg-black text-white font-['Inter_Tight'] rounded-lg px-2">
                  <span className="font-['Inter_Tight'] font-semibold text-[12px] leading-normal tracking-[-0.048px]">
                    {draftServices.length}
                  </span>
                                </Badge>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Table */}
                <div className="flex flex-col items-start justify-start pt-4 w-full">
                    {/* Table Header */}
                    <div className="flex w-full border-b border-[rgba(0,0,0,0.1)] py-2 text-[13px] text-[rgba(60,60,67,0.6)] font-['Inter_Tight'] font-medium">
                        <div className="flex-1 max-w-[248px]">Service</div>
                        <div className="flex-1">Description</div>
                        <div className="flex-shrink-0 w-[120px]">Duration</div>
                        <div className="flex-shrink-0 w-[120px]">Price</div>
                        <div className="flex-shrink-0 w-20">Available</div>
                        <div className="flex-shrink-0 w-10"></div>
                    </div>

                    {/* Table Body */}
                    {services.length === 0 ? (
                        <div className="flex items-center justify-center w-full py-8">
                            <p className="text-gray-500 font-['Inter_Tight']">No services found. Create your first service!</p>
                        </div>
                    ) : (
                        services.map((service) => (
                            <ServiceRow
                                key={service._id}
                                service={service}
                                onToggleAction={handleServiceToggle}
                                onUpdateAction={handleServiceUpdate}
                                onDeleteAction={handleServiceDelete}
                            />
                        ))
                    )}
                </div>
            </div>
        </main>
    )
}