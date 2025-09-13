'use client'

import { Sidebar } from './Sidebar'
import { TopSearchBar } from './TopSearchBar'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
  className?: string
  showSearchBar?: boolean
}

export function Layout({ children, className, showSearchBar = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-16 flex flex-col">
        {showSearchBar && <TopSearchBar />}
               <main id="main-content" className={cn('flex-1', className)}>
                 {children}
               </main>
      </div>
    </div>
  )
}
