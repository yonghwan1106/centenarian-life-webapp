import { NextRequest, NextResponse } from 'next/server'
import { generateHealthRecommendations } from '@/lib/openai'
import { database } from '@/lib/database'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Authorization 헤더에서 토큰 가져오기
    const authorization = request.headers.get('authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 최근 건강 데이터 가져오기
    const { data: healthData, error: healthError } = await database.getHealthData(user.id, 10)
    if (healthError) {
      return NextResponse.json({ error: 'Failed to fetch health data' }, { status: 500 })
    }

    // 사용자 프로필 가져오기
    const { data: userProfile, error: profileError } = await database.getUserProfile(user.id)
    if (profileError) {
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 })
    }

    // AI 추천 생성
    const recommendations = await generateHealthRecommendations(healthData, userProfile)

    // 추천을 데이터베이스에 저장
    const savedRecommendations = []
    for (const rec of recommendations) {
      const { data: savedRec, error: saveError } = await database.createHealthRecommendation({
        user_id: user.id,
        title: rec.title,
        description: rec.description,
        category: rec.category,
        priority: rec.priority,
        confidence: rec.confidence,
        is_read: false
      })
      
      if (!saveError && savedRec) {
        savedRecommendations.push(savedRec)
      }
    }

    return NextResponse.json({ 
      recommendations: savedRecommendations,
      message: `${savedRecommendations.length}개의 새로운 추천이 생성되었습니다.`
    })

  } catch (error) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authorization 헤더에서 토큰 가져오기
    const authorization = request.headers.get('authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 기존 추천 가져오기
    const { data: recommendations, error } = await database.getHealthRecommendations(user.id)
    
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
    }

    return NextResponse.json({ recommendations })

  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}