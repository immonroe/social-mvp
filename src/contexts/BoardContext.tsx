'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { boards, images, pins } from '@/lib/database'
import type { Board } from '@/types'

interface Pin {
  id: string
  imageUrl: string
  title: string
  boardIds: string[]
  createdAt: Date
}

interface BoardContextType {
  boards: Board[]
  pins: Pin[]
  createBoard: (name: string, description: string) => Promise<void>
  deleteBoard: (boardId: string) => Promise<void>
  savePinToBoard: (pinId: string, boardId: string, imageUrl: string, title: string) => Promise<void>
  removePinFromBoard: (pinId: string, boardId: string) => Promise<void>
  addComment: (pinId: string, comment: string) => void
  comments: Record<string, Array<{id: string, author: string, text: string, createdAt: Date}>>
  loading: boolean
  error: string | null
}

const BoardContext = createContext<BoardContextType | undefined>(undefined)

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [boardsData, setBoardsData] = useState<Board[]>([])
  const [pinsData, setPinsData] = useState<Pin[]>([])
  const [comments, setComments] = useState<Record<string, Array<{id: string, author: string, text: string, createdAt: Date}>>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUserData = useCallback(async () => {
    if (!user) return
    
    setLoading(true)
    setError(null)
    
    try {
      // Load boards
      const userBoards = await boards.getByUserId(user.id)
      setBoardsData(userBoards)

      // Load images
      const userImages = await images.getByUserId(user.id)
      setPinsData(userImages.map(img => ({
        id: img.id,
        imageUrl: img.url,
        title: img.filename,
        boardIds: [], // Will be populated when we load board pins
        createdAt: new Date(img.created_at)
      })))

      // Load board pins to populate boardIds for each pin
      const boardPinsPromises = userBoards.map(async (board) => {
        const boardPins = await pins.getByBoardId(board.id)
        return { boardId: board.id, pins: boardPins }
      })
      
      const allBoardPins = await Promise.all(boardPinsPromises)
      
      // Update pins with their board associations
      setPinsData(prevPins => 
        prevPins.map(pin => {
          const associatedBoards = allBoardPins
            .filter(bp => bp.pins.some(p => p.image_id === pin.id))
            .map(bp => bp.boardId)
          return { ...pin, boardIds: associatedBoards }
        })
      )

    } catch (err) {
      console.error('Error loading user data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [user])

  // Load boards and pins when user changes
  useEffect(() => {
    if (user) {
      loadUserData()
    } else {
      setBoardsData([])
      setPinsData([])
      setComments({})
    }
  }, [user, loadUserData])

  const createBoard = async (name: string, description: string) => {
    if (!user) return
    
    try {
      const newBoard = await boards.create({
        user_id: user.id,
        name,
        description: description || null
      })
      setBoardsData(prev => [...prev, newBoard])
    } catch (err) {
      console.error('Error creating board:', err)
      setError(err instanceof Error ? err.message : 'Failed to create board')
    }
  }

  const deleteBoard = async (boardId: string) => {
    try {
      await boards.delete(boardId)
      setBoardsData(prev => prev.filter(board => board.id !== boardId))
      
      // Also remove pins from this board
      setPinsData(prev => prev.map(pin => ({
        ...pin,
        boardIds: pin.boardIds.filter(id => id !== boardId)
      })))
    } catch (err) {
      console.error('Error deleting board:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete board')
    }
  }

  const savePinToBoard = async (pinId: string, boardId: string, imageUrl: string, title: string) => {
    if (!user) return
    
    try {
      // Check if pin exists, if not create it
      const existingPin = pinsData.find(p => p.id === pinId)
      if (!existingPin) {
        // Create new image record
        const newImage = await images.create({
          user_id: user.id,
          filename: title,
          url: imageUrl
        })
        
        const newPin: Pin = {
          id: newImage.id,
          imageUrl: newImage.url,
          title: newImage.filename,
          boardIds: [boardId],
          createdAt: new Date(newImage.created_at)
        }
        setPinsData(prev => [...prev, newPin])
      }

      // Save pin to board
      await pins.saveToBoard(boardId, pinId)
      
      // Update local state
      setPinsData(prev => prev.map(pin => 
        pin.id === pinId 
          ? { ...pin, boardIds: [...new Set([...pin.boardIds, boardId])] }
          : pin
      ))

      // Reload boards to get updated pin counts
      await loadUserData()
    } catch (err) {
      console.error('Error saving pin to board:', err)
      setError(err instanceof Error ? err.message : 'Failed to save pin to board')
    }
  }

  const removePinFromBoard = async (pinId: string, boardId: string) => {
    try {
      await pins.removeFromBoard(boardId, pinId)
      
      // Update local state
      setPinsData(prev => prev.map(pin => 
        pin.id === pinId 
          ? { ...pin, boardIds: pin.boardIds.filter(id => id !== boardId) }
          : pin
      ))

      // Reload boards to get updated pin counts
      await loadUserData()
    } catch (err) {
      console.error('Error removing pin from board:', err)
      setError(err instanceof Error ? err.message : 'Failed to remove pin from board')
    }
  }

  const addComment = (pinId: string, comment: string) => {
    const newComment = {
      id: Date.now().toString(),
      author: user?.email?.split('@')[0] || 'anonymous',
      text: comment,
      createdAt: new Date()
    }
    
    setComments(prev => ({
      ...prev,
      [pinId]: [...(prev[pinId] || []), newComment]
    }))
  }

  const value = {
    boards: boardsData,
    pins: pinsData,
    createBoard,
    deleteBoard,
    savePinToBoard,
    removePinFromBoard,
    addComment,
    comments,
    loading,
    error
  }

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  )
}

export function useBoards() {
  const context = useContext(BoardContext)
  if (context === undefined) {
    throw new Error('useBoards must be used within a BoardProvider')
  }
  return context
}
