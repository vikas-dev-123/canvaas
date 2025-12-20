import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user
    const [rows]: any = await pool.execute(
      'SELECT id, password FROM users WHERE email = ?',
      [email]
    );
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const user = rows[0];
    
    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = generateToken(user.id);
    
    // Set cookie
    const response = NextResponse.json(
      { message: 'Login successful', userId: user.id },
      { status: 200 }
    );
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}