'use client'

import { TeamMemberRow } from './team-member-row'

interface TeamMember {
  id: string
  name: string
  avatar?: string
  status: 'Available' | 'On Leave' | 'Custom Schedule'
  role: string
  hourlyRate: string
  available: boolean
}

interface TeamTableProps {
  members: TeamMember[]
  onToggleAvailability: (id: string, available: boolean) => void
  onExpandDetails: (id: string) => void
}

export function TeamTable({ members, onToggleAvailability, onExpandDetails }: TeamTableProps) {
  return (
    <div className="flex flex-col pt-4 w-full">
      {/* Table Header */}
      <div className="flex w-full border-b border-[rgba(0,0,0,0.1)] py-2 text-[13px] text-[rgba(60,60,67,0.6)] font-['Inter_Tight'] font-medium">
        <div className="flex-1 max-w-60 flex items-center gap-2">
          <span>Name</span>
        </div>
        <div className="flex-1 flex items-center gap-2">
          <span>Availability Status:</span>
        </div>
        <div className="flex-1 flex items-center gap-2">
          <span>Role</span>
        </div>
        <div className="flex-1 max-w-28 flex items-center gap-2">
          <span>Hourly Rate</span>
        </div>
        <div className="flex-1 max-w-20 flex items-center gap-2">
          <span>Available</span>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Table Body */}
      {members.map((member) => (
        <TeamMemberRow
          key={member.id}
          member={member}
          onToggleAvailability={onToggleAvailability}
          onExpandDetails={onExpandDetails}
        />
      ))}
    </div>
  )
}