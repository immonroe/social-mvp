import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Try to access the images bucket directly
    const { data, error } = await supabase
      .storage
      .from('images')
      .list()

    if (error) {
      return NextResponse.json({
        success: false,
        error: `Direct bucket access error: ${error.message}`,
        errorCode: error.statusCode,
        bucketAccessible: false
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Images bucket is accessible!',
      bucketAccessible: true,
      fileCount: data?.length || 0,
      files: data?.slice(0, 3) || [], // Show first 3 files if any
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `Direct bucket test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      bucketAccessible: false
    })
  }
}
