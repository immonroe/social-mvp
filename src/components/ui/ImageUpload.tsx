'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  onUpload: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  className?: string
}

export function ImageUpload({ 
  onUpload, 
  maxFiles = 10, 
  maxSize = 10,
  className 
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [previewFiles, setPreviewFiles] = useState<File[]>([])
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFiles = useCallback((files: FileList): File[] => {
    const validFiles: File[] = []
    const errors: string[] = []

    Array.from(files).forEach((file) => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not an image file`)
        return
      }

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name} is larger than ${maxSize}MB`)
        return
      }

      // Check total files
      if (validFiles.length + previewFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`)
        return
      }

      validFiles.push(file)
    })

    if (errors.length > 0) {
      setError(errors.join(', '))
    } else {
      setError('')
    }

    return validFiles
  }, [maxFiles, maxSize, previewFiles.length])

  const handleFiles = useCallback((files: FileList) => {
    const validFiles = validateFiles(files)
    if (validFiles.length > 0) {
      setPreviewFiles(prev => [...prev, ...validFiles])
    }
  }, [validateFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const removeFile = useCallback((index: number) => {
    setPreviewFiles(prev => prev.filter((_, i) => i !== index))
    setError('')
  }, [])

  const handleUpload = useCallback(() => {
    if (previewFiles.length > 0) {
      onUpload(previewFiles)
      setPreviewFiles([])
      setError('')
    }
  }, [previewFiles, onUpload])

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragOver 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 hover:border-gray-400',
          previewFiles.length > 0 && 'border-green-500 bg-green-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-600" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragOver ? 'Drop images here' : 'Upload images'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop or{' '}
              <button
                type="button"
                onClick={openFileDialog}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                browse files
              </button>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Up to {maxFiles} files, {maxSize}MB each
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={openFileDialog}
            className="mt-4"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Choose Images
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Preview Files */}
      {previewFiles.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">
              Selected Images ({previewFiles.length})
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreviewFiles([])}
            >
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previewFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="mt-1 text-xs text-gray-500 truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleUpload} className="px-8">
              Upload {previewFiles.length} Image{previewFiles.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
