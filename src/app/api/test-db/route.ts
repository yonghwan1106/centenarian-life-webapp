import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Use anon key to test table existence
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Simple table check
    const { data, error } = await supabase
      .from('daily_wellness_checklists')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code 
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Table exists and accessible',
      data: data
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Server error',
      details: error
    }, { status: 500 })
  }
}