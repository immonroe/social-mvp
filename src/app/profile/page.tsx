'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useBoards } from '@/contexts/BoardContext'
import { Settings, Grid3X3, Bookmark } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const { boards, pins } = useBoards()
  const [activeTab, setActiveTab] = useState<'boards' | 'pins'>('boards')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-red-500">PinBoard</Link>
            <Link href="/settings">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.email || 'User'}</h1>
          <p className="text-gray-600">0 followers • 4 following</p>
        </div>

        <div className="flex justify-center space-x-8 border-b border-gray-200 mb-8">
          <button 
            className={`pb-4 border-b-2 font-medium flex items-center ${
              activeTab === 'boards' 
                ? 'border-red-500 text-red-500' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('boards')}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Boards ({boards.length})
          </button>
          <button 
            className={`pb-4 border-b-2 font-medium flex items-center ${
              activeTab === 'pins' 
                ? 'border-red-500 text-red-500' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pins')}
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Pins ({pins.length})
          </button>
        </div>

        {activeTab === 'boards' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {boards.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Grid3X3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No boards created yet</p>
                <Link href="/boards">
                  <Button className="mt-4">Create Your First Board</Button>
                </Link>
              </div>
            ) : (
              boards.map((board) => (
                <div key={board.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="aspect-[3/2] bg-gray-100">
                    <div className="w-full h-full flex items-center justify-center">
                      <Grid3X3 className="w-8 h-8 text-gray-300" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{board.name}</h3>
                    <p className="text-sm text-gray-500">0 pins</p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {pins.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No pins saved yet</p>
                <Link href="/">
                  <Button className="mt-4">Discover Pins</Button>
                </Link>
              </div>
            ) : (
              pins.map((pin) => (
                <div key={pin.id} className="break-inside-avoid bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <img src={pin.imageUrl} alt={pin.title} className="w-full h-auto" />
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900">{pin.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Saved to {pin.boardIds.length} board{pin.boardIds.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
