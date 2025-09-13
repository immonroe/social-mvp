import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // List all buckets
    const { data: buckets, error } = await supabase
      .storage
      .listBuckets()

    if (error) {
      return NextResponse.json({
        success: false,
        error: `Storage error: ${error.message}`,
        buckets: null
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Storage buckets retrieved successfully',
      buckets: buckets || [],
      bucketNames: buckets?.map(b => b.name) || [],
      imagesBucketExists: buckets?.some(b => b.name === 'images') || false,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `Debug failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      buckets: null
    })
  }
}
