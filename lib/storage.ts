import { supabase } from './supabase'

const STORAGE_BUCKET = 'images'

// File upload and storage utilities
export const storage = {
  // Upload an image file
  uploadImage: async (file: File, userId: string): Promise<{ url: string; filename: string }> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file)
    
    if (error) throw error
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName)
    
    return {
      url: publicUrl,
      filename: fileName,
    }
  },

  // Delete an image file
  deleteImage: async (filename: string): Promise<void> => {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filename])
    
    if (error) throw error
  },

  // Get public URL for an image
  getPublicUrl: (filename: string): string => {
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filename)
    
    return publicUrl
  },

  // Generate a signed URL (for private images, if needed)
  getSignedUrl: async (filename: string, expiresIn = 3600): Promise<string> => {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(filename, expiresIn)
    
    if (error) throw error
    return data.signedUrl
  },
}
