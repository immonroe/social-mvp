'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useBoards } from './BoardContext'

interface SearchResult {
  type: 'board' | 'pin'
  id: string
  title: string
  description?: string
  imageUrl?: string
  boardName?: string
  createdAt: Date
}

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: SearchResult[]
  isSearching: boolean
  performSearch: (query: string) => void
  clearSearch: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { boards, pins } = useBoards()

  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    
    // Search through boards
    const boardResults: SearchResult[] = boards
      .filter(board => 
        board.name.toLowerCase().includes(query.toLowerCase()) ||
        (board.description && board.description.toLowerCase().includes(query.toLowerCase()))
      )
      .map(board => ({
        type: 'board' as const,
        id: board.id,
        title: board.name,
        description: board.description,
        createdAt: board.createdAt
      }))

    // Search through pins
    const pinResults: SearchResult[] = pins
      .filter(pin => 
        pin.title.toLowerCase().includes(query.toLowerCase())
      )
      .map(pin => {
        const board = boards.find(b => b.id === pin.boardIds[0])
        return {
          type: 'pin' as const,
          id: pin.id,
          title: pin.title,
          imageUrl: pin.imageUrl,
          boardName: board?.name,
          createdAt: pin.createdAt
        }
      })

    // Combine and sort results
    const allResults = [...boardResults, ...pinResults]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    setSearchResults(allResults)
    setIsSearching(false)
  }, [boards, pins])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setSearchResults([])
  }, [])

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        performSearch,
        clearSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
