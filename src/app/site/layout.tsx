import Navigation from '@/components/site/index'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider dynamic appearance={{baseTheme:dark}}>
      <main className='h-full'>
      <Navigation />
      {children}
    </main>
    </ClerkProvider>
  )
}

export default layout
