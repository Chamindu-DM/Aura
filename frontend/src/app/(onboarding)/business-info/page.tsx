'use client';

import React, { useState } from 'react';
import Image from 'next/image'; 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import {getCookie} from "cookies-next";

export default function BusinessInfo() {
    const router = useRouter();
    const [salonName, setSalonName] = useState<string>("");
    const [salonLocation, setSalonLocation] = useState<string>("");
    
  // Handle navigation to next step
    const handleNext = async () => {
        if (!salonName.trim()) {
            toast.error("Please enter your salon name.");
            return;
        }
        if (!salonLocation.trim()){
            toast.error("Please enter your salon address.");
            return;
        }

        const authToken = getCookie("authToken");
        if(!authToken){
            toast.error("Authentication failed. Please log in again.");
            router.push('/login');
            return;
        }

        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/business-info`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    salonName,
                    salonLocation
                })
            });

            if(!res.ok){
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to save salon information');
            }

            //Store data in localStorage and navigate on success
            localStorage.setItem('salon-name', salonName);
            localStorage.setItem('salonLocation', salonLocation);

            toast.success("Salon profile created!");
            router.push('/setup-services');
        } catch (error) {
            console.error("Error updating salon profile:", error);
            toast.error("Failed to save salon information");
        }
    };

    return (
        <div data-layer="Onboarding Screen 2: Let's set up your salon profile" className="OnboardingScreen1WelcomeFirstThingsFirst py-10 bg-white flex flex-col justify-center items-center gap-10 min-h-screen">
            <div data-layer="Header Container" className="HeaderContainer self-stretch py-10 border-b border-black/10 flex flex-col justify-start items-center gap-10">
                <div data-layer="Title Container" className="TitleContainer w-full max-w-[800px] flex flex-col justify-start items-center gap-2">
                    <div data-layer="Title" className="Title self-stretch text-center justify-start text-gray-500 text-base font-medium font-['Inter_Tight'] leading-snug">Account setup</div>
                    <div data-layer="Subtitle" className="Subtitle self-stretch text-center justify-start text-black text-4xl font-bold font-['Inter_Tight'] leading-[48px] tracking-tight">Let's set up your salon profile</div>
                    <div data-layer="Form Description" className="FormDescription self-stretch text-center justify-start text-gray-500 text-base font-medium font-['Inter_Tight']">This will be the home for all your services and bookings.</div>
                    <div data-layer="Progress Bar Container" className="ProgressBarContainer w-full max-w-[512px] px-10 py-4 inline-flex justify-start items-start gap-2">
                
                <div data-layer="Progress Bar Segment" className="ProgressBarSegment flex-1 h-1 bg-black rounded-lg" />
                <div data-layer="Progress Bar Segment" className="ProgressBarSegment flex-1 h-1 bg-black rounded-lg" />
                <div data-layer="Progress Bar Segment" className="ProgressBarSegment flex-1 h-1 bg-gray-200 rounded-lg" />
            
            </div>
                </div>
            </div>

            <div data-layer="Form Container" className="FormContainer w-full max-w-[800px] px-10 py-4 flex flex-col justify-center items-start gap-10">
                {/* Salon Name Field */}
                <div data-layer="Input Container" className="InputContainer self-stretch flex flex-col justify-start items-start gap-4">
                    <div data-layer="Input Field" className="InputField self-stretch flex flex-col justify-start items-start gap-2">
                        <Label
                            htmlFor="salon-name"
                            className="text-black text-base font-medium font-['Inter_Tight'] leading-snug"
                        >
                            Salon name
                        </Label>
                        <Input 
                            id="salon-name"
                            type="text"
                            value={salonName}
                            onChange={(e) => setSalonName(e.target.value)}
                            placeholder="Enter your salon name"
                            className="min-h-11 px-3 py-2 bg-black/5 border-black/10 text-black text-base font-normal font-['Inter_Tight'] leading-snug tracking-wide"
                        />
                        <div data-layer="Validation message" className="ValidationMessage self-stretch justify-end text-gray-500 text-xs font-normal font-['Inter']">
                            This name will appear to clients and collaborators.
                        </div>
                    </div>

                    {/* Info Container */}
                    <div data-layer="Info Container" className="InfoContainer px-4 py-2 bg-black/5 rounded-lg border border-black/10 flex justify-start items-center gap-2">
                        <Image
                                                src = "/icons/info.svg"
                                                alt="Info icon"
                                                width={20}
                                                height={20}
                                                className="w-5 h-5"
                                                />
                        <div data-layer="Info Text" className="InfoText justify-start text-black text-xs font-medium font-['Inter_Tight'] tracking-tight">
                            Once your salon name is set, it can't be changed later, so choose carefully!
                        </div>
                    </div>
                </div>

                <div data-layer="Input Field" className="InputField self-stretch flex flex-col justify-start items-start gap-2">
                        <Label
                            htmlFor="salon-location"
                            className="text-black text-base font-medium font-['Inter_Tight'] leading-snug"
                        >
                            Salon location
                        </Label>
                        <Input 
                            id="salon-location"
                            type="text"
                            value={salonLocation}
                            onChange={(e) => setSalonLocation(e.target.value)}
                            placeholder="Enter your salon address"
                            className="min-h-11 px-3 py-2 bg-black/5 border-black/10 text-black text-base font-normal font-['Inter_Tight'] leading-snug tracking-wide"
                        />
                    </div>

                {/* Button Container */}
                <div data-layer="Button Container" className="ButtonContainer self-stretch flex justify-end items-center gap-4">
                    <button 
                        onClick={handleNext} 
                        className="PrimaryButton h-11 px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-lg flex justify-center items-center gap-2 transition-colors"
                    >
                        <span className="text-base font-medium font-['Inter_Tight']">Create Profile</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
