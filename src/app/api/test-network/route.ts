import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ebwirhygytymqucnjwl.supabase.co'
    
    // Test basic HTTP connectivity to Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Network connection to Supabase successful!',
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      url: supabaseUrl
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `Network test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      cause: error instanceof Error && 'cause' in error ? error.cause : undefined,
      stack: error instanceof Error ? error.stack?.slice(0, 300) : undefined
    })
  }
}
