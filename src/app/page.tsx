'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { ImageGrid } from '@/components/ImageGrid'
import { useBoards } from '@/contexts/BoardContext'
import { AlertCircle } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function Home() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const { error: boardError } = useBoards()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    checkUser()
  }, [])

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {boardError && (
          <div className="px-6 pt-8">
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading your data
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{boardError}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Category chips */}
        <div className="bg-white border-b">
          <div className="px-6 py-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Find your next favorite thing</h1>
              <p className="text-base md:text-lg text-gray-600">Get inspired and discover ideas</p>
            </div>
            
            {/* Category chips */}
            <div className="flex flex-wrap justify-center gap-2">
              {['Home Decor', 'Food & Drink', 'Fashion', 'Travel', 'Art & DIY', 'Beauty', 'Technology', 'Wedding'].map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-pinterest-red hover:text-white hover:border-pinterest-red transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Image Grid - full width */}
        <div className="px-6 py-8">
          <ImageGrid />
        </div>
      </div>
    </Layout>
  )
}