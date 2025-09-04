'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { getCookie } from 'cookies-next';

// This is a helper component for the labeled input fields.
function LabeledInput({
                          label,
                          value,
                          onChange,
                          placeholder,
                      }: Readonly<{
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
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
    );
}

type Option = {
    id: string;
    name: string;
    duration: string;
    price: string;
    notes: string;
};

// Generates a new unique option object.
const newOption = (): Option => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    duration: '',
    price: '',
    notes: '',
});

export default function SetupServices() {
    const router = useRouter();

    const [serviceName, setServiceName] = useState('');
    const [description, setDescription] = useState('');
    const [multipleOptions, setMultipleOptions] = useState(true);
    const [options, setOptions] = useState<Option[]>([newOption()]);
    const [isClient, setIsClient] = useState(false);

    // --- Route Guard: Check for authentication on component load. ---
    useEffect(() => {
        setIsClient(true);
        const authToken = getCookie('authToken');

        if (!authToken) {
            toast.error("You must be logged in to view this page.");
            router.push('/login');
        }
    }, [router]);
    // --- End of Route Guard ---

    const addOption = () => setOptions((opts) => [...opts, newOption()]);
    const updateOption = (id: string, patch: Partial<Option>) =>
        setOptions((opts) => opts.map((o) => (o.id === id ? { ...o, ...patch } : o)));
    const removeOption = (id: string) =>
        setOptions((opts) => (opts.length > 1 ? opts.filter((o) => o.id !== id) : opts));

    const handleSave = async () => {
        if (!serviceName.trim()) {
            toast.error('Please enter a service name.');
            return;
        }

        const hasValidOptions = options.some(opt => opt.name.trim() && opt.duration.trim() && opt.price.trim());
        if (!hasValidOptions) {
            toast.error('Please fill in at least one service option (name, duration, and price).');
            return;
        }

        const authToken = getCookie('authToken');
        if (!authToken) {
            toast.error('Authentication failed. Please log in again.');
            router.push('/login');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    serviceName,
                    description,
                    multipleOptions,
                    options,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to save service information.');
            }

            toast.success('Service created successfully!');
            localStorage.setItem(
                'service-data',
                JSON.stringify({
                    serviceName,
                    description,
                    multipleOptions,
                    options,
                })
            );
            router.push('/dashboard');
        } catch (error) {
            console.error("Error saving service information:", error);
            toast.error('Failed to save service information.');
        }
    };

    const handleDelete = () => {
        toast.error('Service deleted');
        router.back();
    };

    // Conditionally render the component only on the client side after the auth check.
    if (!isClient) {
        return null; // or a loading spinner
    }

    return (
        <div className="py-10 bg-white flex flex-col items-center gap-10 min-h-screen">
            <div className="self-stretch py-10 border-b border-black/10 flex flex-col items-center gap-2">
                <div className="w-full max-w-[800px] flex flex-col items-center gap-2">
                    <div className="text-gray-500 text-base font-medium leading-snug font-['Inter_tight']">Account setup</div>
                    <div className="text-black text-4xl font-bold leading-[48px] font-['Inter_Tight'] tracking-tight">Set up your services</div>
                    <div className="text-gray-500 text-base font-medium font-['Inter_Tight']">Create and customize the services you offer.</div>
                </div>
                <div data-layer="Progress Bar Container" className="ProgressBarContainer w-full max-w-[512px] px-10 py-4 inline-flex justify-start items-start gap-2">
                    <div data-layer="Progress Bar Segment" className="ProgressBarSegment flex-1 h-1 bg-black rounded-lg" />
                    <div data-layer="Progress Bar Segment" className="ProgressBarSegment flex-1 h-1 bg-black rounded-lg" />
                    <div data-layer="Progress Bar Segment" className="ProgressBarSegment flex-1 h-1 bg-black rounded-lg" />
                </div>
            </div>

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
                                placeholder="Ru. 500"
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
                            <div className="flex justify-end font-['Inter_Tight']">
                                <Button variant="outline" onClick={() => removeOption(opt.id)}>
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
    );
}