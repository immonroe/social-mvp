'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { storage } from '@/lib/storage'
import { PlusIcon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function UploadPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    checkUser()
  }, [])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!user) {
    router.push('/auth/login')
    return null
  }

  const handleUpload = async (files: File[]) => {
    setIsUploading(true)
    setUploadProgress(0)
    setUploadedImages([])

    try {
      const uploadPromises = files.map(async (file, index) => {
        const result = await storage.uploadImage(file, 'demo')
        setUploadProgress(((index + 1) / files.length) * 100)
        return result
      })

      const results = await Promise.all(uploadPromises)
      const successfulUploads = results.filter(result => result.success)
      
      setUploadedImages(successfulUploads.map(result => result.url!))
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Upload failed:', error)
      // Handle error - could show toast notification
    } finally {
      setIsUploading(false)
    }
  }

  const handleCreateBoard = () => {
    setShowSuccessModal(false)
    router.push('/boards/create')
  }

  const handleViewImages = () => {
    setShowSuccessModal(false)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-red-500">PinBoard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/boards/create">
                <Button variant="outline" size="sm">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Board
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Images</h2>
          <p className="text-gray-600">
            Add your favorite images to start building your collections
          </p>
        </div>

        {/* Upload Component */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <ImageUpload
            onUpload={handleUpload}
            maxFiles={20}
            maxSize={10}
          />
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Uploading...</span>
              <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Upload Successful!"
          className="max-w-md"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} uploaded successfully!
              </p>
              <p className="text-sm text-gray-500 mt-1">
                What would you like to do next?
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleViewImages}
                className="flex-1"
              >
                View Images
              </Button>
              <Button
                onClick={handleCreateBoard}
                className="flex-1"
              >
                Create Board
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  )
}
