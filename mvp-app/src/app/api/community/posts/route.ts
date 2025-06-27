import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const limit = parseInt(searchParams.get('limit') || '20')

    const { data: posts, error } = await database.getCommunityPosts(category, limit)
    
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    return NextResponse.json({ posts })

  } catch (error) {
    console.error('Error fetching community posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

    const body = await request.json()
    const { title, content, category } = body

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: post, error } = await database.createCommunityPost({
      user_id: user.id,
      title,
      content,
      category
    })

    if (error) {
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }

    return NextResponse.json({ 
      post,
      message: '게시글이 성공적으로 작성되었습니다.'
    })

  } catch (error) {
    console.error('Error creating community post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}