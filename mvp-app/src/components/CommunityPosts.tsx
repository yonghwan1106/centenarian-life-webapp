'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import { supabase } from '@/lib/supabase'

interface CommunityPost {
  id: string
  title: string
  content: string
  category: string
  likes_count: number
  comments_count: number
  created_at: string
  user_id: string
}

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
}

export default function CommunityPosts() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({})
  const [newComment, setNewComment] = useState('')

  const categories = [
    { value: 'all', label: '전체', icon: '📋' },
    { value: 'general', label: '일반', icon: '💬' },
    { value: 'exercise', label: '운동', icon: '🏃‍♂️' },
    { value: 'nutrition', label: '영양', icon: '🥗' },
    { value: 'mental_health', label: '정신건강', icon: '🧠' },
    { value: 'tips', label: '팁', icon: '💡' }
  ]

  useEffect(() => {
    loadPosts()
  }, [selectedCategory])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/community/posts?category=${selectedCategory}&limit=20`)
      const data = await response.json()
      
      if (response.ok) {
        setPosts(data.posts || [])
      } else {
        setError(data.error || '게시글을 불러오는 중 오류가 발생했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`)
      const data = await response.json()
      
      if (response.ok) {
        setComments(prev => ({
          ...prev,
          [postId]: data.comments || []
        }))
      }
    } catch (err) {
      console.error('Error loading comments:', err)
    }
  }

  const togglePost = async (postId: string) => {
    if (expandedPost === postId) {
      setExpandedPost(null)
    } else {
      setExpandedPost(postId)
      if (!comments[postId]) {
        await loadComments(postId)
      }
    }
  }

  const handleLike = async (postId: string) => {
    if (!user) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likes_count: data.liked 
                  ? post.likes_count + 1 
                  : post.likes_count - 1 
              }
            : post
        ))
      }
    } catch (err) {
      console.error('Error liking post:', err)
    }
  }

  const handleComment = async (postId: string) => {
    if (!user || !newComment.trim()) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        setNewComment('')
        await loadComments(postId)
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, comments_count: post.comments_count + 1 }
            : post
        ))
      }
    } catch (err) {
      console.error('Error creating comment:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[1]
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600">게시글을 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.value
                ? 'bg-wellness-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-700 text-sm">{error}</div>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">아직 게시글이 없습니다.</div>
            <div className="text-sm text-gray-400">첫 번째 게시글을 작성해보세요!</div>
          </div>
        ) : (
          posts.map((post) => {
            const categoryInfo = getCategoryInfo(post.category)
            const isExpanded = expandedPost === post.id
            const postComments = comments[post.id] || []

            return (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border p-6">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-wellness-blue rounded-full flex items-center justify-center text-white font-semibold">
                      U
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        익명 사용자
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(post.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{categoryInfo.icon}</span>
                    <span className="text-sm text-gray-600">{categoryInfo.label}</span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      disabled={!user}
                      className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <span className="text-lg">❤️</span>
                      <span className="text-sm">{post.likes_count}</span>
                    </button>
                    <button
                      onClick={() => togglePost(post.id)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-wellness-blue transition-colors"
                    >
                      <span className="text-lg">💬</span>
                      <span className="text-sm">{post.comments_count}</span>
                    </button>
                  </div>
                  <button
                    onClick={() => togglePost(post.id)}
                    className="text-sm text-wellness-blue hover:text-blue-700 font-medium"
                  >
                    {isExpanded ? '접기' : '댓글 보기'}
                  </button>
                </div>

                {/* Comments Section */}
                {isExpanded && (
                  <div className="mt-6 pt-4 border-t">
                    {/* Comment Form */}
                    {user && (
                      <div className="mb-4">
                        <div className="flex space-x-3">
                          <div className="w-8 h-8 bg-wellness-blue rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="댓글을 작성해주세요..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-wellness-blue focus:border-transparent"
                              rows={2}
                              autoComplete="off"
                            />
                            <button
                              onClick={() => handleComment(post.id)}
                              disabled={!newComment.trim()}
                              className="mt-2 px-4 py-2 bg-wellness-blue text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              댓글 작성
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-3">
                      {postComments.map((comment) => (
                        <div key={comment.id} className="flex space-x-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold">
                            C
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                  익명 사용자
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(comment.created_at)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {postComments.length === 0 && (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          아직 댓글이 없습니다.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}