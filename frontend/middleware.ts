import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the paths that require authentication.
// All paths that start with these prefixes will be protected.
const AUTH_REQUIRED_PATHS = [
    '/welcome',
    '/business-info',
    '/setup-services',
    '/dashboard'
];

export function middleware(request: NextRequest) {
    // Get the token from the user's cookies.
    // This is the standard way to handle authentication in middleware.
    const authToken = request.cookies.get('authToken');
    const path = request.nextUrl.pathname;

    // Check if the current path requires authentication
    // AND if the user doesn't have a valid authentication token.
    const isAuthRequired = AUTH_REQUIRED_PATHS.some(prefix => path.startsWith(prefix));

    if (isAuthRequired && !authToken) {
        // If auth is required but there's no token, redirect to the login page.
        const loginUrl = new URL('/', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // If the user has a token or the path doesn't require authentication,
    // continue to the requested page.
    return NextResponse.next();
}

// Define which paths the middleware should run on.
export const config = {
    matcher: AUTH_REQUIRED_PATHS,
};