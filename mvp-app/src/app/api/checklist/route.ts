import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    // Get checklist entries for the date
    const { data: entries, error: entriesError } = await supabaseAdmin
      .from('daily_checklist_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('checklist_date', date)

    if (entriesError) {
      console.error('Error fetching checklist entries:', entriesError)
      return NextResponse.json({ error: 'Failed to fetch checklist data' }, { status: 500 })
    }

    // Get reflection for the date
    const { data: reflection, error: reflectionError } = await supabaseAdmin
      .from('daily_reflections')
      .select('*')
      .eq('user_id', user.id)
      .eq('reflection_date', date)
      .single()

    if (reflectionError && reflectionError.code !== 'PGRST116') {
      console.error('Error fetching reflection:', reflectionError)
      return NextResponse.json({ error: 'Failed to fetch reflection data' }, { status: 500 })
    }

    return NextResponse.json({
      entries: entries || [],
      reflection: reflection || null,
      date
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user ID from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, data } = body

    if (type === 'checklist') {
      const { itemId, completed, date } = data
      
      if (completed) {
        // Insert or update entry
        const { error } = await supabaseAdmin
          .from('daily_checklist_entries')
          .upsert({
            user_id: user.id,
            checklist_date: date,
            item_id: itemId,
            completed: true,
            completed_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,checklist_date,item_id'
          })

        if (error) {
          console.error('Error saving checklist entry:', error)
          return NextResponse.json({ error: 'Failed to save checklist entry' }, { status: 500 })
        }
      } else {
        // Delete entry
        const { error } = await supabaseAdmin
          .from('daily_checklist_entries')
          .delete()
          .eq('user_id', user.id)
          .eq('checklist_date', date)
          .eq('item_id', itemId)

        if (error) {
          console.error('Error deleting checklist entry:', error)
          return NextResponse.json({ error: 'Failed to delete checklist entry' }, { status: 500 })
        }
      }

      return NextResponse.json({ success: true })
    }

    if (type === 'reflection') {
      const { achievements, improvements, tomorrowGoals, date } = data
      
      const { error } = await supabaseAdmin
        .from('daily_reflections')
        .upsert({
          user_id: user.id,
          reflection_date: date,
          achievements,
          improvements,
          tomorrow_goals: tomorrowGoals
        }, {
          onConflict: 'user_id,reflection_date'
        })

      if (error) {
        console.error('Error saving reflection:', error)
        return NextResponse.json({ error: 'Failed to save reflection' }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}