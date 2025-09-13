import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { BoardProvider } from '@/contexts/BoardContext'
import { SearchProvider } from '@/contexts/SearchContext'
import { OfflineNotification } from '@/components/ui/OfflineNotification'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PinBoard - Organize Your Inspiration',
  description: 'A Pinterest-style app for organizing and sharing your favorite images',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AuthProvider>
          <BoardProvider>
            <SearchProvider>
              {children}
              <OfflineNotification />
            </SearchProvider>
          </BoardProvider>
        </AuthProvider>
      </body>
    </html>
  )
}