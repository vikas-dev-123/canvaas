import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

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
    
    // Check if user already exists
    const [rows]: any = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (rows.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Insert new user
    const [result]: any = await pool.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    
    // Generate JWT token
    const token = generateToken(result.insertId);
    
    // Set cookie
    const response = NextResponse.json(
      { message: 'User created successfully', userId: result.insertId },
      { status: 201 }
    );
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}