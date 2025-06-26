'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { supabase } from '@/lib/supabase'

interface CreatePostFormProps {
  onPostCreated: () => void
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const categories = [
    { value: 'general', label: '일반', icon: '💬' },
    { value: 'exercise', label: '운동', icon: '🏃‍♂️' },
    { value: 'nutrition', label: '영양', icon: '🥗' },
    { value: 'mental_health', label: '정신건강', icon: '🧠' },
    { value: 'tips', label: '팁', icon: '💡' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title.trim() || !content.trim()) return

    setLoading(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setError('인증이 필요합니다.')
        return
      }

      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setTitle('')
        setContent('')
        setCategory('general')
        setIsOpen(false)
        onPostCreated()
      } else {
        setError(data.error || '게시글 작성 중 오류가 발생했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">게시글을 작성하려면 로그인이 필요합니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:border-wellness-blue focus:outline-none focus:ring-2 focus:ring-wellness-blue focus:border-transparent transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-wellness-blue rounded-full flex items-center justify-center text-white font-semibold">
              {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0)}
            </div>
            <span className="text-gray-500">무엇을 공유하고 싶으신가요?</span>
          </div>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">새 게시글 작성</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          {/* Category Selection */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wellness-blue focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시글 제목을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wellness-blue focus:border-transparent"
              required
              maxLength={100}
              autoComplete="off"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="게시글 내용을 입력하세요"
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wellness-blue focus:border-transparent resize-none"
              rows={4}
              required
              maxLength={1000}
              autoComplete="off"
            />
            <div className="mt-1 text-xs text-gray-500 text-right">
              {content.length}/1000
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 font-medium transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="px-4 py-2 bg-wellness-blue text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '작성 중...' : '게시하기'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}