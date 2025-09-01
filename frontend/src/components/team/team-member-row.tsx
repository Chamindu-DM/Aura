'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import {ArrowsOutSimple} from "phosphor-react";
import React from "react";

interface TeamMember {
  id: string
  name: string
  avatar?: string
  status: 'Available' | 'On Leave' | 'Custom Schedule'
  role: string
  hourlyRate: string
  available: boolean
}

interface TeamMemberRowProps {
  member: TeamMember
  onToggleAvailability: (id: string, available: boolean) => void
  onExpandDetails: (id: string) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Available':
      return 'bg-green-600/40'
    case 'On Leave':
      return 'bg-red-600'
    case 'Custom Schedule':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-400'
  }
}

export function TeamMemberRow({ member, onToggleAvailability, onExpandDetails }: TeamMemberRowProps) {
  return (
    <div className="flex w-full border-t border-black/10 py-5 items-center">
      {/* Name Column */}
      <div className="flex-1 max-w-60 flex items-center gap-2">
        <Avatar className="w-6 h-6">
          <AvatarImage src={member.avatar} />
          <AvatarFallback className="text-xs">
            {member.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
          </AvatarFallback>
        </Avatar>
        <span className="text-neutral-800 text-base font-medium font-['Inter_Tight']">
          {member.name}
        </span>
      </div>

      {/* Status Column */}
      <div className="flex-1">
        <Badge variant="secondary" className="bg-neutral-600/10 rounded-[10px] gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(member.status)}`} />
          <span className="text-black/70 text-base font-medium font-['Inter_Tight']">
            {member.status}
          </span>
        </Badge>
      </div>

      {/* Role Column */}
      <div className="flex-1">
        <span className="text-neutral-800 text-base font-medium font-['Inter_Tight']">
          {member.role}
        </span>
      </div>

      {/* Hourly Rate Column */}
      <div className="flex-1 max-w-28">
        <span className="text-neutral-800 text-base font-medium font-['Inter_Tight']">
          {member.hourlyRate}
        </span>
      </div>

      {/* Available Toggle Column */}
      <div className="flex-1 max-w-20">
        <Switch
          checked={member.available}
          onCheckedChange={(checked) => onToggleAvailability(member.id, checked)}
        />
      </div>

      {/* Actions Column */}
      <div className="w-10 flex justify-center">
          <Button variant="ghost" size="icon">
              <ArrowsOutSimple size={24} className="text-[#212121]" />
          </Button>
      </div>
    </div>
  )
}