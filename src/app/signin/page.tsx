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
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
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
    <div className="bg-void-black min-h-screen flex items-center justify-center font-sans antialiased selection:bg-electric-blue selection:text-void-black relative overflow-hidden" 
         style={{
           backgroundColor: '#04020A',
           backgroundImage: `
             radial-gradient(circle at 15% 50%, rgba(26, 0, 51, 0.5) 0%, transparent 50%),
             radial-gradient(circle at 85% 60%, rgba(26, 0, 51, 0.5) 0%, transparent 50%),
             radial-gradient(circle at 50% 20%, rgba(26, 0, 51, 0.4) 0%, transparent 50%),
             radial-gradient(circle at 70% 80%, rgba(26, 0, 51, 0.4) 0%, transparent 50%),
             radial-gradient(circle at 30% 90%, rgba(26, 0, 51, 0.3) 0%, transparent 50%)
           `,
           backgroundSize: '800px 800px, 900px 900px, 700px 700px, 1000px 1000px, 600px 600px'
         }}>
      
      {/* Logo */}
      <div className="absolute top-8 left-8">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-transparent flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 8C7 6.34315 8.34315 5 10 5H17M7 16C7 17.6569 8.34315 19 10 19H17M7 8V16M7 8H4M7 16H4" 
                    stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
          <span className="ml-2 text-2xl font-light tracking-tight" style={{ color: '#E0E0E0' }}>Canvaas</span>
        </div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md" 
             style={{
               position: 'relative',
               backgroundColor: 'transparent',
               border: '1px solid rgba(0, 240, 255, 0.3)',
               borderRadius: '0.75rem',
               padding: '2rem',
               boxShadow: '0 0 25px rgba(0, 240, 255, 0.4), inset 0 0 15px rgba(0, 240, 255, 0.2)',
               transition: 'all 0.3s ease-in-out',
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center'
             }}>
          
          <h2 className="text-xl font-light mb-6" style={{ color: '#E0E0E0' }}>Sign In to Portal</h2>
          
          <form className="space-y-6 w-full px-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            
            <div className="relative w-full">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email..."
                className="block w-full rounded-md placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  border: 'none',
                  color: '#E0E0E0',
                  fontSize: '1.125rem',
                  padding: '0.75rem 1rem',
                  textAlign: 'center'
                }}
              />
            </div>
            
            <div className="relative w-full">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password..."
                className="block w-full rounded-md placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  border: 'none',
                  color: '#E0E0E0',
                  fontSize: '1.125rem',
                  padding: '0.75rem 1rem',
                  textAlign: 'center'
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full"
              style={{
                backgroundColor: '#00F0FF',
                color: '#04020A',
                fontWeight: 300,
                fontSize: '1.3rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.6)',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#00C8D1';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 240, 255, 0.8)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#00F0FF';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.6)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading ? 'Accessing...' : 'Access System'}
            </button>
          </form>
          
          <div className="flex items-center gap-4 py-4 w-full px-6">
            <div style={{ height: '1px' }} className="flex-grow bg-electric-blue/20"></div>
            <span className="text-xs font-light uppercase tracking-wider" style={{ color: '#888888' }}>OR</span>
            <div style={{ height: '1px' }} className="flex-grow bg-electric-blue/20"></div>
          </div>
          
          <button 
            className="w-full max-w-xs flex items-center justify-center gap-3 bg-transparent font-light py-2 px-4 rounded-full border border-electric-blue/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue focus:ring-offset-void-black"
            style={{ color: '#888888' }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#00F0FF';
              e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#888888';
              e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.2)';
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span>Continue with Google</span>
          </button>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/signup')}
              className="font-light text-sm"
              style={{ color: '#888888' }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#00F0FF';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#888888';
              }}
            >
              Don't have an account? Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}