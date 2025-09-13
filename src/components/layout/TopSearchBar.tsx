'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

export function TopSearchBar() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 px-6 pr-12 text-base rounded-full border-2 border-gray-300 focus:border-pinterest-red focus:outline-none focus:ring-4 focus:ring-pinterest-red/10 transition-all duration-200 shadow-sm"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pinterest-red text-white p-2.5 rounded-full hover:bg-pinterest-red-hover transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
