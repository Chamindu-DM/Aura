'use client';

import React, { useState } from 'react';
import Image from 'next/image'; 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function SetupServices() {
    const router = useRouter();
    const [serviceName, setServiceName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [multipleOptions, setMultipleOptions] = useState<boolean>(true);
    const [optionName, setOptionName] = useState<string>("");
    const [duration, setDuration] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [optionalDescription, setOptionalDescription] = useState<string>("");
    
    // Handle navigation to next step
    const handleSave = () => {
        if (!serviceName.trim()) {
            toast.error("Please enter a service name.");
            return;
        }

        // Store data in localStorage
        localStorage.setItem('service-data', JSON.stringify({
            serviceName,
            description,
            multipleOptions,
            optionName,
            duration,
            price,
            gender,
            optionalDescription
        }));

        toast.success("Service created successfully!");
        router.push('/dashboard');
    };

    const handleDelete = () => {
        toast.error("Service deleted");
        router.back();
    };

    return (
        <div data-layer="Onboarding Screen 3: Setup Services" className="OnboardingScreen3SetupServices py-10 bg-white flex flex-col justify-center items-center gap-10 min-h-screen">
            <div data-layer="Header Container" className="HeaderContainer self-stretch py-10 border-b border-black/10 flex flex-col justify-start items-center gap-10">
                <div data-layer="Title Container" className="TitleContainer w-full max-w-[800px] flex flex-col justify-start items-center gap-2">
                    <div data-layer="Title" className="Title self-stretch text-center justify-start text-gray-500 text-base font-medium font-['Inter_Tight'] leading-snug">Account setup</div>
                    <div data-layer="Subtitle" className="Subtitle self-stretch text-center justify-start text-black text-4xl font-bold font-['Inter_Tight'] leading-[48px] tracking-tight">Set up your services</div>
                    <div data-layer="Form Description" className="FormDescription self-stretch text-center justify-start text-gray-500 text-base font-medium font-['Inter_Tight']">Create and customize the services you offer to your clients.</div>
                    <div data-layer="Progress Bar Container" className="ProgressBarContainer w-full max-w-[512px] px-10 py-4 inline-flex justify-start items-start gap-2">
                        <div data-layer="Progress Bar Segment" className="ProgressBarSegment flex-1 h-0.5 bg-black rounded-lg" />
                        <div data-layer="Progress Bar Segment" className="ProgressBarSegment flex-1 h-0.5 bg-black rounded-lg" />
                        <div data-layer="Progress Bar Segment" className="ProgressBarSegment flex-1 h-0.5 bg-black rounded-lg" />
                        <div data-layer="Progress Bar Segment" className="ProgressBarSegment flex-1 h-0.5 bg-gray-200 rounded-lg" />
                    </div>
                </div>
            </div>

            <div data-layer="Simple Form" className="SimpleForm w-full max-w-[720px] p-6 relative bg-white rounded-2xl inline-flex flex-col justify-start items-center gap-6 overflow-hidden">
                <div data-layer="Service Name Input" className="ServiceNameInput w-full max-w-[512px] flex-1 inline-flex flex-col justify-start items-start gap-1">
                    <Label 
                              htmlFor='discription'
                              className="text-black text-base font-medium font-['Inter_Tight'] leading-snug"
                              >
                              Service name
                        </Label>
                    
                    <Input 
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        className="ServiceNameInput text-black text-3xl font-bold font-['Inter_Tight'] leading-loose bg-transparent px-3 py-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter service name"
                    />
                </div>
                        
                <div data-layer="FormRow" className="Formrow w-full max-w-[512px] inline-flex justify-start items-start gap-4">
                    <div data-layer="Input Labeled" className="InputLabeled flex-1 inline-flex flex-col justify-start items-start gap-1">
                        <Label 
                              htmlFor='discription'
                              className="text-black text-base font-medium font-['Inter_Tight'] leading-snug"
                              >
                              Description
                        </Label>
                        <Input 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="InputStandard self-stretch px-3 py-2 bg-neutral-600/10 rounded-lg outline-[1.50px] outline-offset-[-1.50px] outline-black/0 text-black text-base font-normal font-['Inter_Tight'] leading-tight"
                            placeholder="Classic Haircut"
                        />
                    </div>
                </div>
                        
                <div data-layer="FormRow" className="Formrow w-full max-w-[512px] inline-flex justify-start items-start gap-4">
                    <div data-layer="Input Labeled" className="InputLabeled flex-1 inline-flex flex-col justify-start items-start gap-1">
                        <div data-layer="Duration Label" className="DurationLabel self-stretch justify-start text-black text-base font-medium font-['Inter_Tight'] leading-snug">Duration</div>
                        <Input 
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="InputStandard self-stretch px-3 py-2 bg-neutral-600/10 rounded-lg outline-[1.50px] outline-offset-[-1.50px] outline-black/0 text-black text-base font-normal font-['Inter_Tight'] leading-tight"
                            placeholder="30 min - 1hr"
                        />
                    </div>
                    <div data-layer="Input Labeled" className="InputLabeled flex-1 inline-flex flex-col justify-start items-start gap-1">
                        <div data-layer="Price Label" className="PriceLabel self-stretch justify-start text-black text-base font-medium font-['Inter_Tight'] leading-snug">Price</div>
                        <Input 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="InputStandard self-stretch px-3 py-2 bg-neutral-600/10 rounded-lg outline-[1.50px] outline-offset-[-1.50px] outline-black/0 text-black text-base font-normal font-['Inter_Tight'] leading-tight"
                            placeholder="$50"
                        />
                    </div>
                </div>
                        
                <div data-layer="FormRow" className="Formrow w-full max-w-[512px] inline-flex justify-start items-start gap-4">
                    <div data-layer="Input Labeled" className="InputLabeled flex-1 inline-flex flex-col justify-start items-start gap-1">
                        <div data-layer="Gender Label" className="GenderLabel self-stretch justify-start text-black text-base font-medium font-['Inter_Tight'] leading-snug">Gender</div>
                        <div data-layer="Gender Container" className="GenderContainer self-stretch flex flex-col justify-center items-start gap-2">
                            <div data-layer="Gender Description" className="GenderDescription justify-start text-gray-500 text-base font-medium font-['Inter_Tight'] leading-snug">Choose the target gender for this service</div>
                                    
                            <RadioGroup value={gender} onValueChange={setGender} className="w-full">
                                <div data-layer="Gender Options Container" className="GenderOptionsContainer inline-flex justify-start items-start gap-8">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="male" id="male" />
                                        <Label htmlFor="male" className="text-black text-base font-normal font-['Inter_Tight'] leading-snug tracking-wide cursor-pointer">
                                            Male only
                                        </Label>
                                    </div>
                                            
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="female" id="female" />
                                        <Label htmlFor="female" className="text-black text-base font-normal font-['Inter_Tight'] leading-snug tracking-wide cursor-pointer">
                                            Female only
                                        </Label>
                                    </div>
                                            
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="unisex" id="unisex" />
                                        <Label htmlFor="unisex" className="text-black text-base font-normal font-['Inter_Tight'] leading-snug tracking-wide cursor-pointer">
                                            Unisex
                                        </Label>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </div>
                
                <div data-layer="Enable Multiple Options Toggle" className="EnableMultipleOptionsToggle w-full max-w-[512px] inline-flex justify-start items-center gap-4">
                    <div data-layer="Enable Multiple Options Label" className="EnableMultipleOptionsLabel justify-start text-black/90 text-xs font-medium font-['Inter_Tight'] tracking-tight">Enable Multiple Options</div>
                    
                    <Switch 
                        checked={multipleOptions}
                        onCheckedChange={setMultipleOptions}
                    />
                </div>
                
                {multipleOptions && (
                    <div data-layer="Options Container" className="OptionsContainer w-full max-w-[512px] p-4 rounded-2xl outline-1 outline-offset-[-1px] outline-black/20 flex flex-col justify-start items-start gap-6">
                        <div data-layer="Option Container" className="OptionContainer w-full max-w-[512px] inline-flex justify-center items-center gap-2">
                            <div data-layer="Option Label" className="OptionLabel flex-1 justify-start text-black/90 text-base font-bold font-['Inter_Tight']">Option 1</div>
                        </div>
                        
                        <div data-layer="FormRow" className="Formrow w-full max-w-[512px] inline-flex justify-start items-start gap-4">
                            <div data-layer="Input Labeled" className="InputLabeled flex-1 inline-flex flex-col justify-start items-start gap-1">
                                <div data-layer="Option Name Label" className="OptionNameLabel self-stretch justify-start text-black text-base font-medium font-['Inter_Tight'] leading-snug">Option Name</div>
                                <Input 
                                    value={optionName}
                                    onChange={(e) => setOptionName(e.target.value)}
                                    className="InputStandard self-stretch px-3 py-2 bg-neutral-600/10 rounded-lg outline-[1.50px] outline-offset-[-1.50px] outline-black/0 text-black text-base font-normal font-['Inter_Tight'] leading-tight"
                                    placeholder="Classic Haircut"
                                />
                            </div>
                        </div>
                        
                        <div data-layer="FormRow" className="Formrow w-full max-w-[512px] inline-flex justify-start items-start gap-4">
                            <div data-layer="Input Labeled" className="InputLabeled flex-1 inline-flex flex-col justify-start items-start gap-1">
                                <div data-layer="Duration Label" className="DurationLabel self-stretch justify-start text-black text-base font-medium font-['Inter_Tight'] leading-snug">Duration</div>
                                <Input 
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="InputStandard self-stretch px-3 py-2 bg-neutral-600/10 rounded-lg outline-[1.50px] outline-offset-[-1.50px] outline-black/0 text-black text-base font-normal font-['Inter_Tight'] leading-tight"
                                    placeholder="30 min - 1hr"
                                />
                            </div>
                            <div data-layer="Input Labeled" className="InputLabeled flex-1 inline-flex flex-col justify-start items-start gap-1">
                                <div data-layer="Price Label" className="PriceLabel self-stretch justify-start text-black text-base font-medium font-['Inter_Tight'] leading-snug">Price</div>
                                <Input 
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="InputStandard self-stretch px-3 py-2 bg-neutral-600/10 rounded-lg outline-[1.50px] outline-offset-[-1.50px] outline-black/0 text-black text-base font-normal font-['Inter_Tight'] leading-tight"
                                    placeholder="$50"
                                />
                            </div>
                        </div>
                        
                        <div data-layer="FormRow" className="Formrow w-full max-w-[512px] inline-flex justify-start items-start gap-4">
                            <div data-layer="Input Labeled" className="InputLabeled flex-1 inline-flex flex-col justify-start items-start gap-1">
                                <div data-layer="Gender Label" className="GenderLabel self-stretch justify-start text-black text-base font-medium font-['Inter_Tight'] leading-snug">Gender</div>
                                <div data-layer="Gender Container" className="GenderContainer self-stretch flex flex-col justify-center items-start gap-2">
                                    <div data-layer="Gender Description" className="GenderDescription justify-start text-gray-500 text-base font-medium font-['Inter_Tight'] leading-snug">Choose the target gender for this service</div>
                                    
                                    <RadioGroup value={gender} onValueChange={setGender} className="w-full">
                                        <div data-layer="Gender Options Container" className="GenderOptionsContainer inline-flex justify-start items-start gap-8">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="male" id="male-option" />
                                                <Label htmlFor="male-option" className="text-black text-base font-normal font-['Inter_Tight'] leading-snug tracking-wide cursor-pointer">
                                                    Male only
                                                </Label>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="female" id="female-option" />
                                                <Label htmlFor="female-option" className="text-black text-base font-normal font-['Inter_Tight'] leading-snug tracking-wide cursor-pointer">
                                                    Female only
                                                </Label>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="unisex" id="unisex-option" />
                                                <Label htmlFor="unisex-option" className="text-black text-base font-normal font-['Inter_Tight'] leading-snug tracking-wide cursor-pointer">
                                                    Unisex
                                                </Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>
                        
                        <div data-layer="FormRow" className="Formrow w-full max-w-[512px] inline-flex justify-start items-start gap-4">
                            <div data-layer="Input Labeled" className="InputLabeled flex-1 inline-flex flex-col justify-start items-start gap-1">
                                <div data-layer="Optional Description Label" className="OptionalDescriptionLabel self-stretch justify-start text-black text-base font-medium font-['Inter_Tight'] leading-snug">Description (Optional)</div>
                                <Input 
                                    value={optionalDescription}
                                    onChange={(e) => setOptionalDescription(e.target.value)}
                                    className="InputStandard self-stretch px-3 py-2 bg-neutral-600/10 rounded-lg outline-[1.50px] outline-offset-[-1.50px] outline-black/0 text-black text-base font-normal font-['Inter_Tight'] leading-tight"
                                    placeholder="Briefly describe the service"
                                />
                            </div>
                        </div>
                        <div data-layer="Tasks" className="Tasks w-full max-w-[512px] flex flex-col justify-start items-start gap-2">
                    <Button className="AddOptionButton px-5 py-2 bg-white rounded-lg outline-1 outline-offset-[-1px] outline-gray-300 inline-flex justify-center items-center gap-2">
                        <div data-layer="Plus" className="Plus w-6 h-6 relative overflow-hidden">
                            <div data-layer="Vector" className="Vector w-4 h-4 left-[3px] top-[3px] absolute bg-black" />
                        </div>
                        <div data-layer="See All Button Text" className="SeeAllButtonText text-right justify-start text-black text-base font-medium font-['Inter_Tight'] leading-snug">Add Option</div>
                    </Button>
                </div>
                    </div>
                )}
                
                
                
                <div data-layer="Submit Button Container" className="SubmitButtonContainer w-full max-w-[512px] py-2 inline-flex justify-end items-center gap-3">
                    <Button 
                        onClick={handleDelete}
                        className="CancelButton px-5 py-2 bg-rose-200 rounded-lg flex justify-center items-center gap-2"
                    >
                        <Image src="/icons/trash.svg" alt="Delete" width={24} height={24} className="w-6 h-6" />
                        <div data-layer="See All Button Text" className="SeeAllButtonText text-right justify-start text-red-600 text-base font-medium font-['Inter_Tight'] leading-snug">Delete</div>
                    </Button>
                    <Button 
                        onClick={handleSave}
                        className="SaveButton px-5 py-2 bg-black rounded-lg flex justify-center items-center gap-2"
                    >
                        <div data-layer="See All Button Text" className="SeeAllButtonText text-right justify-start text-white text-base font-medium font-['Inter_Tight'] leading-snug">Save</div>
                    </Button>
                </div>
            </div>
        </div>
    );
}
