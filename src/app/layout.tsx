import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { BoardProvider } from '@/contexts/BoardContext'

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
        <AuthProvider>
          <BoardProvider>
            {children}
          </BoardProvider>
        </AuthProvider>
      </body>
    </html>
  )
}