import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { auth } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 인증 확인
    const user = await auth.getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // 추천을 읽음으로 표시
    if (body.action === 'mark_read') {
      const { data, error } = await database.markRecommendationAsRead(id)
      
      if (error) {
        return NextResponse.json({ error: 'Failed to update recommendation' }, { status: 500 })
      }

      return NextResponse.json({ 
        recommendation: data,
        message: '추천이 읽음으로 표시되었습니다.'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Error updating recommendation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}