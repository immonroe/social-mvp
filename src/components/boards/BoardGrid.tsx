'use client'

import { BoardCard } from './BoardCard'
import { Button } from '../ui/Button'
import { PlusIcon, Grid3X3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Board } from '@/types'

interface BoardGridProps {
  boards: Board[]
  onEdit?: (board: Board) => void
  onDelete?: (boardId: string) => void
  onCreateBoard?: () => void
  className?: string
  emptyState?: React.ReactNode
}

export function BoardGrid({ 
  boards, 
  onEdit, 
  onDelete, 
  onCreateBoard, 
  className,
  emptyState 
}: BoardGridProps) {
  if (boards.length === 0) {
    return (
      <div className="text-center py-12">
        {emptyState || (
          <>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid3X3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No boards yet</h3>
            <p className="text-gray-500 mb-4">Create your first board to start organizing your pins</p>
            {onCreateBoard && (
              <Button onClick={onCreateBoard}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Your First Board
              </Button>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6',
      className
    )}>
      {boards.map((board) => (
        <BoardCard
          key={board.id}
          board={board}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
