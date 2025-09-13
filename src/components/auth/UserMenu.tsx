'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { User, LogOut, Upload, PlusIcon } from 'lucide-react'
import Link from 'next/link'

export function UserMenu() {
  const { user, signOut, loading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  if (!user) {
    return (
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
    )
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">{user.email}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{user.email}</p>
          </div>
          
          <Link href="/upload" className="block">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </button>
          </Link>
          
          <button
            onClick={() => {
              signOut()
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
