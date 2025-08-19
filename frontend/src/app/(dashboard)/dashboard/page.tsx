'use client'

import { Button } from '@/components/ui/button'
import { ChevronDown, MoreHorizontal } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { AppointmentCard } from '@/components/dashboard/appointment-card'
import { AppointmentTabs } from '@/components/dashboard/appointment-tabs'
import { DateTabs } from '@/components/dashboard/date-tabs'
import { ViewCalendarButton } from '@/components/dashboard/view-calendar-button'
import { ProfileStack } from '@/components/dashboard/profile-stack'

export default function Dashboard() {
  const appointmentTabs = [
    { label: 'Upcoming', count: 13, active: true },
    { label: 'Pending', count: 6 },
    { label: 'Completed', count: 0 }
  ]

  const dates = ['Jan 4', 'Jan 5', 'Jan 6', 'Jan 7', 'Jan 8', 'Jan 9']

  const profiles = [
    { name: 'Ava Johnson', image: undefined },
    { name: 'Mia Smith', image: undefined },
    { name: 'Emma Brown', image: undefined },
    { name: 'Noah Wilson', image: undefined }
  ]

  const appointments = [
    {
      time: '9:00 A.M. - 10:30 A.M.',
      customerName: 'Mike Gabriel',
      customerType: 'Member' as const,
      serviceName: 'Bronze Grooming Package',
      duration: '1hr, 20 min - 1hr, 30 min',
      serviceCount: '3 services',
      genderType: 'Male only'
    },
    {
      time: '10:45 A.M. - 12:15 P.M.',
      customerName: 'Emily Smith',
      customerType: 'Member' as const,
      serviceName: 'Silver Grooming Package',
      duration: '1hr, 30 min - 1hr, 45 min',
      serviceCount: '4 services',
      genderType: 'Female only'
    },
    {
      time: '1:30 P.M. - 2:45 P.M.',
      customerName: 'Alex Johnson',
      customerType: 'Non-Member' as const,
      serviceName: 'Basic Haircut',
      duration: '30 min - 45 min',
      serviceCount: '1 service',
      genderType: 'Unisex'
    },
    {
      time: '3:00 P.M. - 4:00 P.M.',
      customerName: 'Sophia Lee',
      customerType: 'Member' as const,
      serviceName: 'Platinum Grooming Package',
      duration: '1hr - 1hr, 15 min',
      serviceCount: '5 services',
      genderType: 'Female only'
    },
    {
      time: '4:30 P.M. - 5:15 P.M.',
      customerName: 'Noah Thompson',
      customerType: 'Non-Member' as const,
      serviceName: 'Beard Trim',
      duration: '15 min - 30 min',
      serviceCount: '1 service',
      genderType: 'Male only'
    }
  ]

  return (
    <main className="flex flex-col isolate items-start justify-start pb-10 pt-0 px-10 size-full">
      {/* Dashboard Title */}
      <div className="flex flex-col gap-7 items-start justify-start overflow-hidden px-0 py-7 w-full z-[2]">
        <div className="flex items-center justify-between w-full">
          {/* Title and Status Container */}
          <div className="flex gap-4 items-center">
            <div className="flex gap-1 items-center">
              <h1 className="font-['Inter_Tight'] font-bold text-black text-[34px] leading-normal">
                Dashboard
              </h1>
              <ChevronDown className="h-6 w-6" />
            </div>
            <div className="bg-[rgba(82,82,82,0.09)] flex gap-2 items-center px-2 py-1 rounded-[10px]">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="font-['Public_Sans'] font-medium text-black text-[15px] leading-[20px]">
                Active
              </span>
            </div>
          </div>

          {/* Actions Container */}
          <div className="flex gap-3 items-center">
            <Button className="bg-black text-white px-5 py-2 rounded-lg font-['Inter_Tight'] font-medium text-[17px]">
              Export CSV
            </Button>
            <Button variant="outline" size="icon" className="bg-[#fcfcfc] border-[1.5px] border-[rgba(92,92,92,0.2)] p-2 rounded-[10px]">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Profile Stack */}
        <ProfileStack profiles={profiles} additionalCount={12} />

        {/* Stats Cards */}
        <div className="flex flex-col gap-[18px] w-full">
          <div className="flex gap-7 w-full">
            <StatsCard title="Appointments" value="120" change="+10%" />
            <StatsCard title="Revenue" value="$5,000" change="+5%" />
            <StatsCard title="New Clients" value="30" change="+15%" />
            <StatsCard title="Total Clients" value="200" change="+8%" />
          </div>
        </div>
      </div>

      {/* Event Schedule */}
      <div className="bg-[#fcfcfc] flex flex-col gap-4 items-start justify-start p-4 rounded-3xl w-full z-[1]">
        {/* Header */}
        <div className="flex items-center justify-start w-full z-[4]">
          <h2 className="font-['Inter_Tight'] font-bold text-black text-[24px] leading-normal flex-1">
            Appointments
          </h2>
        </div>

        {/* Appointment Tabs */}
        <div className="flex items-center justify-start w-full z-[3]">
          <div className="flex-1">
            <AppointmentTabs tabs={appointmentTabs} />
          </div>
          <ViewCalendarButton />
        </div>

        {/* Date Tabs */}
        <div className="w-full z-[2]">
          <DateTabs dates={dates} />
        </div>

        {/* Appointment Cards */}
        <div className="flex flex-col gap-4 w-full z-[1]">
          {appointments.map((appointment, index) => (
            <AppointmentCard key={index} {...appointment} />
          ))}
        </div>
      </div>
    </main>
  )
}
