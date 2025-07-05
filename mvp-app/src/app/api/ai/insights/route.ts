import { NextRequest, NextResponse } from 'next/server'
import { generateHealthInsight } from '@/lib/openai'
import { database } from '@/lib/database'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

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

    // AI 인사이트 생성 (타임아웃 추가)
    console.log('Generating AI insight...')
    const insight = await Promise.race([
      generateHealthInsight(latestHealthData),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI request timeout')), 25000) // 25초 타임아웃
      )
    ]) as string

    console.log('AI insight generated successfully')
    return NextResponse.json({ 
      insight,
      healthData: latestHealthData,
      message: 'AI 인사이트가 생성되었습니다.'
    })

  } catch (error) {
    console.error('Error generating AI insight:', error)
    
    // 타임아웃 또는 API 에러 시 기본 응답
    const fallbackInsight = '건강 관리에 신경써주셔서 감사합니다! 꾸준히 기록해주세요! 💪'
    
    return NextResponse.json({ 
      insight: fallbackInsight,
      error: 'AI 분석 중 오류가 발생했지만 기본 조언을 제공합니다.',
      fallback: true
    })
  }
}