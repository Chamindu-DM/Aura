// Onboarding provider placeholder
'use client';

import React, { createContext, useContext } from 'react';

const OnboardingContext = createContext({});

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  // Onboarding context logic will be implemented here
  
  return (
    <OnboardingContext.Provider value={{}}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboardingContext = () => useContext(OnboardingContext);
