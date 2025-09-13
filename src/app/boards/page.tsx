'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CreateBoardModal } from '@/components/CreateBoardModal'
import { useBoards } from '@/contexts/BoardContext'
import { PlusIcon, Grid3X3, Trash2 } from 'lucide-react'

export default function BoardsPage() {
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const { boards, createBoard, deleteBoard } = useBoards()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-red-500">PinBoard</Link>
            <Button onClick={() => setShowCreateBoard(true)}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Board
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Boards ({boards.length})</h1>
          <Button variant="outline" onClick={() => setShowCreateBoard(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            New Board
          </Button>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid3X3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No boards yet</h3>
            <p className="text-gray-500 mb-4">Create your first board to start organizing your pins</p>
            <Button onClick={() => setShowCreateBoard(true)}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Your First Board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {boards.map((board) => (
              <div key={board.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <div className="aspect-[3/2] bg-gray-100 relative">
                  {board.coverImage ? (
                    <img src={board.coverImage} alt={board.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Grid3X3 className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm(`Delete "${board.name}" board?`)) {
                          deleteBoard(board.id)
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{board.name}</h3>
                  <p className="text-sm text-gray-500">{board.pinCount} pins</p>
                  {board.description && (
                    <p className="text-sm text-gray-600 mt-1 truncate">{board.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={showCreateBoard}
        onClose={() => setShowCreateBoard(false)}
        onCreateBoard={(name, description) => {
          createBoard(name, description)
          alert(`Board "${name}" created successfully!`)
        }}
      />
    </div>
  )
}
