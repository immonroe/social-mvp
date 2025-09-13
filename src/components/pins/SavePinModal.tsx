'use client'

import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { CreateBoardModal } from '../CreateBoardModal'
import { Bookmark } from 'lucide-react'
import type { Board } from '@/types'

interface SavePinModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveToBoard: (boardId: string) => Promise<void>
  onCreateBoard: (name: string, description: string) => Promise<void>
  boards: Board[]
  pinTitle?: string
}

export function SavePinModal({ 
  isOpen, 
  onClose, 
  onSaveToBoard, 
  onCreateBoard, 
  boards, 
  pinTitle 
}: SavePinModalProps) {
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveToBoard = async (boardId: string) => {
    setIsSaving(true)
    try {
      await onSaveToBoard(boardId)
      onClose()
    } catch (error) {
      console.error('Failed to save pin to board:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Save ${pinTitle ? `"${pinTitle}"` : 'Pin'}`}
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Choose a board to save this pin to:
          </p>

          {boards.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No boards yet. Create your first board to get started.</p>
              <Button onClick={() => setShowCreateBoard(true)} className="w-full">
                Create Your First Board
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {boards.map((board) => (
                <Button
                  key={board.id}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto p-3 flex-col items-start"
                  onClick={() => handleSaveToBoard(board.id)}
                  disabled={isSaving}
                >
                  <div className="flex items-center w-full">
                    <Bookmark className="w-4 h-4 mr-2" />
                    <span className="font-medium truncate">{board.name}</span>
                  </div>
                  {board.description && (
                    <span className="text-xs text-gray-500 mt-1 text-left">
                      {board.description}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 mt-1">
                    0 pins
                  </span>
                </Button>
              ))}
            </div>
          )}

          {boards.length > 0 && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowCreateBoard(true)}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Create New Board
            </Button>
          )}

          <div className="flex justify-end">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <CreateBoardModal
        isOpen={showCreateBoard}
        onClose={() => setShowCreateBoard(false)}
        onCreateBoard={onCreateBoard}
      />
    </>
  )
}
