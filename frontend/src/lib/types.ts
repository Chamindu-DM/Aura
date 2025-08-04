// TypeScript types placeholder
export interface User {
  id: string;
  email: string;
  name: string;
  // Additional user properties will be defined here
}

export interface Business {
  id: string;
  name: string;
  // Additional business properties will be defined here
}

export interface Service {
  id: string;
  name: string;
  // Additional service properties will be defined here
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  // Additional appointment properties will be defined here
}
