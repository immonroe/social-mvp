'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CreateBoardModal } from '@/components/CreateBoardModal'
import { useBoards } from '@/contexts/BoardContext'
import { PlusIcon, Grid3X3, Trash2 } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'

export default function BoardsPage() {
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const { boards, createBoard, deleteBoard } = useBoards()

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Boards ({boards.length})</h1>
            <Button onClick={() => setShowCreateBoard(true)} className="btn-pinterest">
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Board
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
                <Link key={board.id} href={`/boards/${board.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden pinterest-card group cursor-pointer">
                    <div className="aspect-[3/2] bg-pinterest-light relative">
                      <div className="w-full h-full flex items-center justify-center">
                        <Grid3X3 className="w-12 h-12 text-pinterest-tertiary" />
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-white/90 hover:bg-white text-pinterest-red hover:text-pinterest-red-hover"
                          onClick={(e) => {
                            e.preventDefault()
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
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{board.name}</h3>
                      <p className="text-sm text-pinterest-secondary">0 pins</p>
                      {board.description && (
                        <p className="text-sm text-pinterest-tertiary mt-1 line-clamp-2">{board.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Create Board Modal */}
        <CreateBoardModal
          isOpen={showCreateBoard}
          onClose={() => setShowCreateBoard(false)}
          onCreateBoard={async (name, description) => {
            await createBoard(name, description)
            alert(`Board "${name}" created successfully!`)
          }}
        />
      </div>
    </Layout>
  )
}