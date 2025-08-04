// Onboarding hook placeholder
import { useState } from 'react';

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({});

  return {
    currentStep,
    onboardingData,
    nextStep: () => setCurrentStep(prev => prev + 1),
    prevStep: () => setCurrentStep(prev => prev - 1),
    updateData: (data: any) => setOnboardingData(prev => ({ ...prev, ...data })),
  };
};
