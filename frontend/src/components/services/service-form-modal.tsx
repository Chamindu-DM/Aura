'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

function LabeledInput({
                          label,
                          value,
                          onChange,
                          placeholder,
                      }: Readonly<{
    label: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
}>) {
    return (
        <div className="w-full max-w-[512px] inline-flex flex-col gap-1">
            <div className="text-black text-base font-medium font-['Inter_Tight'] leading-snug">{label}</div>
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="px-3 py-2 bg-neutral-600/10 rounded-lg text-black text-base leading-tight font-['Inter_Tight']"
            />
        </div>
    )
}

type Option = {
    id: string
    name: string
    duration: string
    price: string
    notes: string
}

const newOption = (): Option => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    duration: '',
    price: '',
    notes: '',
})

// Add Service type for editing
export type Service = {
    _id: string
    serviceName: string  // Changed to match backend
    description: string
    duration: string
    price: string
    available: boolean
    multipleOptions?: boolean
    options?: Option[]
}

interface ServiceFormModalProps {
    trigger: React.ReactNode
    onSave?: (data: any) => void
    existingService?: Service | null  // Add support for editing existing service
    isEdit?: boolean  // Flag to determine if this is edit mode
}

export function ServiceFormModal({
                                     trigger,
                                     onSave,
                                     existingService = null,
                                     isEdit = false
                                 }: ServiceFormModalProps) {
    const [open, setOpen] = useState(false)
    const [serviceName, setServiceName] = useState('')
    const [description, setDescription] = useState('')
    const [multipleOptions, setMultipleOptions] = useState(false)
    const [options, setOptions] = useState<Option[]>([newOption()])

    // Load existing service data when editing
    useEffect(() => {
        if (isEdit && existingService && open) {
            setServiceName(existingService.serviceName || '')
            setDescription(existingService.description || '')
            setMultipleOptions(existingService.multipleOptions || false)

            // If service has options, use them, otherwise create default option
            if (existingService.options && existingService.options.length > 0) {
                setOptions(existingService.options)
            } else {
                // Create option from service's basic info
                setOptions([{
                    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    name: existingService.serviceName || '',
                    duration: existingService.duration || '',
                    price: existingService.price || '',
                    notes: ''
                }])
            }
        }
    }, [isEdit, existingService, open])

    const addOption = () => setOptions((opts) => [...opts, newOption()])
    const updateOption = (id: string, patch: Partial<Option>) =>
        setOptions((opts) => opts.map((o) => (o.id === id ? { ...o, ...patch } : o)))
    const removeOption = (id: string) =>
        setOptions((opts) => (opts.length > 1 ? opts.filter((o) => o.id !== id) : opts))

    const handleSave = () => {
        // Validation
        if (!serviceName.trim()) {
            toast.error('Please enter a service name')
            return
        }

        // Validate at least one option has required fields
        const validOptions = options.filter(opt =>
            opt.name.trim() && opt.duration.trim() && opt.price.trim()
        )

        if (validOptions.length === 0) {
            toast.error('Please fill in at least one complete option (name, duration, and price)')
            return
        }

        // Prepare data to match backend expectations
        const data = {
            serviceName: serviceName.trim(),  // Use serviceName to match backend
            description: description.trim(),
            multipleOptions,
            options: validOptions,
        }

        console.log('Sending data:', data)
        onSave?.(data)
        handleClose()
    }

    const handleClose = () => {
        setOpen(false)
        // Reset form
        setServiceName('')
        setDescription('')
        setMultipleOptions(false)
        setOptions([newOption()])
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/80 backdrop-blur-sm border-0 p-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>{isEdit ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Edit your service details and options' : 'Create a new service with options for your business'}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-10 bg-white flex flex-col items-center gap-10 rounded-lg">
                    <div className="w-full max-w-[720px] p-6 bg-white rounded-2xl flex flex-col items-center gap-6">
                        {/* Service name */}
                        <Input
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            className="w-full max-w-[512px] text-black text-3xl font-bold font-['Inter_Tight'] bg-transparent px-3 py-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="Enter service name"
                        />

                        {/* Description */}
                        <LabeledInput
                            label="Description (Optional)"
                            value={description}
                            onChange={setDescription}
                            placeholder="Briefly describe the service"
                        />

                        {/* Toggle for multiple options */}
                        <div className="w-full max-w-[512px] inline-flex items-center gap-4">
                            <div className="text-black/90 text-xs font-['Inter_Tight'] font-medium tracking-tight">Enable Multiple Options</div>
                            <Switch checked={multipleOptions} onCheckedChange={setMultipleOptions} />
                        </div>

                        {/* Options list */}
                        {(multipleOptions ? options : options.slice(0, 1)).map((opt, idx) => (
                            <div key={opt.id} className="w-full max-w-[512px] rounded-xl border border-black/10 p-4 space-y-4">
                                <div className="text-sm font-medium font-['Inter_Tight'] text-black/70">
                                    {multipleOptions ? `Option ${idx + 1}` : 'Option'}
                                </div>

                                <LabeledInput
                                    label="Option Name *"
                                    value={opt.name}
                                    onChange={(v) => updateOption(opt.id, { name: v })}
                                    placeholder="Classic Haircut"
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <LabeledInput
                                        label="Duration *"
                                        value={opt.duration}
                                        onChange={(v) => updateOption(opt.id, { duration: v })}
                                        placeholder="30 min - 1 hr"
                                    />
                                    <LabeledInput
                                        label="Price *"
                                        value={opt.price}
                                        onChange={(v) => updateOption(opt.id, { price: v })}
                                        placeholder="$50"
                                    />
                                </div>

                                <LabeledInput
                                    label="Notes (Optional)"
                                    value={opt.notes}
                                    onChange={(v) => updateOption(opt.id, { notes: v })}
                                    placeholder="Anything clients should know"
                                />

                                {multipleOptions && options.length > 1 && (
                                    <div className="flex justify-end font-['Inter_Tight']">
                                        <Button variant="ghost" onClick={() => removeOption(opt.id)}>
                                            Remove
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {multipleOptions && (
                            <div className="w-full max-w-[512px]">
                                <Button variant="outline" className="px-5 font-['Inter_Tight']" onClick={addOption}>
                                    Add Option
                                </Button>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="w-full max-w-[512px] py-2 flex justify-end gap-3">
                            <Button variant="secondary" onClick={handleClose} className='font-["Inter_Tight"]'>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} className="bg-black text-white font-['Inter_Tight'] hover:bg-black/90">
                                {isEdit ? 'Update' : 'Save'}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}