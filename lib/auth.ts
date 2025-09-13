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
    // This will be configured with a demo account in Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'demo@social-mvp.com',
      password: 'demo123456',
    })
    return { data, error }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null)
    })
  },
}
