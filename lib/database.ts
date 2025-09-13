import { supabase } from './supabase'
import type { Database } from './supabase'

type Board = Database['public']['Tables']['boards']['Row']
type BoardInsert = Database['public']['Tables']['boards']['Insert']
type BoardUpdate = Database['public']['Tables']['boards']['Update']

type Image = Database['public']['Tables']['images']['Row']
type ImageInsert = Database['public']['Tables']['images']['Insert']

type BoardPin = Database['public']['Tables']['board_pins']['Row']
type BoardPinInsert = Database['public']['Tables']['board_pins']['Insert']

// Board operations
export const boards = {
  // Get all boards for a user
  getByUserId: async (userId: string): Promise<Board[]> => {
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Get a single board by ID
  getById: async (id: string): Promise<Board | null> => {
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create a new board
  create: async (board: BoardInsert): Promise<Board> => {
    const { data, error } = await supabase
      .from('boards')
      .insert(board)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update a board
  update: async (id: string, updates: BoardUpdate): Promise<Board> => {
    const { data, error } = await supabase
      .from('boards')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete a board
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('boards')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },
}

// Image operations
export const images = {
  // Get all images for a user
  getByUserId: async (userId: string): Promise<Image[]> => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Get images in a specific board
  getByBoardId: async (boardId: string): Promise<Image[]> => {
    const { data, error } = await supabase
      .from('board_pins')
      .select(`
        images (*)
      `)
      .eq('board_id', boardId)
    
    if (error) throw error
    return data?.map(pin => pin.images).flat() || []
  },

  // Create a new image record
  create: async (image: ImageInsert): Promise<Image> => {
    const { data, error } = await supabase
      .from('images')
      .insert(image)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete an image
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },
}

// Pin operations (many-to-many relationship between boards and images)
export const pins = {
  // Save an image to a board
  saveToBoard: async (boardId: string, imageId: string): Promise<BoardPin> => {
    const { data, error } = await supabase
      .from('board_pins')
      .insert({ board_id: boardId, image_id: imageId })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Remove an image from a board
  removeFromBoard: async (boardId: string, imageId: string): Promise<void> => {
    const { error } = await supabase
      .from('board_pins')
      .delete()
      .eq('board_id', boardId)
      .eq('image_id', imageId)
    
    if (error) throw error
  },

  // Get all pins for a board
  getByBoardId: async (boardId: string): Promise<BoardPin[]> => {
    const { data, error } = await supabase
      .from('board_pins')
      .select('*')
      .eq('board_id', boardId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },
}
