'use client'

import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import type { Board } from '@/types'

interface EditBoardModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdateBoard: (id: string, name: string, description: string) => Promise<void>
  board: Board | null
}

export function EditBoardModal({ isOpen, onClose, onUpdateBoard, board }: EditBoardModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (board) {
      setName(board.name)
      setDescription(board.description || '')
    }
  }, [board])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!board || !name.trim()) return

    setIsLoading(true)
    try {
      await onUpdateBoard(board.id, name.trim(), description.trim())
      onClose()
    } catch (error) {
      console.error('Failed to update board:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Board">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Board Name
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter board name..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this board about?"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Update Board
          </Button>
        </div>
      </form>
    </Modal>
  )
}
