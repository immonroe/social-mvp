'use client'

import Link from 'next/link'
import { Button } from '../ui/Button'
import { Grid3X3, Trash2, Edit3, MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Board } from '@/types'

interface BoardCardProps {
  board: Board
  onEdit?: (board: Board) => void
  onDelete?: (boardId: string) => void
  className?: string
}

export function BoardCard({ board, onEdit, onDelete, className }: BoardCardProps) {
  const pinCount = 0

  return (
    <Link href={`/boards/${board.id}`}>
      <div className={cn(
        'bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer',
        className
      )}>
        <div className="aspect-[3/2] bg-gray-100 relative">
          <div className="w-full h-full flex items-center justify-center">
            <Grid3X3 className="w-12 h-12 text-gray-300" />
          </div>
          
          {/* Action buttons */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/90 hover:bg-white text-gray-600"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onEdit(board)
                  }}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/90 hover:bg-white text-gray-600"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (confirm(`Delete "${board.name}" board?`)) {
                      onDelete(board.id)
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate">{board.name}</h3>
          <p className="text-sm text-gray-500">{pinCount} pins</p>
          {board.description && (
            <p className="text-sm text-gray-600 mt-1 truncate">{board.description}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
