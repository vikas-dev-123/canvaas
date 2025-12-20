import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Get token from cookies
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse the token from cookies
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    if (!tokenMatch) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = tokenMatch[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { valid: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}