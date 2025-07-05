import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

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
      console.error('No authorization header')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.replace('Bearer ', '')
    
    // 서버측에서 토큰 검증
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!user) {
      console.error('No user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, category } = body

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('Creating post for user:', user.id)

    // 사용자 레코드 확인 및 생성
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingUser) {
      console.log('Creating user record for:', user.id)
      const { error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || null
        })
      
      if (userError) {
        console.error('Failed to create user record:', userError)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }
    }

    // 관리자 클라이언트로 직접 삽입
    const { data: post, error } = await supabaseAdmin
      .from('community_posts')
      .insert({
        user_id: user.id,
        title,
        content,
        category
      })
      .select(`
        *,
        users:user_id (
          name,
          email
        )
      `)
      .single()

    if (error) {
      console.error('Database error:', error)
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