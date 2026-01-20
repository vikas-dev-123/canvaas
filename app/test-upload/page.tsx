'use client'

import { UploadDropzone } from '@/lib/uploadthing'
import React from 'react'

export default function TestUpload() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test UploadThing</h1>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
        <UploadDropzone
          endpoint="agencyLogo"
          onClientUploadComplete={(res) => {
            console.log('Upload complete:', res)
            alert('Upload successful!')
          }}
          onUploadError={(error: Error) => {
            console.error('Upload error:', error)
            alert(`Upload failed: ${error.message}`)
          }}
        />
      </div>
    </div>
  )
}