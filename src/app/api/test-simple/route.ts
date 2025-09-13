import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Environment variables missing',
        url: !!supabaseUrl,
        key: !!supabaseKey
      })
    }

    // Create fresh client
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Simple ping test - just check if we can connect
    const { data, error } = await supabase
      .from('boards')
      .select('count')
      .limit(0)
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: `Supabase error: ${error.message}`,
        code: error.code,
        details: error.details,
        hint: error.hint,
        supabaseUrl: supabaseUrl.slice(0, 30) + '...'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      supabaseUrl: supabaseUrl.slice(0, 30) + '...',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `Fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      stack: error instanceof Error ? error.stack?.slice(0, 200) : undefined
    })
  }
}
