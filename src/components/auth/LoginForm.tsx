'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { auth } from '@/lib/auth'
import { validateEmail } from '@/lib/utils'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await auth.signIn(email, password)
      if (error) {
        setError(error.message)
      } else {
        onSuccess?.()
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setEmail('test@test.com')
    setPassword('test123')
    setError('')
    
    // Auto-submit the demo login
    setIsLoading(true)
    try {
      const { error } = await auth.signIn('test@test.com', 'test123')
      if (error) {
        // If demo account doesn't exist, try to create it
        if (error.message.includes('Invalid login credentials')) {
          const { error: signUpError } = await auth.signUp('test@test.com', 'test123')
          if (signUpError) {
            setError(signUpError.message)
          } else {
            // Try to sign in again after creating the account
            const { error: signInError } = await auth.signIn('test@test.com', 'test123')
            if (signInError) {
              setError(signInError.message)
            } else {
              onSuccess?.()
            }
          }
        } else {
          setError(error.message)
        }
      } else {
        onSuccess?.()
      }
    } catch {
      setError('Demo login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handleDemoLogin}
        type="button"
        isLoading={isLoading}
      >
        Try Demo Account
      </Button>
    </div>
  )
}
