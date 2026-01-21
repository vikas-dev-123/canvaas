import { getDomainContent } from '@/lib/queries';
import { notFound } from 'next/navigation';
import React from 'react';

interface DomainPageProps {
  params: {
    domain: string;
  };
}

const DomainPage = async ({ params }: DomainPageProps) => {
  const { domain } = params;
  
  // Remove any port number or protocol if present
  const cleanDomain = domain.replace(/:\d+$/, '').replace(/^https?:\/\//, '');
  
  const funnelData = await getDomainContent(cleanDomain);
  
  if (!funnelData || !funnelData.published) {
    notFound();
  }

  // Get the first page (landing page) for the domain
  const landingPage = funnelData.FunnelPages.sort((a, b) => a.order - b.order)[0];
  
  if (!landingPage) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Funnel Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{funnelData.name}</h1>
            {funnelData.favicon && (
              <img 
                src={funnelData.favicon} 
                alt="Favicon" 
                className="h-8 w-8 rounded-full" 
              />
            )}
          </div>
        </div>
      </header>

      {/* Funnel Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {landingPage.name}
            </h2>
            
            {landingPage.content ? (
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: landingPage.content }}
              />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">This page is under construction</p>
                <p className="text-sm text-gray-400 mt-2">Page content will appear here when published</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Funnel Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} {funnelData.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DomainPage;
