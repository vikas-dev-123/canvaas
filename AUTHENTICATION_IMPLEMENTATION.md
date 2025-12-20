# Authentication Implementation Guide

This document outlines the procedure for implementing sign-in/signup authentication with MySQL, JWT, and bcrypt in your SaaS application.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Database Schema](#database-schema)
4. [Environment Variables (.env)](#environment-variables-env)
5. [Dependencies Installation](#dependencies-installation)
6. [Backend Implementation](#backend-implementation)
   - [Database Connection](#database-connection)
   - [Password Hashing with Bcrypt](#password-hashing-with-bcrypt)
   - [JWT Token Generation](#jwt-token-generation)
   - [Authentication Middleware](#authentication-middleware)
   - [API Routes](#api-routes)
7. [Frontend Implementation](#frontend-implementation)
   - [/ Route with Sign-in/Sign-up Buttons](#-route-with-sign-in-sign-up-buttons)
   - [/dashboard Route with Logout Button](#dashboard-route-with-logout-button)
8. [Security Considerations](#security-considerations)
9. [Testing](#testing)

## Overview

This implementation will create a secure authentication system using:
- MySQL for user data storage
- Bcrypt for password hashing
- JWT for session management
- Next.js API routes for backend functionality

Since you're using Bun, you can run your application with `bun dev` instead of `npm run dev`.

## Prerequisites

Based on your current setup:
- Bun runtime environment
- MySQL database (already configured in .env)
- Next.js 14.2.35
- Existing dependencies from package.json

Since you're using Bun, you'll benefit from:
- Faster cold start times
- Built-in TypeScript support
- Improved package management
- Better performance for server-side operations

## Database Schema

Create a users table in your MySQL database:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables (.env)

Your current .env file already has database configuration. Add JWT secret:

```env
# Database (already present)
DATABASE_URL="mysql://root:@vikas12345678@localhost:3306/canvaas"
LOCAL_DATABASE_URL="mysql://root:@vikas12345678@localhost:3306/canvaas"

# JWT Secret (add this)
JWT_SECRET=your_super_secret_jwt_key_here
```

## Dependencies Installation

Since you're using Bun, install the required packages with Bun:

```bash
bun add bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken mysql2
```

Note: Bun has built-in support for TypeScript and JSX, so you may not need to install types separately.

## Backend Implementation

### Database Connection

Create `src/lib/db.ts`:

```typescript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '@vikas12345678',
  database: process.env.MYSQL_DATABASE || 'canvaas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
```

Note: Since you're using Bun, the MySQL connection will benefit from Bun's improved I/O performance compared to Node.js.

### Password Hashing with Bcrypt

Create `src/lib/auth.ts`:

```typescript
import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
```

### JWT Token Generation

Add to `src/lib/auth.ts`:

```typescript
import jwt from 'jsonwebtoken';

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { userId: number } | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
  } catch (error) {
    return null;
  }
};
```

### Authentication Middleware

Create `src/middleware/auth.ts`:

```typescript
import { NextRequest, NextFetchEvent } from 'next/server';
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
```

### API Routes

#### Signup Route

Create `src/app/api/auth/signup/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/auth';

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
    
    return NextResponse.json(
      { message: 'User created successfully', userId: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Login Route

Create `src/app/api/auth/login/route.ts`:

```typescript
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
```

#### Logout Route

Create `src/app/api/auth/logout/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
    
    // Clear token cookie
    response.cookies.delete('token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Frontend Implementation

### / Route with Sign-in/Sign-up Buttons

Update `src/app/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  const handleSignUpClick = () => {
    router.push('/signup');
  };
  
  const handleSignInClick = () => {
    router.push('/signin');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-4xl font-bold mb-8">Welcome to Canvaas</div>
      
      <div className="flex gap-4">
        <button 
          onClick={handleSignUpClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign Up
        </button>
        
        <button 
          onClick={handleSignInClick}
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
```

### Sign-up Page

Create `src/app/signup/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Redirect to dashboard after successful signup
        router.push('/dashboard');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <button
            onClick={() => router.push('/signin')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Sign-in Page

Create `src/app/signin/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Redirect to dashboard after successful login
        router.push('/dashboard');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <button
            onClick={() => router.push('/signup')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Dashboard Page with Logout Button

Create `src/app/dashboard/page.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    if (!token) {
      router.push('/signin');
    } else {
      setLoading(false);
    }
  }, [router]);
  
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        // Redirect to home page after logout
        router.push('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to your dashboard!</h2>
            <p className="text-gray-600">
              This is your authenticated dashboard area. You can add your application content here.
            </p>
            
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800">Feature 1</h3>
                <p className="mt-2 text-blue-700">Description of your first feature.</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800">Feature 2</h3>
                <p className="mt-2 text-green-700">Description of your second feature.</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800">Feature 3</h3>
                <p className="mt-2 text-purple-700">Description of your third feature.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
```

### Protected Route Middleware

Create `src/middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public paths that don't require authentication
  const publicPaths = ['/', '/signin', '/signup', '/api/auth'];
  
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
```

## Security Considerations

1. **HTTPS in Production**: Ensure your application uses HTTPS in production.
2. **Strong Password Policy**: Implement password strength requirements.
3. **Rate Limiting**: Add rate limiting to authentication endpoints.
4. **Input Validation**: Always validate and sanitize user inputs.
5. **JWT Expiration**: Set appropriate token expiration times.
6. **Secure Cookies**: Use `secure: true` and `sameSite: 'strict'` in production.

## Testing

1. Test user registration with valid and invalid data
2. Test duplicate email registration
3. Test login with correct and incorrect credentials
4. Test accessing protected routes without authentication
5. Test accessing protected routes with valid authentication
6. Test logout functionality
7. Test token expiration scenarios

## Bun-Specific Considerations

1. **Performance**: Bun's JavaScript engine (JavaScriptCore) typically offers better performance than Node.js V8 for server-side operations.
2. **Startup Time**: Your Next.js application will start faster with `bun dev` compared to `npm run dev`.
3. **Memory Usage**: Bun generally uses less memory than Node.js for the same operations.
4. **Package Management**: Use `bun add` instead of `npm install` for adding new dependencies.

This implementation provides a complete authentication system with sign-up, sign-in, and logout functionality using MySQL for data storage, bcrypt for password hashing, and JWT for session management.