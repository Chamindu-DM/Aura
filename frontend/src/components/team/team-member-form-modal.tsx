'use client'

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

interface TeamMemberFormModalProps {
    onSave: (data: z.infer<typeof formSchema>) => void;
    onUpdate?: (data: z.infer<typeof formSchema>) => void;
    member?: Partial<z.infer<typeof formSchema>> | null;
    open?: boolean;
    setOpen?: (open: boolean) => void;
}

// 1. Define the Zod schema for validation.
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

export function TeamMemberFormModal({ onSave, onUpdate, member, open: controlledOpen, setOpen: setControlledOpen }: TeamMemberFormModalProps) {
    const isEditMode = !!member;
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

    // 2. Define the form with React Hook Form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: member ? {
            firstName: member.firstName || '',
            lastName: member.lastName || '',
            phone: member.phone || '',
            email: member.email || '',
            address: member.address || '',
            jobTitle: member.jobTitle || '',
            accountHolderName: member.accountHolderName || '',
            accountNumber: member.accountNumber || '',
            bankName: member.bankName || '',
            bankAddress: member.bankAddress || '',
        } : {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            address: '',
            jobTitle: '',
            accountHolderName: '',
            accountNumber: '',
            bankName: '',
            bankAddress: '',
        },
    });

    // Reset form when member changes (for edit mode)
    React.useEffect(() => {
        if (member) {
            form.reset({
                firstName: member.firstName || '',
                lastName: member.lastName || '',
                phone: member.phone || '',
                email: member.email || '',
                address: member.address || '',
                jobTitle: member.jobTitle || '',
                accountHolderName: member.accountHolderName || '',
                accountNumber: member.accountNumber || '',
                bankName: member.bankName || '',
                bankAddress: member.bankAddress || '',
            });
        } else {
            form.reset();
        }
    }, [member]);

    // 3. Define the submission handler.
    function onSubmit(data: z.infer<typeof formSchema>) {
        if (isEditMode && onUpdate) {
            onUpdate(data);
        } else {
            onSave(data);
        }
        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Only show trigger if not controlled by parent */}
            {!controlledOpen && (
                <DialogTrigger asChild>
                    <Button className="bg-black text-white px-5 py-2 rounded-lg font-['Inter_Tight'] font-medium text-base flex items-center gap-2">
                        <Plus size={24} />
                        Add New Member
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[760px] max-h-[80vh] overflow-y-auto font-['Inter_Tight']">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{isEditMode ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? 'Update the details for this team member. Click save when you\'re done.' : 'Enter the details for the new team member here. Click save when you\'re done.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 font-['Inter_Tight']">
                        {/* Basic Information Section */}
                        <div>
                            <h3 className="text-black/50 text-base font-bold font-['Inter_Tight'] mb-4">Basic Information</h3>
                            <div className="grid grid-cols-2 gap-6 p-3 rounded-lg border border-black/10">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter first name"
                                                    className="text-black focus:text-black"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter last name"
                                                    className="text-black focus:text-black"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="+94 71 2345 678"
                                                    className="text-black focus:text-black"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter email"
                                                    className="text-black focus:text-black"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter home address"
                                                    className="text-black focus:text-black"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="jobTitle"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Job Title/Department</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter job title"
                                                    className="text-black focus:text-black"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Bank Account Details Section */}
                        <div>
                            <h3 className="text-black/50 text-base font-bold font-['Inter_Tight'] mb-4 mt-6">Bank Account Details</h3>
                            <div className="grid grid-cols-2 gap-x-10 gap-y-4 p-3 rounded-lg border border-black/10">
                                <FormField
                                    control={form.control}
                                    name="accountHolderName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account Holder Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter name"
                                                    className="text-black focus:text-black"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="accountNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter account number"
                                                    className="text-black focus:text-black"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bankName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bank Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter bank name"
                                                    className="text-black focus:text-black"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bankAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bank Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter bank address"
                                                    className="text-black focus:text-black"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-8">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="w-full bg-black text-white mt-4">
                                {isEditMode ? 'Update Member' : 'Save Member'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}