'use client'

import { useEffect, useState } from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import { useOffline } from '@/hooks/useOffline'

export function OfflineNotification() {
  const isOffline = useOffline()
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    if (isOffline) {
      setShowNotification(true)
    } else {
      // Hide notification after a delay when coming back online
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOffline])

  if (!showNotification) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className={`flex items-center space-x-3 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        isOffline 
          ? 'bg-orange-100 border border-orange-200 text-orange-800' 
          : 'bg-green-100 border border-green-200 text-green-800'
      }`}>
        {isOffline ? (
          <WifiOff className="w-5 h-5 flex-shrink-0" />
        ) : (
          <Wifi className="w-5 h-5 flex-shrink-0" />
        )}
        <div className="flex-1">
          <p className="text-sm font-medium">
            {isOffline ? 'You\'re offline' : 'You\'re back online'}
          </p>
          <p className="text-xs opacity-75">
            {isOffline 
              ? 'Some features may not be available' 
              : 'All features are now available'
            }
          </p>
        </div>
        <button
          onClick={() => setShowNotification(false)}
          className="text-current opacity-50 hover:opacity-75 transition-opacity"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
