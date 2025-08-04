// App constants placeholder
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  WELCOME: '/welcome',
  BUSINESS_INFO: '/business-info',
  SETUP_SERVICES: '/setup-services',
  SCHEDULE: '/schedule',
  SETUP_TEAM: '/setup-team',
  DASHBOARD: '/dashboard',
  APPOINTMENTS: '/appointments',
  CLIENTS: '/clients',
  SERVICES: '/services',
  TEAM: '/team',
  SETTINGS: '/settings',
} as const;

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  BUSINESSES: '/api/businesses',
  SERVICES: '/api/services',
  APPOINTMENTS: '/api/appointments',
} as const;
