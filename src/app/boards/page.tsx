'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { PlusIcon, Grid3X3 } from 'lucide-react'

const SAMPLE_BOARDS = [
  { id: 1, name: 'Travel Inspiration', count: 24, cover: 'https://picsum.photos/300/200?random=1' },
  { id: 2, name: 'Home Decor', count: 18, cover: 'https://picsum.photos/300/200?random=2' },
  { id: 3, name: 'Recipe Ideas', count: 32, cover: 'https://picsum.photos/300/200?random=3' },
  { id: 4, name: 'Art & Design', count: 15, cover: 'https://picsum.photos/300/200?random=4' },
]

export default function BoardsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-red-500">PinBoard</Link>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Board
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Boards</h1>
          <Button variant="outline">
            <Grid3X3 className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {SAMPLE_BOARDS.map((board) => (
            <div key={board.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="aspect-[3/2] bg-gray-100">
                <img src={board.cover} alt={board.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{board.name}</h3>
                <p className="text-sm text-gray-500">{board.count} pins</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
