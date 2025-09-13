'use client'

import { useState, useRef, useCallback } from 'react'

interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down' | null
  distance: number
  velocity: number
}

interface UseSwipeOptions {
  threshold?: number
  velocityThreshold?: number
  onSwipe?: (direction: SwipeDirection) => void
  preventDefault?: boolean
}

export function useSwipe(options: UseSwipeOptions = {}) {
  const {
    threshold = 50,
    velocityThreshold = 0.3,
    onSwipe,
    preventDefault = true
  } = options

  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>({
    direction: null,
    distance: 0,
    velocity: 0
  })

  const startPos = useRef<{ x: number; y: number; time: number } | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)

  const calculateSwipe = useCallback((start: { x: number; y: number; time: number }, end: { x: number; y: number; time: number }) => {
    const deltaX = end.x - start.x
    const deltaY = end.y - start.y
    const deltaTime = end.time - start.time
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const velocity = distance / deltaTime

    let direction: 'left' | 'right' | 'up' | 'down' | null = null

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        direction = deltaX > 0 ? 'right' : 'left'
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        direction = deltaY > 0 ? 'down' : 'up'
      }
    }

    return {
      direction,
      distance,
      velocity
    }
  }, [threshold])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault()
    }
    
    const touch = e.touches[0]
    startPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
  }, [preventDefault])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault()
    }

    if (!startPos.current) return

    const touch = e.changedTouches[0]
    const endPos = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }

    const swipe = calculateSwipe(startPos.current, endPos)
    
    if (swipe.direction && swipe.velocity > velocityThreshold) {
      setSwipeDirection(swipe)
      onSwipe?.(swipe)
    }

    startPos.current = null
  }, [calculateSwipe, velocityThreshold, onSwipe, preventDefault])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault()
    }
  }, [preventDefault])

  const attachSwipeListeners = useCallback((element: HTMLElement) => {
    elementRef.current = element
    
    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault })
    element.addEventListener('touchend', handleTouchEnd, { passive: !preventDefault })
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefault })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handleTouchStart, handleTouchEnd, handleTouchMove, preventDefault])

  return {
    swipeDirection,
    attachSwipeListeners,
    elementRef
  }
}
