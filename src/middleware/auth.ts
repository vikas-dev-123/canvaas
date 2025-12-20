import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export const authMiddleware = async (request: NextRequest) => {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return Response.redirect(new URL('/login', request.url));
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return Response.redirect(new URL('/login', request.url));
  }
  
  // Add user info to request if needed
  return null; // Continue to route handler
};