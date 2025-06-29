import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    
    // Check if table exists by trying to select from it
    const { data: existingTable, error: checkError } = await supabase
      .from('daily_wellness_checklists')
      .select('count')
      .limit(1)

    if (!checkError) {
      return NextResponse.json({ success: true, message: 'Table already exists' })
    }

    // If table doesn't exist (PGRST116 = not found), return info
    if (checkError.code === 'PGRST116') {
      return NextResponse.json({ 
        success: false, 
        message: 'Table does not exist - need to create it manually in Supabase dashboard',
        error: checkError 
      })
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Other error occurred',
      error: checkError 
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}