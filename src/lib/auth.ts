import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

// Authentication helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Demo account credentials (for testing)
  demoSignIn: async () => {
    const DEMO_EMAIL = 'test@test.com'
    const DEMO_PASSWORD = 'test123'
    
    try {
      // First try to sign in with demo credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      })

      if (error) {
        // If demo account doesn't exist, create it
        if (error.message.includes('Invalid login credentials')) {
          console.log('Creating demo account...')
          const { error: signUpError } = await supabase.auth.signUp({
            email: DEMO_EMAIL,
            password: DEMO_PASSWORD,
          })

          if (signUpError) {
            return { data: null, error: signUpError }
          }

          // If signup was successful, try to sign in again
          return await supabase.auth.signInWithPassword({
            email: DEMO_EMAIL,
            password: DEMO_PASSWORD,
          })
        }
        return { data, error }
      }

      return { data, error }
    } catch {
      return { 
        data: null, 
        error: { message: 'Demo login failed. Please try again.' } 
      }
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null)
    })
  },
}
