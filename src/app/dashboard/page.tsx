'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated by making a request to a protected endpoint
    // This will automatically send the HTTP-only cookie
    fetch('/api/auth/verify', {
      method: 'POST',
      credentials: 'include' // Include cookies in the request
    }).then(response => {
      if (!response.ok) {
        // Token is invalid or missing, redirect to login
        router.push('/signin');
      } else {
        // Token is valid
        setLoading(false);
      }
    }).catch(() => {
      // Network error or other issue, redirect to login
      router.push('/signin');
    });
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