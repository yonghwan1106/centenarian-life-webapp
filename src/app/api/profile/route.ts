import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { supabase } from '@/lib/supabase'

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

    // 사용자 프로필 가져오기
    const { data: profile, error } = await database.getUserProfile(user.id)
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error fetching profile:', error)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    return NextResponse.json({ 
      profile: profile || null,
      message: 'Profile fetched successfully'
    })

  } catch (error) {
    console.error('Error in profile GET:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
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

    // 요청 본문 파싱
    const body = await request.json()
    const { age, gender, height, weight, activity_level, health_goals, medical_conditions } = body

    // 입력 검증
    if (age && (age < 1 || age > 120)) {
      return NextResponse.json({ error: 'Invalid age' }, { status: 400 })
    }

    if (height && (height < 100 || height > 250)) {
      return NextResponse.json({ error: 'Invalid height' }, { status: 400 })
    }

    if (weight && (weight < 30 || weight > 200)) {
      return NextResponse.json({ error: 'Invalid weight' }, { status: 400 })
    }

    if (gender && !['male', 'female', 'other'].includes(gender)) {
      return NextResponse.json({ error: 'Invalid gender' }, { status: 400 })
    }

    if (activity_level && !['sedentary', 'light', 'moderate', 'active', 'very_active'].includes(activity_level)) {
      return NextResponse.json({ error: 'Invalid activity level' }, { status: 400 })
    }

    // 프로필 업데이트
    const updateData = {
      age: age || null,
      gender: gender || null,
      height: height || null,
      weight: weight || null,
      activity_level: activity_level || null,
      health_goals: health_goals || [],
      medical_conditions: medical_conditions || []
    }

    const { data: updatedProfile, error } = await database.updateUserProfile(user.id, updateData)
    
    if (error) {
      console.error('Error updating profile:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ 
      profile: updatedProfile,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Error in profile PUT:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}