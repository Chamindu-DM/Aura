'use client';

import Image from "next/image";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { getCookie } from "cookies-next";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent)=>{
    if(event.key === 'Enter'){
            handleContinue();
        }
    }
    document.addEventListener('keydown', handleKeyPress);
    return () => {
        document.removeEventListener('keydown', handleKeyPress);
    };
  }, [email, password]);

    const handleContinue = async () => {
        setIsLoading(true);

        if(!email.trim() || !password.trim()) {
            toast.error("Please enter both email and password.");
            setIsLoading(false);
            return;
        }

        try {
            // This endpoint will ONLY handle login for existing users.
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Login failed. Please check your email and password.');
            }

            const data = await res.json();
            if (data.token) {
                document.cookie = `authToken=${data.token}; path=/; max-age=${3600*24*7};`;
            }

            toast.success("Login successful!");
            if(data.onboardingCompleted){
                router.push('/dashboard');
            }else{
                router.push('/welcome');
            }

        } catch (error) {
            console.error('Login failed:', error);
            if (error instanceof Error) toast.error(error.message);
            else toast.error("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };


  return (
    <div data-layer="Sign in/up-for professionals" className="SignInUpForProfessionals w-full h-screen bg-white inline-flex justify-center items-start overflow-hidden">
    <div data-layer="Form Container" className="FormContainer w-1/2 max-w-screen-md flex-1 self-stretch px-10 pb-2 inline-flex flex-col justify-center items-center overflow-hidden">
        <div data-layer="Form" className="Form self-stretch max-w-[600px] flex-1 pt-14 flex flex-col justify-center items-center gap-8">
            <div data-layer="Header Container" className="HeaderContainer self-stretch flex flex-col justify-start items-start gap-1">
                <div data-layer="Subtitle" className="Subtitle self-stretch text-center justify-start text-Labels-Primary text-3xl font-semibold font-['Inter_Tight'] leading-[48px] tracking-tight">AURA for professionals</div>
                <div data-layer="Form Description" className="FormDescription self-stretch text-center justify-start text-Labels-Secondary/60 text-base font-medium font-['Inter_Tight']">Create an account or log in to manage your business.</div>
            </div>
            <div data-layer="Form Fields Container" className="FormFieldsContainer self-stretch flex flex-col justify-start items-start gap-6">
                <div data-layer="Email Input Container" className="EmailInputContainer self-stretch px-20 flex flex-col justify-start items-center gap-4">
                    <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="self-stretch min-h-11 px-3 py-2 bg-black/5 rounded-lg border-0  font-normal font-['Inter_Tight'] leading-snug tracking-wide text-black" 
                    />
                    <Input
                    type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    className="self-stretch min-h-11 px-3 py-2 bg-black/5 rounded-lg border-0  font-normal font-['Inter_Tight'] leading-snug tracking-wide text-black"
                    />

                    <Button 
                        onClick={handleContinue}
                        disabled={isLoading || !email || !password}
                        className="SubmitButton self-stretch h-11 px-5 py-2 rounded-lg inline-flex justify-center items-center gap-2 text-base font-medium font-['Inter_Tight']"
                    >
                        {isLoading ? "Loading..." : "Sign In"}
                    </Button>
                </div>
                <div data-layer="Divider Container" className="DividerContainer self-stretch px-20 inline-flex justify-center items-center gap-2">
                    <div data-layer="Divider Left" className="DividerLeft flex-1 h-px relative bg-gray-200" />
                    <div data-layer="Form Description" className="FormDescription text-center justify-start text-Labels-Secondary/60 text-base font-medium font-['Inter_Tight']">or</div>
                    <div data-layer="Divider Right" className="DividerRight flex-1 h-px relative bg-gray-200" />
                </div>
                <div data-layer="Social Buttons Container" className="SocialButtonsContainer self-stretch px-20 inline-flex justify-center items-center gap-4">
                    
                    <Button variant="outline" className="SocialButtonsContainer self-stretch h-11 flex-1 relative">
                    <Image
                        src="/icons/google.svg" 
                        width={24}
                        height={24}
                        alt="google logo"
                        priority
                    />
                    </Button>
                    <Button variant="outline" className="SocialButtonsContainer self-stretch h-11 flex-1 relative">
                    <Image
                        src="/icons/apple.svg" 
                        width={24}
                        height={24}
                        alt="apple logo"
                        priority
                    />
                    </Button>
                    <Button variant="outline" className="SocialButtonsContainer self-stretch h-11 flex-1 relative">
                    <Image
                        src="/icons/facebook.svg" 
                        width={24}
                        height={24}
                        alt="facebook logo"
                        priority
                    />
                    </Button>
                    
                </div>
                <div className="w-full text-center mt-4">
                    <span className="text-gray-600 font-medium font-['Inter_Tight']">Don't have an account? </span>
                    <Link href="/signup" className="text-blue-600 hover:underline font-medium font-['Inter_Tight'] px-1">Sign up</Link>
                </div>
            </div>
            <div data-layer="Footer Container" className="FooterContainer self-stretch flex flex-col justify-center items-center">
                <div data-layer="Form Description" className="FormDescription self-stretch text-center justify-start text-gray-600 font-medium font-['Inter_Tight']">Are you a customer looking to book an appointment?</div>
                <Button variant="link">
                <div data-layer="Language Text" className="LanguageText text-center justify-start text-blue-600 text-base font-medium font-['Inter_Tight']">Go to AURA for customers</div>
                </Button>
            </div>
            <div data-layer="Language Selector" className="LanguageSelector max-w-[600px] py-2 inline-flex w-full justify-center items-center">
                <Button variant="link">
                    <Image
                        src="/icons/globe.svg"
                        width={20}
                        height={20}
                        alt=""
                        priority
                    />
                    <div data-layer="Language Text" className="LanguageText text-center justify-start text-blue-600 text-sm font-normal font-['Inter_Tight']">English</div>
                </Button>
                <Button variant="link">
                    <Image
                        src="/icons/tube.svg"
                        width={20}
                        height={20}
                        alt=""
                        priority
                    />
                    <div data-layer="Language Text" className="LanguageText text-center justify-start text-blue-600 text-sm font-normal font-['Inter_Tight']">Help and support</div>
                </Button>
            </div>
        </div>
    </div>
    <div data-layer="Logo Container" className="LogoContainer w-1/2 self-stretch bg-gradient-to-b from-rose-100 to-white inline-flex flex-col justify-end items-center gap-2 overflow-hidden">
        <div data-layer="Logo Background Container" className="LogoBackgroundContainer self-stretch flex-1 p-28 relative flex flex-col justify-center items-center gap-2">
            <div data-layer="Logo Text" data-property-1="Default" className="LogoText self-stretch h-32 relative flex items-center justify-center">
              <Image
                src="/images/logoText.png" 
                width={500}
                height={128}
                alt="Aura logo"
                priority
              />
            </div>
            <div data-layer="Ellipse 2100" className="Ellipse2100 w-96 h-96 left-[-185px] top-[-234px] absolute bg-orange-600/70 rounded-full blur-[200px]" />
            <div data-layer="Ellipse 2101" className="Ellipse2101 w-[471px] h-[471px] left-[468px] top-[828px] absolute bg-yellow-400 rounded-full blur-[200px]" />
        </div>
    </div>
</div>
  );
}
