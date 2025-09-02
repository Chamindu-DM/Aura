'use client'

import { useState, useEffect } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TeamTable } from '@/components/team/team-table'
import { TeamMemberFormModal } from '@/components/team/team-member-form-modal'
import { UsersThree } from 'phosphor-react'
import {getCookie} from "cookies-next";
import { toast} from "sonner";
import { useRouter} from "next/navigation";
import { z } from 'zod'

interface TeamMember {
  id: string
  name: string
  avatar?: string
  status: 'Available' | 'On Leave' | 'Custom Schedule'
  role: string
  hourlyRate: string
  available: boolean
  phone?: string
  email?: string
  address?: string
  accountHolderName?: string
  accountNumber?: string
  bankName?: string
  bankAddress?: string
}

// Form schema type for the modal
const formSchema = z.object({
    firstName: z.string().min(2, { message: 'First name is required.' }),
    lastName: z.string().min(2, { message: 'Last name is required.' }),
    phone: z.string().min(10, { message: 'Phone number is required.' }),
    email: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
    jobTitle: z.string().min(2, { message: 'Job title is required.' }),
    accountHolderName: z.string().optional().or(z.literal('')),
    accountNumber: z.string().optional().or(z.literal('')),
    bankName: z.string().optional().or(z.literal('')),
    bankAddress: z.string().optional().or(z.literal('')),
})

export default function DashboardTeam() {
  const [members, setMembers] = useState<TeamMember[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any | null>(null);
    const router = useRouter()

    // Fetch team members from backend
    const fetchTeamMembers = async () => {
        const authToken = getCookie('authToken');
        if(!authToken){
            toast.error("Authentication failed. Please log in again.");
            router.push('/login');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/team-members`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch team members');
            }

            const data = await res.json();
            // Transform backend data to match frontend interface
            const transformedMembers = data.members.map((member: any) => ({
                id: member._id,
                name: member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim(),
                avatar: member.avatar,
                status: member.status,
                role: member.role,
                hourlyRate: member.hourlyRate,
                available: member.available
            }));

            setMembers(transformedMembers);
        } catch (error) {
            console.error('Error fetching team members:', error);
            toast.error('Failed to load team members. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Load team members on component mount
    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const handleToggleAvailability = async (id: string, available: boolean) => {
        const authToken = getCookie('authToken');
        if(!authToken){
            toast.error("Authentication failed. Please log in again.");
            router.push('/login');
            return;
        }

        // Optimistic update
        setMembers(prev =>prev.map(member =>
            member.id === id ? {...member, available} : member
        ));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/team-members/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({available})
            });

            if (!res.ok) {
                throw new Error('Failed to toggle availability');
            }

            toast.success(`Availability updated successfully!`);
        } catch (error) {
            console.error('Error toggling availability:', error);
            toast.error('Failed to update availability. Please try again.');

            // Revert optimistic update on error
            setMembers(prev =>prev.map( member =>
                member.id === id ? {...member, available: !available} : member
            ));
        }
    };

    const handleExpandDetails = (id: string) => {
        const member = members.find(m => m.id === id);
        if (member) {
            // Map member fields to form fields
            setSelectedMember({
                firstName: member.name.split(' ')[0] || '',
                lastName: member.name.split(' ').slice(1).join(' ') || '',
                phone: member.phone || '',
                email: member.email || '',
                address: member.address || '',
                jobTitle: member.role || '',
                accountHolderName: member.accountHolderName || '',
                accountNumber: member.accountNumber || '',
                bankName: member.bankName || '',
                bankAddress: member.bankAddress || '',
            });
            setEditModalOpen(true);
        }
    };

    const handleAddNewMember = async (formData: z.infer<typeof formSchema>) => {
        const authToken = getCookie('authToken');
        if(!authToken){
            toast.error("Authentication failed. Please log in again.");
            router.push('/login');
            return;
        }

        try {
            // Transform form data to match backend expectations
            const memberData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                email: formData.email || '',
                address: formData.address || '',
                role: formData.jobTitle,
                accountHolderName: formData.accountHolderName || '',
                accountNumber: formData.accountNumber || '',
                bankName: formData.bankName || '',
                bankAddress: formData.bankAddress || '',
                status: 'Available',
                available: true,
                hourlyRate: '$0/hr'
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/team-members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(memberData)
            });

            if (!res.ok) {
                throw new Error('Failed to add team member');
            }

            const data = await res.json();

            // Add the new member to the local state
            const newMember: TeamMember = {
                id: data.member._id,
                name: `${data.member.firstName} ${data.member.lastName}`, // Combine firstName and lastName from response
                avatar: data.member.avatar,
                status: data.member.status,
                role: data.member.role,
                hourlyRate: data.member.hourlyRate,
                available: data.member.available
            };

            setMembers(prev => [...prev, newMember]);
            toast.success('Team member added successfully!');
        } catch (error) {
            console.error('Error adding team member:', error);
            toast.error('Failed to add team member. Please try again.');
        }
    };

    const handleUpdateMember = async (formData: z.infer<typeof formSchema>) => {
        const authToken = getCookie('authToken');
        if(!authToken){
            toast.error("Authentication failed. Please log in again.");
            router.push('/login');
            return;
        }
        try {
            // Find the member to update
            const memberToUpdate = members.find(m => m.name.split(' ')[0] === formData.firstName && m.name.split(' ').slice(1).join(' ') === formData.lastName);
            if (!memberToUpdate) {
                toast.error('Member not found.');
                return;
            }
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/team-members/${memberToUpdate.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    email: formData.email || '',
                    address: formData.address || '',
                    role: formData.jobTitle,
                    accountHolderName: formData.accountHolderName || '',
                    accountNumber: formData.accountNumber || '',
                    bankName: formData.bankName || '',
                    bankAddress: formData.bankAddress || '',
                })
            });
            if (!res.ok) {
                throw new Error('Failed to update team member');
            }
            const data = await res.json();
            setMembers(prev => prev.map(m => m.id === memberToUpdate.id ? {
                ...m,
                name: `${data.member.firstName} ${data.member.lastName}`,
                role: data.member.role,
                // Add other fields as needed
            } : m));
            toast.success('Team member updated successfully!');
        } catch (error) {
            console.error('Error updating team member:', error);
            toast.error('Failed to update team member. Please try again.');
        }
    };

    if(isLoading){
    return (
      <div className="flex items-center justify-center h-screen gap-2">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
        <p>Loading team members...</p>
      </div>
    );
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
            <TeamMemberFormModal onSave={handleAddNewMember} />
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
        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-gray-400 mb-4">
                <UsersThree size={64} />     </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 font-['Inter_Tight']">No team members yet</h3>
            <p className="text-gray-500 mb-6 font-['Inter_Tight']">Get started by adding your first team member to manage your salon staff.</p>
          </div>
        ) : (
          <>
            <TeamTable
              members={members}
              onToggleAvailability={handleToggleAvailability}
              onExpandDetails={handleExpandDetails}
            />
            <TeamMemberFormModal
                open={editModalOpen}
                setOpen={setEditModalOpen}
                member={selectedMember}
                onUpdate={handleUpdateMember}
                onSave={() => {}}
            />
          </>
        )}
      </div>
    </main>
  );
}
