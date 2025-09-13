'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { User, LogOut, Upload, PlusIcon } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function Home() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-red-500">PinBoard</Link>
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 hidden sm:inline">{user.email}</span>
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to PinBoard
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Organize your visual inspiration with boards and pins
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <PlusIcon className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload Images</h3>
              <p className="text-gray-600">Add your favorite images and inspiration</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Boards</h3>
              <p className="text-gray-600">Organize images into themed collections</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Browse & Save</h3>
              <p className="text-gray-600">Discover and save pins to your boards</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}