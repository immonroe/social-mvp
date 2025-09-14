'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Home, 
  User, 
  LogOut, 
  Upload, 
  PlusIcon, 
  Bookmark
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
  }

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Boards', href: '/boards', icon: Bookmark },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-200 z-50 flex flex-col">
      {/* Logo */}
      <div className="p-4 pb-6 border-b border-gray-200 flex justify-center">
        <Link href="/" className="flex items-center justify-center">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 pt-6 pb-4 space-y-3">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.name} href={item.href} title={item.name}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-center h-11 p-0',
                  isActive(item.href)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className="w-6 h-6" />
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-gray-200">
        {user ? (
          <div className="space-y-3">
            {/* Upload Button */}
            <Link href="/upload" title="Upload">
              <Button className="w-full h-11 bg-red-500 hover:bg-red-600 text-white p-0">
                <Upload className="w-5 h-5" />
              </Button>
            </Link>

            {/* User Avatar */}
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            </div>

            {/* Sign Out */}
            <Button
              variant="ghost"
              className="w-full justify-center text-gray-600 hover:text-red-600 p-0 h-10"
              onClick={handleSignOut}
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Link href="/auth/login" title="Login">
              <Button variant="outline" className="w-full h-10 p-0">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/signup" title="Sign Up">
              <Button className="w-full h-10 bg-red-500 hover:bg-red-600 text-white p-0">
                <PlusIcon className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
