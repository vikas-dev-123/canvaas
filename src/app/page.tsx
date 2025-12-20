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
