import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
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
    
    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days + 1)

    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    // Fetch checklist stats for date range
    const { data: checklists, error } = await supabase
      .from('daily_wellness_checklists')
      .select('checklist_date, completion_percentage, completed_items, total_items')
      .eq('user_id', userId)
      .gte('checklist_date', startDateStr)
      .lte('checklist_date', endDateStr)
      .order('checklist_date', { ascending: true })

    if (error) {
      console.error('Error fetching checklist stats:', error)
      return NextResponse.json({ error: 'Failed to fetch checklist stats' }, { status: 500 })
    }

    // Calculate overall stats
    const totalDays = checklists?.length || 0
    const averageCompletion = totalDays > 0 
      ? Math.round(checklists.reduce((sum: number, c: any) => sum + c.completion_percentage, 0) / totalDays)
      : 0
    
    const totalCompleted = checklists?.reduce((sum: number, c: any) => sum + c.completed_items, 0) || 0
    const totalPossible = checklists?.reduce((sum: number, c: any) => sum + c.total_items, 0) || 0

    // Get current streak
    let currentStreak = 0
    const today = new Date().toISOString().split('T')[0]
    
    // Get recent checklists to calculate streak
    const { data: recentChecklists, error: streakError } = await supabase
      .from('daily_wellness_checklists')
      .select('checklist_date, completion_percentage')
      .eq('user_id', userId)
      .lte('checklist_date', today)
      .order('checklist_date', { ascending: false })
      .limit(30)

    if (!streakError && recentChecklists) {
      let checkDate = new Date(today)
      
      for (const checklist of recentChecklists) {
        const checklistDate = new Date(checklist.checklist_date)
        const expectedDate = checkDate.toISOString().split('T')[0]
        
        if (checklist.checklist_date === expectedDate && checklist.completion_percentage >= 50) {
          currentStreak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          break
        }
      }
    }

    return NextResponse.json({
      stats: {
        totalDays,
        averageCompletion,
        totalCompleted,
        totalPossible,
        currentStreak,
        daysInRange: days
      },
      dailyStats: checklists || []
    })

  } catch (error) {
    console.error('Checklist stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}