'use client';

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X } from 'phosphor-react';

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [passwordValidations, setPasswordValidations] = useState({
        minLength: false,
        hasLowercase: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecial: false,
        passwordsMatch: false,
    });

    const validatePassword = (pw: string, confirmPw?: string) => {
        const confirmPassword = confirmPw !== undefined ? confirmPw : confirmPassword;

        const validations = {
            minLength: pw.length >= 8,
            hasLowercase: /[a-z]/.test(pw),
            hasUppercase: /[A-Z]/.test(pw),
            hasNumber: /[0-9]/.test(pw),
            hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(pw),
            passwordsMatch: pw === confirmPassword && pw.length > 0 && confirmPassword.length > 0,
        };

        setPasswordValidations(validations);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword, confirmPassword);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        validatePassword(password, newConfirmPassword);
    };

    const getFailedValidations = () => {
        const failed = [];

        if (!passwordValidations.minLength) {
            failed.push("Password must be at least 8 characters long");
        }
        if (!passwordValidations.hasLowercase) {
            failed.push("Password must contain at least one lowercase letter");
        }
        if (!passwordValidations.hasUppercase) {
            failed.push("Password must contain at least one uppercase letter");
        }
        if (!passwordValidations.hasNumber) {
            failed.push("Password must contain at least one number");
        }
        if (!passwordValidations.hasSpecial) {
            failed.push("Password must contain at least one special character");
        }
        if (!passwordValidations.passwordsMatch && confirmPassword.length > 0) {
            failed.push("Passwords do not match");
        }

        return failed;
    };

    const handleSignup = async () => {
        setIsLoading(true);

        // Check for empty fields
        if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
            toast.error("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        // Get all failed validations
        const failedValidations = getFailedValidations();

        if (failedValidations.length > 0) {
            // Show the first failed validation as toast message
            toast.error(failedValidations[0]);
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Sign-up failed.');
            }

            const data = await res.json();
            if (data.token) {
                document.cookie = `authToken=${data.token}; path=/; max-age=${3600*24*7};`;
            }

            toast.success("Account created successfully!");
            router.push('/welcome');

        } catch (error) {
            console.error('Sign-up failed:', error);
            if (error instanceof Error) toast.error(error.message);
            else toast.error("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper component to render validation rules with dynamic icons
    const ValidationItem = ({label, isValid}: {label: string, isValid: boolean}) => (
        <li className="flex items-center gap-2 text-sm font-medium">
            {isValid ? (
                <Check className="w-4 h-4 text-green-500" />
            ) : (
                <X className="w-4 h-4 text-red-500" />
            )}
            <span className={isValid ? "text-green-500" : "text-gray-500"}>{label}</span>
        </li>
    );

    // Check if all validations pass
    const allValidationsPassed = Object.values(passwordValidations).every(validation => validation);

    return (
        <div data-layer="Sign-up Screen" className="w-full h-screen bg-white inline-flex justify-center items-start overflow-hidden">
            <div data-layer="Form" className="FormContainer w-1/2 max-w-screen-md flex-1 self-stretch px-10 pb-2 inline-flex flex-col justify-center items-center overflow-hidden">
                <div data-layer="Header Container" className="HeaderContainer self-stretch flex flex-col justify-start items-start gap-1">
                    <div data-layer="Subtitle" className="Subtitle self-stretch text-center justify-start text-Labels-Primary text-3xl font-semibold font-['Inter_Tight'] leading-[48px] tracking-tight">Create your AURA account</div>
                    <div data-layer="Form Description" className="FormDescription pb-5 self-stretch text-center justify-start text-Labels-Secondary/60 text-base font-medium font-['Inter_Tight']">Join today to start managing your business.</div>
                </div>
                <div data-layer="Form Fields Container" className="FormFieldsContainer self-stretch flex flex-col justify-start items-start gap-6">
                    <div data-layer="Email Input Container" className="EmailInputContainer self-stretch px-20 flex flex-col justify-start items-center gap-4">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="self-stretch min-h-11 px-3 py-2 bg-black/5 rounded-lg border-0 font-normal font-['Inter_Tight'] leading-snug tracking-wide text-black"
                        />
                        <Input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="self-stretch min-h-11 px-3 py-2 bg-black/5 rounded-lg border-0 font-normal font-['Inter_Tight'] leading-snug tracking-wide text-black"
                        />
                        <Input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className="self-stretch min-h-11 px-3 py-2 bg-black/5 rounded-lg border-0 font-normal font-['Inter_Tight'] leading-snug tracking-wide text-black"
                        />
                        <ul className="self-stretch list-none p-0 mt-2 font-['Inter_Tight']">
                            <ValidationItem label="At least 8 characters" isValid={passwordValidations.minLength} />
                            <ValidationItem label="At least one lowercase letter" isValid={passwordValidations.hasLowercase} />
                            <ValidationItem label="At least one uppercase letter" isValid={passwordValidations.hasUppercase} />
                            <ValidationItem label="At least one number" isValid={passwordValidations.hasNumber} />
                            <ValidationItem label="At least one special character" isValid={passwordValidations.hasSpecial} />
                            <ValidationItem label="Passwords match" isValid={passwordValidations.passwordsMatch} />
                        </ul>
                        <Button
                            onClick={handleSignup}
                            disabled={isLoading || !email || !password || !confirmPassword || !allValidationsPassed}
                            className="SubmitButton self-stretch h-11 px-5 py-2 rounded-lg inline-flex justify-center items-center gap-2 text-base font-medium font-['Inter_Tight']"
                        >
                            {isLoading ? "Loading..." : "Sign Up"}
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