import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    const { liked, error } = await database.toggleLike(id, user.id)

    if (error) {
      return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
    }

    return NextResponse.json({ 
      liked,
      message: liked ? '좋아요를 눌렀습니다.' : '좋아요를 취소했습니다.'
    })

  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}