'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Plus, Minus} from 'lucide-react';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Toggle } from "@/components/ui/toggle"
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Input } from '@/components/ui/input';
import { useRef} from "react";

export default function Welcome() {
    const router = useRouter();
  const [teamSize, setTeamSize] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleService = (service: string)=>{
    setSelectedServices(prev => prev.includes(service) ? prev.filter(s => s !== service)
: [...prev,service]);
  };

    //Function to trigger the hidden file input
    const handlePictureChangeClick = () => {
        fileInputRef.current?.click();
    };

    //Function to handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePic((e.target.files[0]));
        }
    };

  // Handle navigation to the next step
  const handleNext = async ()=>{
    console.log("Selected team size:", teamSize);
    console.log("Selected services:", selectedServices);

    if(!firstName.trim())
    {
        toast.error("Please enter your first name.");
        return;
    }

    if(!lastName.trim())
    {
        toast.error("Please enter your last name.");
        return;
    }

    if (selectedServices.length === 0) {
        toast.error("Please select at least one service that describes what you do.");
        return;
    }

    if (!teamSize) {
        toast.error("Please select your team size.");
        return;
    }

    const authToken = localStorage.getItem('authToken');
      if(!authToken){
          toast.error("Authentication failed. Please log in again.");
          return;
      }

    console.log("Selected team size:", teamSize);
    console.log("Selected services:", selectedServices);

    // Store data in localStorage or state management
    localStorage.setItem('first-name', firstName);
    localStorage.setItem('last-name', lastName);
    localStorage.setItem('onboarding-services', JSON.stringify(selectedServices));
    localStorage.setItem('onboarding-team-size', teamSize);

    try {
        //Step 1: upload the profile picture if one is selected
        if (profilePic) {
            const formData = new FormData();
            formData.append('profilePic', profilePic);
            formData.append('firstName', firstName);

            const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/picture`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ${authToken}'
                },
                body: formData
            });
            if (!uploadRes.ok) {
                const errorData = await uploadRes.json();
                throw new Error(errorData.message || 'Failed to upload profile picture.');
            }
        }

        // Step 2: Update other profile information
        const res= await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ${authToken}'
            },
            body:JSON.stringify({
                firstName,
                lastName,
                selectedServices,
                teamSize
            })
        });

        if (!res.ok){
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to save profile information.');
        }

        // Both requests succeeded, redirect to the next step
        toast.success("Profile information saved!");
        router.push('/business-info');
    } catch (error){
        console.error("Error updating profile:", error);
        toast.error("Failed to save profile information.");
    }
  };

  return (
    <div data-layer="Onboarding Screen 1: Welcome! First Things First..." className="OnboardingScreen1WelcomeFirstThingsFirst py-10 bg-white flex flex-col justify-center items-center gap-10 min-h-screen">
    <div data-layer="Header Container" className="HeaderContainer self-stretch py-10 border-b border-black/10 flex flex-col justify-start items-center gap-10">
        <div data-layer="Title Container" className="TitleContainer w-full max-w-[800px] flex flex-col justify-start items-center gap-2">
            <div data-layer="Title" className="Title self-stretch text-center justify-start text-gray-500 text-base font-medium font-['Inter_Tight'] leading-snug">Account setup</div>
            <div data-layer="Subtitle" className="Subtitle self-stretch text-center justify-start text-black text-4xl font-bold font-['Inter_Tight'] leading-[48px] tracking-tight">Welcome! First things first...</div>
            <div data-layer="Form Description" className="FormDescription self-stretch text-center justify-start text-gray-500 text-base font-medium font-['Inter_Tight']">Create your profile to personalize how you'll appear to clients and team members.</div>
            <div data-layer="Progress Bar Container" className="ProgressBarContainer w-full max-w-[512px] px-10 py-4 inline-flex justify-start items-start gap-2">

                <div data-layer="Progress Bar Segment" className="ProgressBarSegment flex-1 h-1 bg-black rounded-lg" />
                <div data-layer="Progress Bar Segment" className="ProgressBarSegment flex-1 h-1 bg-gray-200 rounded-lg" />
                <div data-layer="Progress Bar Segment" className="ProgressBarSegment flex-1 h-1 bg-gray-200 rounded-lg" />

            </div>
        </div>
    </div>
    <div data-layer="Form Container" className="FormContainer w-full max-w-[800px] px-10 py-4 inline-flex justify-center items-start gap-10">
        <div data-layer="Profile Picture Container" className="ProfilePictureContainer inline-flex flex-col justify-start items-center gap-2">
            <div data-layer="Profile Picture"
                 data-show-profile-photo="off"
                 className="ProfilePicture w-24 h-24 bg-black/20 rounded-2xl outline-1 outline-black/10 flex flex-col justify-center items-center gap-2 overflow-hidden"
            >
                {profilePic ? (
                    <Image
                        src={URL.createObjectURL(profilePic)}
                        alt="Profile Preview"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div data-layer="BM" className="Bm text-center justify-start text-black text-base font-bold font-['Inter_Tight'] leading-snug">BM</div>
                )}

            </div>
            <div data-layer="Change Picture Button"
                 className="ChangePictureButton text-center justify-start text-black text-xs font-normal font-['Inter'] underline cursor-pointer"
                 onClick={handlePictureChangeClick}
            >
                Change
            </div>
            {/* Hidden file input for profile picture */}
            <input
            type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
        <div data-layer="Form Fields Container" className="FormFieldsContainer flex-1 inline-flex flex-col justify-center items-start gap-10">

            <div data-layer="Name Fields Container" className="NameFieldsContainer self-stretch inline-flex justify-start items-start gap-6">
                {/* First Name Field */}
                <div data-layer="Input Field" className="InputField flex-1 inline-flex flex-col justify-start items-start gap-2">
                    <Label
                        htmlFor="first-name"
                        className="text-black text-base font-medium font-['Inter_Tight'] leading-snug"
                    >
                        First name
                    </Label>
                    <Input
                        id="first-name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        className="min-h-11 px-3 py-2 bg-black/5 border-black/10 text-black placeholder:text-gray-500 text-base font-normal font-['Inter_Tight'] leading-snug tracking-wide"
                    />
                </div>

                {/* Last Name Field */}
                <div data-layer="Input Field" className="InputField flex-1 inline-flex flex-col justify-start items-start gap-2">
                    <Label
                        htmlFor="last-name"
                        className="text-black text-base font-medium font-['Inter_Tight'] leading-snug"
                    >
                        Last name
                    </Label>
                    <Input
                        id="last-name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                        className="min-h-11 px-3 py-2 bg-black/5 border-black/10 text-black placeholder:text-gray-500 text-base font-normal font-['Inter_Tight'] leading-snug tracking-wide"
                    />
                </div>
            </div>

            <div data-layer="Question Container" className="QuestionContainer self-stretch flex flex-col justify-start items-start gap-4">
                <div data-layer="Label" className="Label self-stretch justify-start text-black text-base font-medium font-['Inter_Tight']">What best describes what you do?</div>
                <div data-layer="Options Container" className="OptionsContainer self-stretch inline-flex justify-start items-start gap-4 flex-wrap content-start">

                    <Toggle
                        pressed={selectedServices.includes('hairdresser')}
                        onPressedChange={() => toggleService('hairdresser')}
                        className="h-9 px-4 py-2 rounded-3xl data-[state=on]:bg-black data-[state=on]:text-white data-[state=off]:bg-gray-200 data-[state=off]:text-black flex items-center gap-2"
                    >
                        {selectedServices.includes('hairdresser') ? (
                            <Minus className="w-4 h-4" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                        <span className="text-base font-medium font-['Inter_Tight'] leading-snug">Hairdresser</span>
                    </Toggle>

                    <Toggle
                        pressed={selectedServices.includes('beautician')}
                        onPressedChange={() => toggleService('beautician')}
                        className="h-9 px-4 py-2 rounded-3xl data-[state=on]:bg-black data-[state=on]:text-white data-[state=off]:bg-gray-200 data-[state=off]:text-black flex items-center gap-2"
                    >
                        {selectedServices.includes('beautician') ? (
                            <Minus className="w-4 h-4" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                        <span className="text-base font-medium font-['Inter_Tight'] leading-snug">Beautician</span>
                    </Toggle>

                    <Toggle
                        pressed={selectedServices.includes('trainer')}
                        onPressedChange={() => toggleService('trainer')}
                        className="h-9 px-4 py-2 rounded-3xl data-[state=on]:bg-black data-[state=on]:text-white data-[state=off]:bg-gray-200 data-[state=off]:text-black flex items-center gap-2"
                    >
                        {selectedServices.includes('trainer') ? (
                            <Minus className="w-4 h-4" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                        <span className="text-base font-medium font-['Inter_Tight'] leading-snug">Trainer</span>
                    </Toggle>

                    <Toggle
                        pressed={selectedServices.includes('masseur')}
                        onPressedChange={() => toggleService('masseur')}
                        className="h-9 px-4 py-2 rounded-3xl data-[state=on]:bg-black data-[state=on]:text-white data-[state=off]:bg-gray-200 data-[state=off]:text-black flex items-center gap-2"
                    >
                        {selectedServices.includes('masseur') ? (
                            <Minus className="w-4 h-4" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                        <span className="text-base font-medium font-['Inter_Tight'] leading-snug">Masseur</span>
                    </Toggle>

                    <Toggle
                        pressed={selectedServices.includes('salon-owner')}
                        onPressedChange={() => toggleService('salon-owner')}
                        className="h-9 px-4 py-2 rounded-3xl data-[state=on]:bg-black data-[state=on]:text-white data-[state=off]:bg-gray-200 data-[state=off]:text-black flex items-center gap-2"
                    >
                        {selectedServices.includes('salon-owner') ? (
                            <Minus className="w-4 h-4" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                        <span className="text-base font-medium font-['Inter_Tight'] leading-snug">Salon Owner</span>
                    </Toggle>

                    <Toggle
                        pressed={selectedServices.includes('other')}
                        onPressedChange={() => toggleService('other')}
                        className="h-9 px-4 py-2 rounded-3xl data-[state=on]:bg-black data-[state=on]:text-white data-[state=off]:bg-gray-200 data-[state=off]:text-black flex items-center gap-2"
                    >
                        {selectedServices.includes('other') ? (
                            <Minus className="w-4 h-4" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                        <span className="text-base font-medium font-['Inter_Tight'] leading-snug">Other</span>
                    </Toggle>

                </div>
            </div>
            <div data-layer="Question Container" className="QuestionContainer self-stretch flex flex-col justify-start items-start gap-4">
                <div data-layer="Question Text" className="QuestionText self-stretch justify-start text-black text-base font-medium font-['Inter_Tight']">Who will you use AURA with?</div>

                <RadioGroup value={teamSize} onValueChange={setTeamSize} className="w-full">
                    <div data-layer="Options Container" className="OptionsContainer self-stretch grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div data-layer="Option Group" className="OptionGroup space-y-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="myself" id="myself" />
                                <Label htmlFor="myself" className="text-black text-base font-normal font-['Inter_Tight'] leading-snug tracking-wide cursor-pointer">
                                    Just Myself
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="small" id="small" />
                                <Label htmlFor="small" className="text-black text-base font-normal font-['Inter_Tight'] leading-snug tracking-wide cursor-pointer">
                                    Small Team (1-5 People)
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="growing" id="growing" />
                                <Label htmlFor="growing" className="text-black text-base font-normal font-['Inter_Tight'] leading-snug tracking-wide cursor-pointer">
                                    Growing Team (5-20 People)
                                </Label>
                            </div>
                        </div>

                        <div data-layer="Option Group" className="OptionGroup space-y-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="medium" id="medium" />
                                <Label htmlFor="medium" className="text-black text-base font-normal font-['Inter_Tight'] leading-snug tracking-wide cursor-pointer">
                                    Medium Team (20-100 People)
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="large" id="large" />
                                <Label htmlFor="large" className="text-black text-base font-normal font-['Inter_Tight'] leading-snug tracking-wide cursor-pointer">
                                    Large Team (100+ People)
                                </Label>
                            </div>
                        </div>
                    </div>
                </RadioGroup>

                <div data-layer="Info Container" className="InfoContainer self-stretch px-4 py-2 bg-black/5 rounded-lg outline-1 outline-offset-[-1px] outline-black/10 inline-flex justify-start items-center gap-2 overflow-hidden">
                    <div data-layer="Info Icon" className="InfoIcon w-6 h-6 relative overflow-hidden">
                        <Image
                        src = "/icons/info.svg"
                        alt="Info icon"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                        />
                    </div>
                    <div data-layer="Info Text" className="InfoText flex-1 justify-start text-black text-xs font-medium font-['Inter_Tight'] tracking-tight">If you're collaborating with others, don't worry—you can easily add them to your team later through the dashboard.</div>
                </div>
            </div>
            <div data-layer="Button Container" className="ButtonContainer self-stretch inline-flex justify-end items-center gap-4">
                <Button
                    onClick={handleNext}
                    className="h-11 px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-base font-medium font-['Inter_Tight'] flex items-center gap-2"
                >
                    Next: Set Up Your Salon Profile
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    </div>
</div>
);
}
