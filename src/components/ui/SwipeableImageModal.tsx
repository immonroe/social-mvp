'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'
import { useSwipe } from '@/hooks/useSwipe'

interface SwipeableImageModalProps {
  isOpen: boolean
  onClose: () => void
  images: Array<{ id: string; url: string; title: string }>
  currentIndex: number
  onIndexChange: (index: number) => void
}

export function SwipeableImageModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange
}: SwipeableImageModalProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const { attachSwipeListeners } = useSwipe({
    threshold: 50,
    velocityThreshold: 0.3,
    onSwipe: (swipe) => {
      if (swipe.direction === 'left' && currentIndex < images.length - 1) {
        handleNext()
      } else if (swipe.direction === 'right' && currentIndex > 0) {
        handlePrevious()
      } else if (swipe.direction === 'down') {
        onClose()
      }
    }
  })

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const cleanup = attachSwipeListeners(modalRef.current)
      return cleanup
    }
  }, [isOpen, attachSwipeListeners])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        onIndexChange(currentIndex + 1)
        setIsTransitioning(false)
      }, 150)
    }
  }, [currentIndex, images.length, isTransitioning, onIndexChange])

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        onIndexChange(currentIndex - 1)
        setIsTransitioning(false)
      }, 150)
    }
  }, [currentIndex, isTransitioning, onIndexChange])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowLeft') {
      handlePrevious()
    } else if (e.key === 'ArrowRight') {
      handleNext()
    }
  }, [onClose, handlePrevious, handleNext])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, currentIndex, isTransitioning, handleKeyDown])

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {images.length > 1 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0 || isTransitioning}
                  className="p-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="text-sm text-gray-600">
                  {currentIndex + 1} of {images.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentIndex === images.length - 1 || isTransitioning}
                  className="p-2"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Image Content */}
        <div className="relative">
          <div className={`transition-opacity duration-150 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            <Image
              src={currentImage.url}
              alt={currentImage.title}
              width={800}
              height={600}
              className="w-full h-auto max-h-[70vh] object-contain"
              unoptimized
            />
          </div>
          
          {/* Swipe indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => onIndexChange(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-pinterest-red' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{currentImage.title}</h3>
        </div>
      </div>
    </div>
  )
}
