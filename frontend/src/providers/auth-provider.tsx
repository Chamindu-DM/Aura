// Auth provider placeholder
'use client';

import React, { createContext, useContext } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Auth context logic will be implemented here
  
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
