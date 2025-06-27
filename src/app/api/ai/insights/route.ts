import { NextRequest, NextResponse } from 'next/server'
import { generateHealthInsight } from '@/lib/openai'
import { database } from '@/lib/database'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Authorization 헤더에서 토큰 가져오기
    const authorization = request.headers.get('authorization')
    if (!authorization) {
      console.log('No authorization header')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.log('Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('User ID for AI insights:', user.id)

    // 최근 건강 데이터 가져오기
    const { data: latestHealthData, error: healthError } = await database.getLatestHealthData(user.id)
    
    console.log('Latest health data:', latestHealthData)
    console.log('Health data error:', healthError)
    
    if (healthError) {
      console.error('Failed to fetch health data:', healthError)
      return NextResponse.json({ error: 'Failed to fetch health data' }, { status: 500 })
    }

    if (!latestHealthData) {
      console.log('No health data found for user:', user.id)
      return NextResponse.json({ 
        insight: '건강 데이터를 먼저 입력해주시면 AI가 분석해드릴게요! 💪',
        message: 'No health data available',
        userId: user.id
      })
    }

    // AI 인사이트 생성
    const insight = await generateHealthInsight(latestHealthData)

    return NextResponse.json({ 
      insight,
      healthData: latestHealthData,
      message: 'AI 인사이트가 생성되었습니다.'
    })

  } catch (error) {
    console.error('Error generating AI insight:', error)
    return NextResponse.json({ 
      insight: '죄송합니다. 잠시 후 다시 시도해주세요.',
      error: 'Internal server error' 
    }, { status: 500 })
  }
}