import { getDomainContent, getFunnelPageByPath } from '@/lib/queries';
import { notFound } from 'next/navigation';
import React from 'react';

interface PathPageProps {
  params: {
    domain: string;
    path: string;
  };
}

const PathPage = async ({ params }: PathPageProps) => {
  const { domain, path } = params;
  
  // Remove any port number or protocol if present
  const cleanDomain = domain.replace(/:\d+$/, '').replace(/^https?:\/\//, '');
  
  const funnelData = await getDomainContent(cleanDomain);
  
  if (!funnelData || !funnelData.published) {
    notFound();
  }

  // Get the specific page by path
  const pageData = await getFunnelPageByPath(funnelData.id, path);
  
  if (!pageData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Funnel Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{funnelData.name}</h1>
              <nav className="text-sm text-gray-500 mt-1">
                <a href={`/${cleanDomain}`} className="hover:text-gray-700">Home</a>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{pageData.name}</span>
              </nav>
            </div>
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

      {/* Funnel Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {pageData.name}
            </h2>
            
            {pageData.content ? (
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: pageData.content }}
              />
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Page Under Construction</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  This page is currently being built. Check back soon for updates.
                </p>
                <div className="mt-6">
                  <a 
                    href={`/${cleanDomain}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back to Home
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Funnel Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} {funnelData.name}. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href={`/${cleanDomain}`} className="text-gray-400 hover:text-white text-sm">
                Home
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PathPage;
