'use client'

import Image from 'next/image'
import { Button } from '../ui/Button'
import { Heart, Bookmark, MoreVertical, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PinCardProps {
  pin: {
    id: string
    imageUrl: string
    title: string
    boardIds: string[]
    createdAt: Date
  }
  onRemove?: (pinId: string) => void
  onMove?: (pinId: string) => void
  onLike?: (pinId: string) => void
  onSave?: (pinId: string) => void
  className?: string
}

export function PinCard({ 
  pin, 
  onRemove, 
  onMove, 
  onLike, 
  onSave, 
  className 
}: PinCardProps) {
  return (
    <div className={cn(
      'group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow',
      className
    )}>
      <div className="relative">
        <Image
          src={pin.imageUrl}
          alt={pin.title}
          width={300}
          height={400}
          className="w-full h-auto hover:opacity-95 transition-opacity"
        />
        
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
            {onLike && (
              <Button 
                size="sm" 
                className="bg-white/90 hover:bg-white"
                onClick={() => onLike(pin.id)}
              >
                <Heart className="w-4 h-4" />
              </Button>
            )}
            {onSave && (
              <Button 
                size="sm" 
                className="bg-white/90 hover:bg-white"
                onClick={() => onSave(pin.id)}
              >
                <Bookmark className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Top right menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            {onMove && (
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/90 hover:bg-white text-gray-600"
                onClick={() => onMove(pin.id)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            )}
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                onClick={() => onRemove(pin.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate">{pin.title}</p>
        <p className="text-xs text-gray-500 mt-1">
          Saved to {pin.boardIds.length} board{pin.boardIds.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
