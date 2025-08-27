'use client'

import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TeamTable } from '@/components/team/team-table'
import { Plus } from 'phosphor-react'

interface TeamMember {
  id: string
  name: string
  avatar?: string
  status: 'Available' | 'On Leave' | 'Custom Schedule'
  role: string
  hourlyRate: string
  available: boolean
}

const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Jonson Alice', status: 'Available', role: 'Stylist', hourlyRate: '$30/hr', available: true },
  { id: '2', name: 'Smith John', status: 'Available', role: 'Hair dresser', hourlyRate: '$40', available: true },
  { id: '3', name: 'Miller Emily', status: 'On Leave', role: 'Barber', hourlyRate: '$50', available: true },
  { id: '4', name: 'Brown Olivia', status: 'Available', role: 'Colorist', hourlyRate: '$60', available: true },
  { id: '5', name: 'Davis James', status: 'Custom Schedule', role: 'Salon assistant', hourlyRate: '$70', available: true },
  { id: '6', name: 'Wilson Sophia', status: 'Custom Schedule', role: 'Manicurist', hourlyRate: '$80', available: true },
  { id: '7', name: 'Taylor Daniel', status: 'Available', role: 'Esthetician', hourlyRate: '$90', available: false },
  { id: '8', name: 'Clark Lily', status: 'Available', role: 'Extensions specialist', hourlyRate: '$100', available: false },
  { id: '9', name: 'Moore Benjamin', status: 'On Leave', role: 'Makeup artist', hourlyRate: '$110', available: false },
  { id: '10', name: 'Anderson Mia', status: 'Available', role: 'Waxing technician', hourlyRate: '$120', available: true },
]

export default function DashboardTeam() {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers)

  const handleToggleAvailability = (id: string, available: boolean) => {
    setMembers(prev => prev.map(member => 
      member.id === id ? { ...member, available } : member
    ))
  }

  const handleExpandDetails = (id: string) => {
    console.log('Expand details for member:', id)
  }

  return (
    <main className="bg-white rounded-lg flex flex-col px-10 pb-10 size-full">
      {/* Header */}
      <div className="py-7 flex flex-col gap-7">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
              <h1 className="font-['Inter_Tight'] font-bold text-black text-[34px] leading-normal">
                  Manage Team
              </h1>
            <p className="text-neutral-800/60 text-base font-medium font-['Inter_Tight']">
              Easily add, remove, or edit team members and their roles.
            </p>
          </div>
          
          <div className="flex gap-3 py-1">
            <Button className="bg-black text-white px-5 py-2 rounded-lg font-['Inter_Tight'] font-medium text-base flex items-center gap-2">
              <Plus size={24} />
              Add New Member
            </Button>
            <Button variant="outline" size="icon" className="bg-neutral-50 border-zinc-600/20 p-2 rounded-[10px]">
                <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-[#fcfcfc] rounded-3xl p-4 flex flex-col gap-4">
        {/* Tabs */}
        <div>
          <Tabs defaultValue="members">
            <TabsList>
              <TabsTrigger value="members">
                  <span className="font-['Inter_Tight'] font-medium text-[15px] leading-[22px]">
                      Members List
                      </span>
              </TabsTrigger>
              <TabsTrigger value="availability">
                  <span className="font-['Inter_Tight'] font-medium text-[15px] leading-[22px]">
                      Availability Tracking
                      </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Team Table */}
        <TeamTable 
          members={members}
          onToggleAvailability={handleToggleAvailability}
          onExpandDetails={handleExpandDetails}
        />
      </div>
    </main>
  );
}
