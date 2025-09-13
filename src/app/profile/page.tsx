'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Settings, Grid3X3, Bookmark } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-red-500">PinBoard</Link>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            T
          </div>
          <h1 className="text-2xl font-bold text-gray-900">test@test.com</h1>
          <p className="text-gray-600">0 followers • 4 following</p>
        </div>

        <div className="flex justify-center space-x-8 border-b border-gray-200 mb-8">
          <button className="pb-4 border-b-2 border-red-500 text-red-500 font-medium flex items-center">
            <Grid3X3 className="w-4 h-4 mr-2" />
            Boards
          </button>
          <button className="pb-4 text-gray-500 flex items-center">
            <Bookmark className="w-4 h-4 mr-2" />
            Pins
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-[3/2] bg-gray-100">
                <img src={`https://picsum.photos/300/200?random=${i}`} alt="Board" className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">Board {i}</h3>
                <p className="text-sm text-gray-500">{Math.floor(Math.random() * 50)} pins</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
