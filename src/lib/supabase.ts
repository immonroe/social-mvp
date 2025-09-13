import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-key'
}

// Types for our database tables
export type Database = {
  public: {
    Tables: {
      boards: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      images: {
        Row: {
          id: string
          user_id: string
          filename: string
          url: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          filename: string
          url: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          filename?: string
          url?: string
          created_at?: string
        }
      }
      board_pins: {
        Row: {
          id: string
          board_id: string
          image_id: string
          created_at: string
        }
        Insert: {
          id?: string
          board_id: string
          image_id: string
          created_at?: string
        }
        Update: {
          id?: string
          board_id?: string
          image_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
