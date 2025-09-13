import type { Database } from '@/lib/supabase'

// Re-export database types for easier importing
export type Board = Database['public']['Tables']['boards']['Row']
export type BoardInsert = Database['public']['Tables']['boards']['Insert']
export type BoardUpdate = Database['public']['Tables']['boards']['Update']

export type Image = Database['public']['Tables']['images']['Row']
export type ImageInsert = Database['public']['Tables']['images']['Insert']

export type BoardPin = Database['public']['Tables']['board_pins']['Row']
export type BoardPinInsert = Database['public']['Tables']['board_pins']['Insert']

// UI Component Props
export interface BoardCardProps {
  board: Board
  onEdit?: (board: Board) => void
  onDelete?: (boardId: string) => void
}

export interface PinCardProps {
  image: Image
  onRemove?: (imageId: string) => void
  onMove?: (imageId: string) => void
}

export interface ImageUploadProps {
  onUpload: (file: File) => Promise<void>
  isUploading?: boolean
  accept?: string
  maxSize?: number
}

// Form types
export interface CreateBoardForm {
  name: string
  description?: string
}

export interface LoginForm {
  email: string
  password: string
}

export interface SignupForm {
  email: string
  password: string
  confirmPassword: string
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
}

export interface UploadResponse {
  url: string
  filename: string
}

// Auth types (extending Supabase User)
export interface AuthUser {
  id: string
  email: string
  created_at: string
}

// App state types
export interface AppState {
  user: AuthUser | null
  boards: Board[]
  currentBoard: Board | null
  isLoading: boolean
  error: string | null
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}
