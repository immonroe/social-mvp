// Validation utilities for forms and user input

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateBoardName = (name: string): boolean => {
  return name.trim().length > 0 && name.trim().length <= 100
}

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 10MB' }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File must be an image (JPEG, PNG, GIF, or WebP)' }
  }
  
  return { isValid: true }
}
