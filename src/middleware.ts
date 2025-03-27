import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the token (if user is signed in)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/terms-of-service',
    '/privacy-policy',
    // Add any other public routes here
  ];

  // Check if current path is a public API route
  const isPublicApiRoute =
    pathname.startsWith('/api/auth') || pathname.includes('_next') || pathname.includes('favicon.ico');

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  // User is trying to access a non-public route while not authenticated
  if (!isAuthenticated && !isPublicRoute && !isPublicApiRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // All authenticated users should be on dashboard routes
  if (isAuthenticated && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Proceed as normal
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (Next Auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
