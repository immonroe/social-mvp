'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Grid3X3, Image as ImageIcon } from 'lucide-react'
import { useSearch } from '@/contexts/SearchContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export function TopSearchBar() {
  const { searchQuery, setSearchQuery, searchResults, isSearching, performSearch, clearSearch } = useSearch()
  const [showResults, setShowResults] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery)
      setShowResults(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    if (value.trim()) {
      performSearch(value)
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  const handleResultClick = (result: any) => {
    if (result.type === 'board') {
      router.push(`/boards/${result.id}`)
    } else if (result.type === 'pin') {
      // For pins, we could navigate to the board or show a modal
      router.push(`/boards/${result.boardName}`)
    }
    setShowResults(false)
    clearSearch()
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div ref={searchRef} className="max-w-2xl mx-auto relative">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for ideas..."
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                className="w-full h-12 px-6 pr-12 text-base rounded-full border-2 border-gray-300 focus:border-pinterest-red focus:outline-none focus:ring-4 focus:ring-pinterest-red/10 transition-all duration-200 shadow-sm"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pinterest-red text-white p-2.5 rounded-full hover:bg-pinterest-red-hover transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Search Results Dropdown */}
          {showResults && (searchResults.length > 0 || isSearching) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pinterest-red mx-auto mb-2"></div>
                  Searching...
                </div>
              ) : (
                <>
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm text-gray-600">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                  <div className="py-2">
                    {searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                      >
                        {result.type === 'board' ? (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Grid3X3 className="w-5 h-5 text-gray-600" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {result.imageUrl ? (
                              <Image
                                src={result.imageUrl}
                                alt={result.title}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-gray-600" />
                            )}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {result.title}
                          </p>
                          {result.description && (
                            <p className="text-xs text-gray-500 truncate">
                              {result.description}
                            </p>
                          )}
                          {result.boardName && (
                            <p className="text-xs text-pinterest-red">
                              in {result.boardName}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
