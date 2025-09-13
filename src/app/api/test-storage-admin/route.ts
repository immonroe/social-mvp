import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing service role key or URL',
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!serviceRoleKey
      })
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
    
    // List all buckets using admin privileges
    const { data: buckets, error } = await supabaseAdmin
      .storage
      .listBuckets()

    if (error) {
      return NextResponse.json({
        success: false,
        error: `Admin storage error: ${error.message}`,
        buckets: null
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Admin storage access successful',
      buckets: buckets || [],
      bucketNames: buckets?.map(b => b.name) || [],
      imagesBucketExists: buckets?.some(b => b.name === 'images') || false,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `Admin test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      buckets: null
    })
  }
}
