'use client'

import { PinCard } from './PinCard'
import { cn } from '@/lib/utils'

interface Pin {
  id: string
  imageUrl: string
  title: string
  boardIds: string[]
  createdAt: Date
}

interface PinGridProps {
  pins: Pin[]
  onRemove?: (pinId: string) => void
  onMove?: (pinId: string) => void
  onLike?: (pinId: string) => void
  onSave?: (pinId: string) => void
  className?: string
  emptyState?: React.ReactNode
}

export function PinGrid({ 
  pins, 
  onRemove, 
  onMove, 
  onLike, 
  onSave, 
  className,
  emptyState 
}: PinGridProps) {
  if (pins.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        {emptyState || (
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pins yet</h3>
            <p className="text-gray-500">Start adding pins to see them here</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      'columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4',
      className
    )}>
      {pins.map((pin) => (
        <PinCard
          key={pin.id}
          pin={pin}
          onRemove={onRemove}
          onMove={onMove}
          onLike={onLike}
          onSave={onSave}
        />
      ))}
    </div>
  )
}
