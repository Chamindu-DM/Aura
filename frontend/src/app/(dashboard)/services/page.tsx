'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ServiceFormModal } from '@/components/services/service-form-modal'
import ServiceRow from '@/components/services/service-row'
import { 
  MagnifyingGlass,
  Plus,
  DotsThreeOutline,
  CaretUp,
  CaretDown,
  ArrowsOutSimple,
  Bell
} from 'phosphor-react'

interface Service {
  id: string
  name: string
  description: string
  duration: string
  price: string
  available: boolean
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Haircut',
      description: 'Our signature haircut with a precise beard trim for a polished look',
      duration: '30 min',
      price: '$30',
      available: true
    },
    {
      id: '2',
      name: 'Nail Care',
      description: 'A relaxing spa session to unwind and rejuvenate',
      duration: '45 min',
      price: '$40',
      available: true
    },
    {
      id: '3',
      name: 'Facial',
      description: 'A stylish manicure for a fresh and modern appearance',
      duration: '60 min',
      price: '$50',
      available: true
    },
    {
      id: '4',
      name: 'Massage',
      description: 'An invigorating facial treatment to revitalize your skin',
      duration: '75 min',
      price: '$60',
      available: true
    },
    {
      id: '5',
      name: 'Pedicure',
      description: 'A soothing massage to release tension and promote relaxation',
      duration: '90 min',
      price: '$70',
      available: true
    },
    {
      id: '6',
      name: 'Waxing',
      description: 'A professional makeup session for a glamorous transformation',
      duration: '105 min',
      price: '$80',
      available: true
    },
    {
      id: '7',
      name: 'Manicure',
      description: 'A luxurious pedicure to pamper your feet and nails',
      duration: '120 min',
      price: '$90',
      available: false
    },
    {
      id: '8',
      name: 'Spa Treatment',
      description: 'A trendy hairstyling session for a fashionable update',
      duration: '135 min',
      price: '$100',
      available: false
    },
    {
      id: '9',
      name: 'Sauna Session',
      description: 'An energizing body scrub for smooth and radiant skin',
      duration: '150 min',
      price: '$110',
      available: false
    },
    {
      id: '10',
      name: 'Body Scrub',
      description: 'A personalized skincare consultation for a healthy glow',
      duration: '165 min',
      price: '$120',
      available: true
    }
  ])

  const handleServiceSave = (data: any) => {
    const newService: Service = {
      id: Date.now().toString(),
      name: data.serviceName,
      description: data.description,
      duration: data.options[0]?.duration || '30 min',
      price: data.options[0]?.price || '$50',
      available: true
    }
    setServices(prev => [...prev, newService])
  }

  const handleServiceToggle = (serviceId: string, available: boolean) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId ? { ...service, available } : service
      )
    )
  }

  const activeServices = services.filter(service => service.available)
  const draftServices = services.filter(service => !service.available)

  return (
    <main className="bg-white rounded-lg flex flex-col isolate items-start justify-start pb-10 pt-0 px-10 size-full">
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
            />
            <Button variant="outline" size="icon" className="bg-[#fcfcfc] border-[1.5px] border-[rgba(92,92,92,0.2)] p-2 rounded-[10px]">
              <DotsThreeOutline size={20} />
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
              <TabsTrigger 
                value="active"
              >
                <span className="font-['Inter_Tight'] font-medium text-[15px] leading-[22px]">
                  Active
                </span>
                <Badge className="bg-black text-white rounded-lg px-2">
                  <span className="font-['Inter'] font-semibold text-[12px] leading-normal tracking-[-0.048px]">
                    {activeServices.length}
                  </span>
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="drafts"
              >
                <span className="font-['Inter_Tight'] font-medium text-[15px] leading-[22px]">
                  Drafts
                </span>
                <Badge className="bg-black text-white rounded-lg px-2">
                  <span className="font-['Inter'] font-semibold text-[12px] leading-normal tracking-[-0.048px]">
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

          {/* Table Body - Single map function */}
          {services.map((service) => (
            <ServiceRow 
              key={service.id} 
              service={service} 
              onToggleAction={handleServiceToggle} 
              onSaveAction={handleServiceSave} 
            />
          ))}
        </div>
      </div>
    </main>
  )
}
