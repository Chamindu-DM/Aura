// App constants placeholder
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  WELCOME: '/onboarding/welcome',
  BUSINESS_INFO: '/onboarding/business-info',
  SETUP_SERVICES: '/onboarding/setup-services',
  SCHEDULE: '/onboarding/schedule',
  SETUP_TEAM: '/onboarding/setup-team',
  DASHBOARD: '/dashboard/dashboard',
  APPOINTMENTS: '/dashboard/appointments',
  CLIENTS: '/dashboard/clients',
  SERVICES: '/dashboard/services',
  TEAM: '/dashboard/team',
  SETTINGS: '/dashboard/settings',
} as const;

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  BUSINESSES: '/api/businesses',
  SERVICES: '/api/services',
  APPOINTMENTS: '/api/appointments',
} as const;
