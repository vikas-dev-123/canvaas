import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public paths that don't require authentication
  const publicPaths = ['/', '/signin', '/signup', '/api/auth',"/site", "/api/uploadthing"];
  
  const isPublicPath = publicPaths.some(path => 
    pathname.startsWith(path)
  );
  
  // Check if path is for API auth routes (which handle their own auth)
  const isApiAuthRoute = pathname.startsWith('/api/auth');
  
  // If it's a public path or API auth route, allow access
  if (isPublicPath || isApiAuthRoute) {
    return NextResponse.next();
  }
  
  // For protected routes, check authentication
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    // Token invalid, redirect to login
    const response = NextResponse.redirect(new URL('/signin', request.url));
    response.cookies.delete('token'); // Remove invalid token
    return response;
  }
  
  return NextResponse.next();
}

// Configure which paths to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};