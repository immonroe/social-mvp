import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // First check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured - please set environment variables',
        configured: false
      }, { status: 500 })
    }

    // Test database connection by trying to count boards
    const { data, error } = await supabase
      .from('boards')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: `Database error: ${error.message}`,
        configured: true
      }, { status: 500 })
    }

    // Test storage connection
    const { data: buckets, error: storageError } = await supabase
      .storage
      .listBuckets()

    const imagesBucket = buckets?.find(bucket => bucket.name === 'images')

    return NextResponse.json({
      success: true,
      message: 'Supabase integration working!',
      configured: true,
      database: 'Connected ✅',
      storage: imagesBucket ? 'Images bucket found ✅' : 'Images bucket missing ❌',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) + '...',
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Connection failed: ${error.message}`,
      configured: isSupabaseConfigured()
    }, { status: 500 })
  }
}
