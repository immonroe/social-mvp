'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { ImageGrid } from '@/components/ImageGrid'
import { useBoards } from '@/contexts/BoardContext'
import { LogOut, Upload, PlusIcon, AlertCircle } from 'lucide-react'
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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-pinterest-red flex items-center">
              <span className="text-3xl">📌</span>
              <span className="ml-2">PinBoard</span>
            </Link>
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 hidden sm:inline">{user.email}</span>
                  <Link href="/boards">
                    <Button variant="ghost" size="sm">Boards</Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="ghost" size="sm">Profile</Button>
                  </Link>
                  <Link href="/upload">
                    <Button size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="min-h-screen">
        {boardError && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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
        
        {/* Pinterest-style search and categories */}
        <div className="bg-white border-b sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Find your next favorite thing</h1>
              <p className="text-base md:text-lg text-gray-600">Get inspired and discover ideas</p>
            </div>
            
            {/* Search bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for ideas..."
                  className="w-full h-12 px-6 pr-12 text-base rounded-full border-2 border-gray-300 focus:border-pinterest-red focus:outline-none focus:ring-4 focus:ring-pinterest-red/10 transition-all duration-200 shadow-sm"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pinterest-red text-white p-2.5 rounded-full hover:bg-pinterest-red-hover transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
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
        
        {/* Image Grid with better spacing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ImageGrid />
        </div>
      </main>
    </div>
  )
}