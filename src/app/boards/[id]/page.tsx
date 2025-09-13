'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useBoards } from '@/contexts/BoardContext'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, MoreVertical, Trash2, Edit3, Bookmark, Heart, Share } from 'lucide-react'
import type { Board } from '@/types'

export default function BoardPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { boards, pins, loading, error } = useBoards()
  const [board, setBoard] = useState<Board | null>(null)
  const [boardPins, setBoardPins] = useState<Array<{id: string, imageUrl: string, title: string, boardIds: string[], createdAt: Date}>>([])
  const [selectedPin, setSelectedPin] = useState<{id: string, imageUrl: string, title: string, boardIds: string[], createdAt: Date} | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const boardId = params.id as string

  useEffect(() => {
    if (boards.length > 0) {
      const foundBoard = boards.find(b => b.id === boardId)
      if (foundBoard) {
        setBoard(foundBoard)
        // Filter pins that belong to this board
        const pinsInBoard = pins.filter(pin => pin.boardIds.includes(boardId))
        setBoardPins(pinsInBoard)
      } else {
        // Board not found, redirect to boards page
        router.push('/boards')
      }
    }
  }, [boards, pins, boardId, router])

  const handleDeleteBoard = async () => {
    if (!board) return
    
    setIsDeleting(true)
    try {
      // This will be handled by the BoardContext
      router.push('/boards')
    } catch (error) {
      console.error('Error deleting board:', error)
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading board...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Board</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/boards')}>
            Back to Boards
          </Button>
        </div>
      </div>
    )
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">📌</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Board Not Found</h2>
            <p className="text-gray-600 mb-4">This board doesn&apos;t exist or you don&apos;t have access to it.</p>
          <Button onClick={() => router.push('/boards')}>
            Back to Boards
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/boards">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-red-500">PinBoard</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Board Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{board.name}</h1>
              {board.description && (
                <p className="text-gray-600 text-lg mb-4">{board.description}</p>
              )}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>{boardPins.length} pins</span>
                <span>Created by {user?.email?.split('@')[0] || 'You'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pins Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {boardPins.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pins yet</h3>
            <p className="text-gray-500 mb-4">Start adding pins to this board to see them here</p>
            <Link href="/">
              <Button>
                <Bookmark className="w-4 h-4 mr-2" />
                Discover Pins
              </Button>
            </Link>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {boardPins.map((pin) => (
              <div 
                key={pin.id} 
                className="break-inside-avoid bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => setSelectedPin(pin)}
              >
                <div className="relative">
                  <Image
                    src={pin.imageUrl}
                    alt={pin.title}
                    width={300}
                    height={400}
                    className="w-full h-auto hover:opacity-95 transition-opacity"
                    onError={(e) => {
                      console.error('Board image failed to load:', pin.imageUrl)
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                      <Button size="sm" className="bg-white/90 hover:bg-white">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-white/90 hover:bg-white">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{pin.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Pin Detail Modal */}
      {selectedPin && (
        <Modal
          isOpen={!!selectedPin}
          onClose={() => setSelectedPin(null)}
          className="max-w-4xl w-full mx-4"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="flex-1">
              <Image
                src={selectedPin.imageUrl}
                alt={selectedPin.title}
                width={500}
                height={600}
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  console.error('Board modal image failed to load:', selectedPin.imageUrl)
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>

            {/* Details Panel */}
            <div className="w-full md:w-80 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{selectedPin.title}</h2>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Board Details</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Saved to: <span className="font-medium">{board.name}</span></p>
                  <p className="text-xs text-gray-500 mt-1">Uploaded {selectedPin.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Board Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Board"
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete &quot;<span className="font-medium">{board.name}</span>&quot;? 
            This action cannot be undone and will remove all pins from this board.
          </p>
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={handleDeleteBoard}
              isLoading={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Board
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
