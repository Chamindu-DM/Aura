'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
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

interface ServiceFormModalProps {
  trigger: React.ReactNode
  onSave?: (data: any) => void
}

export function ServiceFormModal({ trigger, onSave }: ServiceFormModalProps) {
  const [open, setOpen] = useState(false)
  const [serviceName, setServiceName] = useState('')
  const [description, setDescription] = useState('')
  const [multipleOptions, setMultipleOptions] = useState(true)
  const [options, setOptions] = useState<Option[]>([newOption()])

  const addOption = () => setOptions((opts) => [...opts, newOption()])
  const updateOption = (id: string, patch: Partial<Option>) =>
    setOptions((opts) => opts.map((o) => (o.id === id ? { ...o, ...patch } : o)))
  const removeOption = (id: string) =>
    setOptions((opts) => (opts.length > 1 ? opts.filter((o) => o.id !== id) : opts))

  const handleSave = () => {
    if (!serviceName.trim()) {
      return
    }

    const data = {
      serviceName,
      description,
      multipleOptions,
      options,
    }

    onSave?.(data)
    setOpen(false)
    
    // Reset form
    setServiceName('')
    setDescription('')
    setMultipleOptions(true)
    setOptions([newOption()])
  }

  const handleDelete = () => {
    setOpen(false)
    // Reset form
    setServiceName('')
    setDescription('')
    setMultipleOptions(true)
    setOptions([newOption()])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/80 backdrop-blur-sm border-0 p-0">
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

            {/* Options list (show one when toggle is OFF, all when ON) */}
            {(multipleOptions ? options : options.slice(0, 1)).map((opt, idx) => (
              <div key={opt.id} className="w-full max-w-[512px] rounded-xl border border-black/10 p-4 space-y-4">
                <div className="text-sm font-medium font-['Inter_Tight'] text-black/70">
                  {multipleOptions ? `Option ${idx + 1}` : 'Option'}
                </div>

                {/* Name */}
                <LabeledInput
                  label="Option Name"
                  value={opt.name}
                  onChange={(v) => updateOption(opt.id, { name: v })}
                  placeholder="Classic Haircut"
                />

                {/* Duration + Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LabeledInput
                    label="Duration"
                    value={opt.duration}
                    onChange={(v) => updateOption(opt.id, { duration: v })}
                    placeholder="30 min - 1 hr"
                  />
                  <LabeledInput
                    label="Price"
                    value={opt.price}
                    onChange={(v) => updateOption(opt.id, { price: v })}
                    placeholder="$50"
                  />
                </div>

                {/* Notes */}
                <LabeledInput
                  label="Notes (Optional)"
                  value={opt.notes}
                  onChange={(v) => updateOption(opt.id, { notes: v })}
                  placeholder="Anything clients should know"
                />

                {/* Remove button when multiple options and more than 1 row */}
                {multipleOptions && options.length > 1 && (
                  <div className="flex justify-end">
                    <Button variant="ghost" onClick={() => removeOption(opt.id)}>
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* Add Option button only when multiple options is ON */}
            {multipleOptions && (
              <div className="w-full max-w-[512px]">
                <Button variant="outline" className="px-5 font-['Inter_Tight']" onClick={addOption}>
                  Add Option
                </Button>
              </div>
            )}

            {/* Actions */}
            <div className="w-full max-w-[512px] py-2 flex justify-end gap-3">
              <Button variant="secondary" onClick={handleDelete} className='font-["Inter_Tight"]'>
                Delete
              </Button>
              <Button onClick={handleSave} className="bg-black text-white font-['Inter_Tight'] hover:bg-black/90">
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
