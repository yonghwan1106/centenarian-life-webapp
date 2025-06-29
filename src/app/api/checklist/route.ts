import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Get user_id from query parameter for now (temporary solution)
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    const userId = searchParams.get('user_id')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    // Use service role for database operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Fetch checklist data for specific date
    const { data: checklist, error } = await supabase
      .from('daily_wellness_checklists')
      .select('*')
      .eq('user_id', userId)
      .eq('checklist_date', date)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching checklist:', error)
      return NextResponse.json({ error: 'Failed to fetch checklist' }, { status: 500 })
    }

    return NextResponse.json({ 
      checklist: checklist || null,
      date 
    })

  } catch (error) {
    console.error('Checklist GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Use service role for database operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const body = await request.json()
    const { 
      checklistData, 
      reflectionData, 
      completionPercentage, 
      totalItems, 
      completedItems,
      date,
      userId
    } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    const checklistDate = date || new Date().toISOString().split('T')[0]

    // Upsert checklist data
    const { data: checklist, error } = await supabase
      .from('daily_wellness_checklists')
      .upsert({
        user_id: userId,
        checklist_date: checklistDate,
        checklist_data: checklistData,
        reflection_data: reflectionData,
        completion_percentage: completionPercentage,
        total_items: totalItems,
        completed_items: completedItems
      }, {
        onConflict: 'user_id,checklist_date'
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving checklist:', error)
      return NextResponse.json({ error: 'Failed to save checklist' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      checklist 
    })

  } catch (error) {
    console.error('Checklist POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Use service role for database operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const userId = searchParams.get('user_id')

    if (!date || !userId) {
      return NextResponse.json({ error: 'Date and User ID parameters required' }, { status: 400 })
    }

    // Delete checklist data for specific date
    const { error } = await supabase
      .from('daily_wellness_checklists')
      .delete()
      .eq('user_id', userId)
      .eq('checklist_date', date)

    if (error) {
      console.error('Error deleting checklist:', error)
      return NextResponse.json({ error: 'Failed to delete checklist' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Checklist DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}