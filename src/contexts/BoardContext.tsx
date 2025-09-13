'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

interface Board {
  id: string
  name: string
  description: string
  pinCount: number
  coverImage?: string
  createdAt: Date
}

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
  createBoard: (name: string, description: string) => void
  deleteBoard: (boardId: string) => void
  savePinToBoard: (pinId: string, boardId: string, imageUrl: string, title: string) => void
  removePinFromBoard: (pinId: string, boardId: string) => void
  addComment: (pinId: string, comment: string) => void
  comments: Record<string, Array<{id: string, author: string, text: string, createdAt: Date}>>
}

const BoardContext = createContext<BoardContextType | undefined>(undefined)

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [boards, setBoards] = useState<Board[]>([])
  const [pins, setPins] = useState<Pin[]>([])
  const [comments, setComments] = useState<Record<string, Array<{id: string, author: string, text: string, createdAt: Date}>>>({})

  // Initialize with sample data
  useEffect(() => {
    if (user) {
      setBoards([
        {
          id: '1',
          name: 'Travel Inspiration',
          description: 'Places I want to visit',
          pinCount: 24,
          coverImage: 'https://picsum.photos/id/10/300/200',
          createdAt: new Date()
        },
        {
          id: '2',
          name: 'Home Decor',
          description: 'Interior design ideas',
          pinCount: 18,
          coverImage: 'https://picsum.photos/id/20/300/200',
          createdAt: new Date()
        },
        {
          id: '3',
          name: 'Recipe Ideas',
          description: 'Delicious meals to try',
          pinCount: 32,
          coverImage: 'https://picsum.photos/id/30/300/200',
          createdAt: new Date()
        },
        {
          id: '4',
          name: 'Art & Design',
          description: 'Creative inspiration',
          pinCount: 15,
          coverImage: 'https://picsum.photos/id/40/300/200',
          createdAt: new Date()
        },
      ])

      // Initialize sample comments
      setComments({
        '1': [
          { id: '1', author: 'john_doe', text: 'Beautiful shot! Love the composition.', createdAt: new Date() },
          { id: '2', author: 'sarah_m', text: 'Adding this to my inspiration board!', createdAt: new Date() }
        ]
      })
    }
  }, [user])

  const createBoard = (name: string, description: string) => {
    const newBoard: Board = {
      id: Date.now().toString(),
      name,
      description,
      pinCount: 0,
      createdAt: new Date()
    }
    setBoards(prev => [...prev, newBoard])
  }

  const deleteBoard = (boardId: string) => {
    setBoards(prev => prev.filter(board => board.id !== boardId))
    // Also remove pins from this board
    setPins(prev => prev.map(pin => ({
      ...pin,
      boardIds: pin.boardIds.filter(id => id !== boardId)
    })))
  }

  const savePinToBoard = (pinId: string, boardId: string, imageUrl: string, title: string) => {
    // Check if pin exists, if not create it
    const existingPin = pins.find(p => p.id === pinId)
    if (!existingPin) {
      const newPin: Pin = {
        id: pinId,
        imageUrl,
        title,
        boardIds: [boardId],
        createdAt: new Date()
      }
      setPins(prev => [...prev, newPin])
    } else {
      // Add board to existing pin if not already added
      setPins(prev => prev.map(pin => 
        pin.id === pinId 
          ? { ...pin, boardIds: [...new Set([...pin.boardIds, boardId])] }
          : pin
      ))
    }

    // Update board pin count
    setBoards(prev => prev.map(board => 
      board.id === boardId 
        ? { ...board, pinCount: board.pinCount + 1, coverImage: board.coverImage || imageUrl }
        : board
    ))
  }

  const removePinFromBoard = (pinId: string, boardId: string) => {
    setPins(prev => prev.map(pin => 
      pin.id === pinId 
        ? { ...pin, boardIds: pin.boardIds.filter(id => id !== boardId) }
        : pin
    ))

    setBoards(prev => prev.map(board => 
      board.id === boardId 
        ? { ...board, pinCount: Math.max(0, board.pinCount - 1) }
        : board
    ))
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
    boards,
    pins,
    createBoard,
    deleteBoard,
    savePinToBoard,
    removePinFromBoard,
    addComment,
    comments
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
